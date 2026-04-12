package tn.esprit.microservicelivraison;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DeliveryService {

    private final DeliveryRepository deliveryRepository;
    private final DeliveryPersonRepository deliveryPersonRepository;
    private final CommandeClient commandeClient;

    public Delivery createDelivery(Delivery delivery){
        if (delivery.getOrderId() != null) {
            OrderDTO order = commandeClient.getOrderById(delivery.getOrderId());
            if (order == null || order.getId() == null) {
                throw new IllegalArgumentException("Commande introuvable : " + delivery.getOrderId());
            }

            if (deliveryRepository.existsByOrderId(delivery.getOrderId())) {
                throw new IllegalArgumentException("Une livraison existe deja pour la commande : " + delivery.getOrderId());
            }

            if (delivery.getTotalPrice() == null) {
                delivery.setTotalPrice(order.getTotalPrice());
            }
            if (delivery.getDeliveryAddress() == null || delivery.getDeliveryAddress().isBlank()) {
                delivery.setDeliveryAddress(order.getDeliveryAddress());
            }
        }

        if (delivery.getDeliveryAddress() == null || delivery.getDeliveryAddress().isBlank()) {
            delivery.setDeliveryAddress("Adresse non renseignee");
        }

        delivery.setStatus(DeliveryStatus.CREATED);
        delivery.setCreatedAt(LocalDateTime.now());
        return deliveryRepository.save(delivery);
    }

    public Delivery assignDelivery(Long deliveryId, Long deliveryPersonId){
        Delivery d = deliveryRepository.findById(deliveryId).orElseThrow();
        DeliveryPerson dp = deliveryPersonRepository.findById(deliveryPersonId).orElseThrow();

        d.setDeliveryPerson(dp);
        d.setStatus(DeliveryStatus.ASSIGNED);
        dp.setAvailable(false);

        deliveryPersonRepository.save(dp);
        return deliveryRepository.save(d);
    }

    public Delivery updateStatus(Long id, DeliveryStatus status){
        Delivery d = deliveryRepository.findById(id).orElseThrow();
        d.setStatus(status);

        if (status == DeliveryStatus.IN_DELIVERY && d.getOrderId() != null) {
            commandeClient.updateOrderStatus(d.getOrderId(), "EN_LIVRAISON");
        }

        if(status == DeliveryStatus.DELIVERED){
            d.setDeliveredAt(LocalDateTime.now());
            if (d.getDeliveryPerson() != null) {
                d.getDeliveryPerson().setAvailable(true);
                deliveryPersonRepository.save(d.getDeliveryPerson());
            }
            if (d.getOrderId() != null) {
                commandeClient.updateOrderStatus(d.getOrderId(), "LIVREE");
            }
        }

        return deliveryRepository.save(d);
    }

    public List<Delivery> getAll(){
        return deliveryRepository.findAll();
    }

    public void deleteDelivery(Long id) {
        deliveryRepository.deleteById(id);
    }

    public void deleteAllDeliveries() {
        List<DeliveryPerson> deliveryPeople = deliveryPersonRepository.findAll();
        deliveryPeople.forEach(person -> person.setAvailable(true));
        deliveryPersonRepository.saveAll(deliveryPeople);
        deliveryRepository.deleteAll();
    }
}
