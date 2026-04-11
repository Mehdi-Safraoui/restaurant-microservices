package tn.esprit.microservicelivraison;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "Commande")
public interface CommandeClient {

    @GetMapping("/commandes/{id}")
    OrderDTO getOrderById(@PathVariable("id") Long id);
}
