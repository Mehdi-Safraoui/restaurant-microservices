package tn.esprit.gestionplatservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.gestionplatservice.entity.Ingredient;

public interface IngredientRepository extends JpaRepository<Ingredient, Long> {
}