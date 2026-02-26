package tn.esprit.userservice.dto;

import lombok.Data;
import tn.esprit.userservice.entity.Role;

@Data
public class RegisterRequest {

    private String nom;
    private String prenom;
    private String email;
    private String password;
    private Role role;
}

