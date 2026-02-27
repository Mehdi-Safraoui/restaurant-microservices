package tn.esprit.commande;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.esprit.commande.Dto.Plat;
import tn.esprit.commande.entity.Commande;
import tn.esprit.commande.entity.CommandeStatus;

import java.util.List;

@RestController
@RequestMapping("/commandes")
public class CommandeRestApi {

    @Autowired
    private CommandeService commandeService;

    @PostMapping
    public Commande create(@RequestBody Commande commande) {
        return commandeService.addCommande(commande);
    }

    @GetMapping
    public List<Commande> getAll() {
        return commandeService.getAll();
    }

    @PutMapping("/{id}/{status}")
    public Commande updateStatus(@PathVariable Long id,
                                 @PathVariable CommandeStatus status) {
        return commandeService.updateStatus(id, status);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        commandeService.delete(id);
    }

    @GetMapping("/plats")
    public List<Plat> getAllPlats() {
        return commandeService.getAllPlats();
    }

    @GetMapping("/plats/{id}")
    public Plat getPlatById(@PathVariable Long id) {
        return commandeService.getPlatById(id);
    }

}
