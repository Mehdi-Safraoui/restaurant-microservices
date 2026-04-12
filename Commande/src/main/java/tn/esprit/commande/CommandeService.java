package tn.esprit.commande;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.commande.Dto.*;
import tn.esprit.commande.entity.Commande;
import tn.esprit.commande.entity.CommandeStatus;
import tn.esprit.commande.entity.PaymentStatus;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class CommandeService {

    @Autowired
    private CommandeRepository commandeRepository;

    @Autowired
    private PlatClient platClient;

    @Autowired
    private UserClient userClient;

    @Autowired
    private DeliveryClient deliveryClient;

    @Autowired
    private ComplaintClient complaintClient;

    public List<Plat> getAllPlats() {
        return platClient.getAll();
    }

    public Plat getPlatById(Long id) {
        return platClient.getById(id);
    }

    // ========== USER CLIENT METHODS ==========
    public User getUserById(Long userId) {
        return userClient.getUserById(userId);
    }

    // ========== DELIVERY CLIENT METHODS ==========
    public Delivery createDelivery(Delivery delivery) {
        return deliveryClient.createDelivery(delivery);
    }

    // ========== COMPLAINT CLIENT METHODS ==========
    public Complaint createComplaint(ComplaintDTO dto) {
        return complaintClient.createComplaint(dto);
    }


    public Commande addCommande(Commande commande) {
        commande.setCreatedAt(LocalDateTime.now());
        commande.setCommandeStatus(CommandeStatus.EN_ATTENTE);
        if (commande.getPaymentStatus() == null) {
            commande.setPaymentStatus(PaymentStatus.NON_PAYEE);
        }
        return commandeRepository.save(commande);
    }

    public List<Commande> getAll() {
        return commandeRepository.findAll();
    }

    public Commande getById(Long id) {
        return commandeRepository.findById(id).orElse(null);
    }

    public Commande updateStatus(Long id, CommandeStatus status) {
        Commande cmd = commandeRepository.findById(id).orElse(null);
        if (cmd != null) {
            cmd.setCommandeStatus(status);
            Commande saved = commandeRepository.save(cmd);

            if (status == CommandeStatus.PRETE || status == CommandeStatus.EN_LIVRAISON) {
                ensureDeliveryExists(saved);
            }

            return saved;
        }
        return null;
    }

    private void ensureDeliveryExists(Commande commande) {
        Delivery delivery = new Delivery();
        delivery.setOrderId(commande.getId());
        delivery.setTotalPrice(commande.getTotalPrice());
        delivery.setDeliveryAddress(commande.getDeliveryAddress());
        delivery.setStatus("CREATED");
        try {
            deliveryClient.createDelivery(delivery);
        } catch (Exception ignored) {
            // Une livraison existe probablement deja pour cette commande.
        }
    }

    public void delete(Long id) {
        commandeRepository.deleteById(id);
    }

    //yassmine rabitMq

    private List<Plat> plats = new ArrayList<>();

    public void addPlat(Plat platDTO) {
        plats.add(platDTO);
        System.out.println("✅ Ajouté à la commande : " + platDTO.getNom());
    }
}
