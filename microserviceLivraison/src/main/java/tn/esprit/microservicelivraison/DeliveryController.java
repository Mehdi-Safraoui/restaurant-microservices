package tn.esprit.microservicelivraison;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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

    // ✅ Autorisé pour "user" — ajouter un livreur
    @PostMapping("/user/add")
    public ResponseEntity<?> addDelivery(
            @RequestBody Delivery delivery,
            @AuthenticationPrincipal Jwt jwt) {

        List<String> roles = getRoles(jwt);

        if (roles.contains("user")) {
            Delivery created = deliveryService.createDelivery(delivery);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    // ✅ Autorisé pour "admin" — supprimer une livraison
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<?> deleteDelivery(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt) {

        List<String> roles = getRoles(jwt);

        if (roles.contains("admin")) {
            deliveryService.deleteDelivery(id);
            return ResponseEntity.ok("Livraison supprimée");
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    // Utilitaire : extraire les rôles depuis realm_access du token JWT
    @SuppressWarnings("unchecked")
    private List<String> getRoles(Jwt jwt) {
        Map<String, Object> realmAccess = jwt.getClaimAsMap("realm_access");
        if (realmAccess == null) return List.of();
        return (List<String>) realmAccess.getOrDefault("roles", List.of());
    }
}

