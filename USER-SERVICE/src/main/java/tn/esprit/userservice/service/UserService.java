package tn.esprit.userservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import tn.esprit.userservice.config.JwtUtil;
import tn.esprit.userservice.dto.AuthResponse;
import tn.esprit.userservice.dto.LoginRequest;
import tn.esprit.userservice.dto.RegisterRequest;
import tn.esprit.userservice.entity.Role;
import tn.esprit.userservice.entity.User;
import tn.esprit.userservice.repository.UserRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        Role role = req.getRole() != null ? req.getRole() : Role.CLIENT;

        User user = new User();
        user.setNom(req.getNom());
        user.setPrenom(req.getPrenom());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRole(role);
        user.setActive(true);

        User saved = userRepository.save(user);

        String token = jwtUtil.generateToken(saved.getEmail(), saved.getRole().name());
        return new AuthResponse(token, saved.getEmail(), saved.getRole().name());
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return new AuthResponse(token, user.getEmail(), user.getRole().name());
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    public User updateUser(Long id, RegisterRequest req) {
        User user = getUserById(id);

        if (req.getNom() != null) {
            user.setNom(req.getNom());
        }
        if (req.getPrenom() != null) {
            user.setPrenom(req.getPrenom());
        }
        if (req.getEmail() != null) {
            user.setEmail(req.getEmail());
        }
        if (req.getPassword() != null && !req.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(req.getPassword()));
        }
        if (req.getRole() != null) {
            user.setRole(req.getRole());
        }

        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }
}

