package tn.esprit.gestionplatservice.Dto;

public class PlatDTO {
    private Long id;
    private String nom;
    private double prix;

    public PlatDTO() {}

    public PlatDTO(Long id, String nom, double prix) {
        this.id = id;
        this.nom = nom;
        this.prix = prix;
    }

    // ===== GETTERS =====
    public Long getId() {
        return id;
    }

    public String getNom() {
        return nom;
    }

    public double getPrix() {
        return prix;
    }

    // ===== SETTERS =====
    public void setId(Long id) {
        this.id = id;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public void setPrix(double prix) {
        this.prix = prix;
    }

}
