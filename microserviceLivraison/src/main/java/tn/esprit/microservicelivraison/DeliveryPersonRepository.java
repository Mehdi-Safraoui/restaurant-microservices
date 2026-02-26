package tn.esprit.microservicelivraison;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface DeliveryPersonRepository extends JpaRepository<DeliveryPerson, Long> {
    List<DeliveryPerson> findByAvailableTrue();
}
