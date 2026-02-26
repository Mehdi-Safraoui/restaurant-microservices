package tn.esprit.gestionplatservice.entity;

import jakarta.persistence.*;
import java.util.Set;

@Entity
public class Plat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;

    private double prix;

    @ManyToMany
    @JoinTable(
            name = "plat_ingredient",
            joinColumns = @JoinColumn(name = "plat_id"),
            inverseJoinColumns = @JoinColumn(name = "ingredient_id")
    )
    private Set<Ingredient> ingredients;

    // Constructeur par défaut
    public Plat() {
    }

    // Constructeur avec paramètres (optionnel)
    public Plat(String nom, double prix, Set<Ingredient> ingredients) {
        this.nom = nom;
        this.prix = prix;
        this.ingredients = ingredients;
    }

    // Getter et Setter pour id
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    // Getter et Setter pour nom
    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    // Getter et Setter pour prix
    public double getPrix() {
        return prix;
    }

    public void setPrix(double prix) {
        this.prix = prix;
    }

    // Getter et Setter pour ingredients
    public Set<Ingredient> getIngredients() {
        return ingredients;
    }

    public void setIngredients(Set<Ingredient> ingredients) {
        this.ingredients = ingredients;
    }
}