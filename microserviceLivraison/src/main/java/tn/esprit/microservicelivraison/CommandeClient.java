package tn.esprit.microservicelivraison;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

@FeignClient(name = "Commande")
public interface CommandeClient {

    @GetMapping("/commandes/{id}")
    OrderDTO getOrderById(@PathVariable("id") Long id);

    @PutMapping("/commandes/{id}/{status}")
    OrderDTO updateOrderStatus(@PathVariable("id") Long id, @PathVariable("status") String status);
}
