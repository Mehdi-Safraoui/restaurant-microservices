package tn.esprit.gestionplatservice.controller;
import org.springframework.web.bind.annotation.*;
import tn.esprit.gestionplatservice.entity.Ingredient;
import tn.esprit.gestionplatservice.repository.IngredientRepository;

import java.util.List;

@RestController
@RequestMapping("/ingredients")
public class IngredientController {
    private final IngredientRepository ingredientRepository;

    public IngredientController(IngredientRepository ingredientRepository) {
        this.ingredientRepository = ingredientRepository;
    }

    @PostMapping
    public Ingredient create(@RequestBody Ingredient ingredient) {
        return ingredientRepository.save(ingredient);
    }

    @GetMapping
    public List<Ingredient> getAll() {
        return ingredientRepository.findAll();
    }
}
