package com.restaurant.reviews.service;

import com.restaurant.reviews.dto.ReviewDTO;
import com.restaurant.reviews.entity.Review;
import com.restaurant.reviews.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;

    public Review addReview(ReviewDTO dto) {
        Review review = new Review();
        review.setUserId(dto.getUserId());
        review.setDishId(dto.getDishId());
        review.setRating(dto.getRating());
        review.setComment(dto.getComment());

        return reviewRepository.save(review);
    }

    public List<Review> getApprovedReviews(Long dishId) {
        return reviewRepository.findByDishIdAndStatus(dishId, "APPROVED");
    }

    public Double getAverageRating(Long dishId) {
        return reviewRepository.calculateAverageRating(dishId);
    }

    public Review approveReview(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        review.setStatus("APPROVED");
        return reviewRepository.save(review);
    }
}