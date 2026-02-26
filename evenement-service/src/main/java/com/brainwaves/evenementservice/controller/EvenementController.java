package com.brainwaves.evenementservice.controller;

import com.brainwaves.evenementservice.entity.Evenement;
import com.brainwaves.evenementservice.repository.EvenementRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/evenements")
public class EvenementController {

    private final EvenementRepository repository;

    public EvenementController(EvenementRepository repository) {
        this.repository = repository;
    }

    // CREATE
    @PostMapping
    public Evenement create(@RequestBody Evenement evenement) {
        return repository.save(evenement);
    }

    // READ ALL
    @GetMapping
    public List<Evenement> getAll() {
        return repository.findAll();
    }

    // READ BY ID
    @GetMapping("/{id}")
    public Evenement getById(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evenement not found"));
    }

    // UPDATE
    @PutMapping("/{id}")
    public Evenement update(@PathVariable Long id, @RequestBody Evenement updatedEvent) {
        return repository.findById(id)
                .map(event -> {
                    event.setNom(updatedEvent.getNom());
                    event.setDescription(updatedEvent.getDescription());
                    event.setDate(updatedEvent.getDate());
                    event.setLieu(updatedEvent.getLieu());
                    return repository.save(event);
                })
                .orElseThrow(() -> new RuntimeException("Evenement not found"));
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}