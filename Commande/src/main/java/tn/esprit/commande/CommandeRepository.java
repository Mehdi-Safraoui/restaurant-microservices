package tn.esprit.commande;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.commande.entity.Commande;

public interface CommandeRepository extends JpaRepository<Commande, Long> {
}
