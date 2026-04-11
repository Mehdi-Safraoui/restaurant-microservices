package tn.esprit.commande.Dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ComplaintDTO {
    private Long orderId;
    private Long userId;
    private String description;
    private String category;
}

