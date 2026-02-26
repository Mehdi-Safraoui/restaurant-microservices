package com.restaurant.reviews.controller;

import com.restaurant.reviews.dto.ComplaintDTO;
import com.restaurant.reviews.entity.Complaint;
import com.restaurant.reviews.service.ComplaintService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ComplaintController {

    private final ComplaintService complaintService;

    @PostMapping
    public ResponseEntity<Complaint> createComplaint(@RequestBody ComplaintDTO dto) {
        return ResponseEntity.ok(complaintService.addComplaint(dto));
    }

    @GetMapping
    public ResponseEntity<List<Complaint>> getAll() {
        return ResponseEntity.ok(complaintService.getAllComplaints());
    }

    @PutMapping("/resolve/{id}")
    public ResponseEntity<Complaint> resolve(@PathVariable Long id) {
        return ResponseEntity.ok(complaintService.resolveComplaint(id));
    }
}