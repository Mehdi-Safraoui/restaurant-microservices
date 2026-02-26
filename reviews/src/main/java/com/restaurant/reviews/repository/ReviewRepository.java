package com.restaurant.reviews.repository;

import com.restaurant.reviews.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByDishIdAndStatus(Long dishId, String status);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.dishId = :dishId AND r.status = 'APPROVED'")
    Double calculateAverageRating(Long dishId);
}