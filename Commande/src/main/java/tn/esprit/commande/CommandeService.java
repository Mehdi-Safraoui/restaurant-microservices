package tn.esprit.commande;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.commande.entity.Commande;
import tn.esprit.commande.entity.CommandeStatus;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CommandeService {

    @Autowired
    private CommandeRepository commandeRepository;

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
