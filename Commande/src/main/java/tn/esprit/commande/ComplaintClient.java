package tn.esprit.commande;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import tn.esprit.commande.Dto.Complaint;
import tn.esprit.commande.Dto.ComplaintDTO;

@FeignClient(name = "reviews-service")
public interface ComplaintClient {

    @PostMapping("/api/complaints")
    Complaint createComplaint(@RequestBody ComplaintDTO dto);

}


