package com.restaurant.reviews.service;

import com.restaurant.reviews.dto.ComplaintDTO;
import com.restaurant.reviews.entity.Complaint;
import com.restaurant.reviews.repository.ComplaintRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ComplaintService {

    private final ComplaintRepository complaintRepository;

    public Complaint addComplaint(ComplaintDTO dto) {
        Complaint complaint = new Complaint();
        complaint.setUserId(dto.getUserId());
        complaint.setOrderId(dto.getOrderId());
        complaint.setMessage(dto.getMessage());

        return complaintRepository.save(complaint);
    }

    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    public Complaint resolveComplaint(Long id) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        complaint.setStatus("RESOLVED");
        return complaintRepository.save(complaint);
    }
}