package tn.esprit.gestionplatservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.gestionplatservice.entity.Plat;

public interface PlatRepository extends JpaRepository<Plat, Long> {
}
