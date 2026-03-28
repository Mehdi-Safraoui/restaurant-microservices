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
public class Complaint {
    private Long id;
    private Long orderId;
    private Long userId;
    private String description;
    private String category;
    private String status;
    private LocalDateTime createdAt;
}

