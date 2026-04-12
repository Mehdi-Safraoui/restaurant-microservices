package com.restaurant.reviews.service;

import com.restaurant.reviews.dto.ReviewDTO;
import com.restaurant.reviews.dto.UserDTO;
import com.restaurant.reviews.entity.Review;
import com.restaurant.reviews.feign.UserClient;
import com.restaurant.reviews.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserClient userClient;          // ← injecté

    public Review addReview(ReviewDTO dto) {
        if (dto.getUserId() == null || dto.getDishId() == null) {
            throw new RuntimeException("userId et dishId sont requis");
        }

        if (dto.getRating() < 1 || dto.getRating() > 5) {
            throw new RuntimeException("La note doit etre comprise entre 1 et 5");
        }

        // Validation distante best-effort seulement. USER-SERVICE est securise,
        // donc on n'interrompt pas la creation si l'appel Feign echoue.
        try {
            UserDTO user = userClient.getUserById(dto.getUserId());
            if (user == null) {
                log.warn("Utilisateur introuvable lors de la creation d'un avis: {}", dto.getUserId());
            }
        } catch (Exception ex) {
            log.warn("Validation utilisateur ignoree pour l'avis. userId={}, cause={}", dto.getUserId(), ex.getMessage());
        }

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

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
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
