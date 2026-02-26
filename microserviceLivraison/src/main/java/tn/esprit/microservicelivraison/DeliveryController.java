package tn.esprit.microservicelivraison;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
}
