package com.restaurant.reviews.service;

import com.restaurant.reviews.dto.ComplaintDTO;
import com.restaurant.reviews.dto.OrderDTO;
import com.restaurant.reviews.dto.UserDTO;
import com.restaurant.reviews.entity.Complaint;
import com.restaurant.reviews.feign.OrderClient;
import com.restaurant.reviews.feign.UserClient;
import com.restaurant.reviews.repository.ComplaintRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final UserClient userClient;      // ← injecté
    private final OrderClient orderClient;    // ← injecté

    public Complaint addComplaint(ComplaintDTO dto) {
        if (dto.getUserId() == null || dto.getOrderId() == null) {
            throw new RuntimeException("userId et orderId sont requis");
        }

        if (dto.getMessage() == null || dto.getMessage().isBlank()) {
            throw new RuntimeException("Le message de reclamation est requis");
        }

        // Validations distantes best-effort. En integration, on ne bloque pas
        // la creation si un autre microservice refuse ou echoue.
        try {
            UserDTO user = userClient.getUserById(dto.getUserId());
            if (user == null) {
                log.warn("Utilisateur introuvable lors de la creation d'une reclamation: {}", dto.getUserId());
            }
        } catch (Exception ex) {
            log.warn("Validation utilisateur ignoree pour la reclamation. userId={}, cause={}", dto.getUserId(), ex.getMessage());
        }

        try {
            OrderDTO order = orderClient.getOrderById(dto.getOrderId());
            if (order == null) {
                log.warn("Commande introuvable lors de la creation d'une reclamation: {}", dto.getOrderId());
            }
        } catch (Exception ex) {
            log.warn("Validation commande ignoree pour la reclamation. orderId={}, cause={}", dto.getOrderId(), ex.getMessage());
        }

        Complaint complaint = new Complaint();
        complaint.setUserId(dto.getUserId());
        complaint.setOrderId(dto.getOrderId());
        complaint.setMessage(dto.getMessage());

        return complaintRepository.save(complaint);
    }

    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    public List<Complaint> getComplaintsByUserId(Long userId) {
        return complaintRepository.findByUserId(userId);
    }

    public Complaint resolveComplaint(Long id) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
        complaint.setStatus("RESOLVED");
        return complaintRepository.save(complaint);
    }
}
