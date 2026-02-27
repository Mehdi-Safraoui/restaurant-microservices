package tn.esprit.commande;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import tn.esprit.commande.Dto.Plat;

import java.util.List;

@FeignClient(name = "gestion-plat-service")
public interface PlatClient {

    @GetMapping("/plats")
    public List<Plat> getAll();

    @GetMapping("/plats/{id}")
    public Plat getById(@PathVariable Long id);

}
