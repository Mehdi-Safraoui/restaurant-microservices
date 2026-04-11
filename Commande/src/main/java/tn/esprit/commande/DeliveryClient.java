package tn.esprit.commande;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import tn.esprit.commande.Dto.Delivery;

@FeignClient(name = "microserviceLivraison")
public interface DeliveryClient {

    @PostMapping("/api/deliveries")
    Delivery createDelivery(@RequestBody Delivery delivery);

}


