package com.restaurant.reviews.dto;

import lombok.Data;

@Data
public class ComplaintDTO {
    private Long userId;
    private Long orderId;
    private String message;
}