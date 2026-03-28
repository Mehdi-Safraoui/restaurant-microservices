package tn.esprit.commande;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.commande.Dto.*;
import tn.esprit.commande.entity.Commande;
import tn.esprit.commande.entity.CommandeStatus;

import java.time.LocalDateTime;
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
        return commandeRepository.save(commande);
    }

    public List<Commande> getAll() {
        return commandeRepository.findAll();
    }

    public Commande updateStatus(Long id, CommandeStatus status) {
        Commande cmd = commandeRepository.findById(id).orElse(null);
        if (cmd != null) {
            cmd.setCommandeStatus(status);
            return commandeRepository.save(cmd);
        }
        return null;
    }

    public void delete(Long id) {
        commandeRepository.deleteById(id);
    }

}
