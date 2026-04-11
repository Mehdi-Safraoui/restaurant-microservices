package tn.esprit.microservicelivraison;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RefreshScope
@RestController
@RequestMapping("/api/deliveries")
@RequiredArgsConstructor
public class DeliveryController {
    private final DeliveryService deliveryService;

    @PostMapping
    public Delivery create(@RequestBody Delivery delivery){
        return deliveryService.createDelivery(delivery);
    }

    @PutMapping("/{id}/assign/{deliveryPersonId}")
    public Delivery assign(@PathVariable Long id, @PathVariable Long deliveryPersonId){
        return deliveryService.assignDelivery(id, deliveryPersonId);
    }

    @PutMapping("/{id}/status")
    public Delivery updateStatus(@PathVariable Long id, @RequestParam DeliveryStatus status){
        return deliveryService.updateStatus(id, status);
    }

    @GetMapping
    public List<Delivery> getAll(){
        return deliveryService.getAll();
    }

    @Value("${welcome.message}")
    private String welcomeMessage;
    @GetMapping("/welcome")
    public String welcome() {
        return welcomeMessage;
    }

    // Endpoint temporairement ouvert; l'autorisation sera gérée au niveau API Gateway.
    @PostMapping("/user/add")
    public ResponseEntity<?> addDelivery(@RequestBody Delivery delivery) {
        Delivery created = deliveryService.createDelivery(delivery);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // Endpoint temporairement ouvert; l'autorisation sera gérée au niveau API Gateway.
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<?> deleteDelivery(@PathVariable Long id) {
        deliveryService.deleteDelivery(id);
        return ResponseEntity.ok("Livraison supprimée");
    }
}

