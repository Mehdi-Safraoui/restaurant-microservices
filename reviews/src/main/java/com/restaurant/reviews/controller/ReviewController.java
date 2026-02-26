package com.restaurant.reviews.controller;

import com.restaurant.reviews.dto.ReviewDTO;
import com.restaurant.reviews.entity.Review;
import com.restaurant.reviews.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<Review> createReview(@RequestBody ReviewDTO dto) {
        return ResponseEntity.ok(reviewService.addReview(dto));
    }

    @GetMapping("/dish/{dishId}")
    public ResponseEntity<List<Review>> getReviews(@PathVariable Long dishId) {
        return ResponseEntity.ok(reviewService.getApprovedReviews(dishId));
    }

    @GetMapping("/average/{dishId}")
    public ResponseEntity<Double> getAverage(@PathVariable Long dishId) {
        return ResponseEntity.ok(reviewService.getAverageRating(dishId));
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<Review> approve(@PathVariable Long id) {
        return ResponseEntity.ok(reviewService.approveReview(id));
    }
}