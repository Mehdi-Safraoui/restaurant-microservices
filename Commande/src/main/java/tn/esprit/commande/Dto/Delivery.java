package tn.esprit.commande.Dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Delivery {
    private Long id;
    private Long orderId;
    private Double totalPrice;
    private String deliveryAddress;
    private Long deliveryPersonId;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime deliveredAt;
}
