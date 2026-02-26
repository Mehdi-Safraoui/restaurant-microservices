package com.restaurant.reviews.dto;

import lombok.Data;

@Data
public class ReviewDTO {

    private Long userId;
    private Long dishId;
    private int rating;
    private String comment;
}