package com.brainwaves.evenementservice.controller;

import com.brainwaves.evenementservice.entity.Evenement;
import com.brainwaves.evenementservice.repository.EvenementRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RefreshScope
@RestController
@RequestMapping("/evenements")
public class EvenementController {

    private final EvenementRepository repository;
    private final String evenementMessage;

    public EvenementController(
            EvenementRepository repository,
            @Value("${evenement.message:Configuration locale du service evenement}") String evenementMessage) {
        this.repository = repository;
        this.evenementMessage = evenementMessage;
    }

    @GetMapping("/config/message")
    public Map<String, String> getConfigMessage() {
        return java.util.Collections.singletonMap("message", evenementMessage);
    }

    @PostMapping
    public Evenement create(@RequestBody Evenement evenement) {
        return repository.save(evenement);
    }

    @GetMapping
    public List<Evenement> getAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Evenement getById(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Evenement not found"));
    }

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
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Evenement not found"));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Evenement not found");
        }
        repository.deleteById(id);
    }
}
