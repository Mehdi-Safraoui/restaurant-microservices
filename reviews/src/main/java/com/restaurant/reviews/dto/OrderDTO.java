package com.restaurant.reviews.dto;

import lombok.Data;

@Data
public class OrderDTO {
    private Long id;
    private Long userId;
    private String status;  // correspond au champ de votre commande-service
}