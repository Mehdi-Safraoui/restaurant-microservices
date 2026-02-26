package tn.esprit.gestionplatservice.controller;
import org.springframework.web.bind.annotation.*;
import tn.esprit.gestionplatservice.entity.Plat;
import tn.esprit.gestionplatservice.service.PlatService;

import java.util.List;

@RestController
@RequestMapping("/plats")
public class PlatController {
    private final PlatService platService;

    public PlatController(PlatService platService) {
        this.platService = platService;
    }

    @PostMapping
    public Plat create(@RequestBody Plat plat) {
        return platService.createPlat(plat);
    }

    @GetMapping
    public List<Plat> getAll() {
        return platService.getAll();
    }

    @GetMapping("/{id}")
    public Plat getById(@PathVariable Long id) {
        return platService.getById(id);
    }
    @PutMapping("/{id}")
    public Plat update(@PathVariable Long id, @RequestBody Plat plat) {
        return platService.update(id, plat);
    }


    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        platService.delete(id);
    }
}
