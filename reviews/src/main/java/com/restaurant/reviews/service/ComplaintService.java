package com.restaurant.reviews.service;

import com.restaurant.reviews.dto.ComplaintDTO;
import com.restaurant.reviews.dto.OrderDTO;
import com.restaurant.reviews.dto.UserDTO;
import com.restaurant.reviews.entity.Complaint;
import com.restaurant.reviews.feign.OrderClient;
import com.restaurant.reviews.feign.UserClient;
import com.restaurant.reviews.repository.ComplaintRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final UserClient userClient;      // ← injecté
    private final OrderClient orderClient;    // ← injecté

    public Complaint addComplaint(ComplaintDTO dto) {
        // Vérifier que l'utilisateur existe
        UserDTO user = userClient.getUserById(dto.getUserId());
        if (user == null) {
            throw new RuntimeException("Utilisateur introuvable : " + dto.getUserId());
        }

        // Vérifier que la commande existe
        OrderDTO order = orderClient.getOrderById(dto.getOrderId());
        if (order == null) {
            throw new RuntimeException("Commande introuvable : " + dto.getOrderId());
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