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

    public Delivery createDelivery(Delivery delivery){
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

        if(status == DeliveryStatus.DELIVERED){
            d.setDeliveredAt(LocalDateTime.now());
            d.getDeliveryPerson().setAvailable(true);
        }

        return deliveryRepository.save(d);
    }

    public List<Delivery> getAll(){
        return deliveryRepository.findAll();
    }
}