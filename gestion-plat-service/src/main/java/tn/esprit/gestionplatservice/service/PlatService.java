package tn.esprit.gestionplatservice.service;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import tn.esprit.gestionplatservice.Dto.PlatDTO;
import tn.esprit.gestionplatservice.entity.Plat;
import tn.esprit.gestionplatservice.repository.IngredientRepository;
import tn.esprit.gestionplatservice.repository.PlatRepository;


import java.util.List;

@Service
public class PlatService {
    private final PlatRepository platRepository;
    private final IngredientRepository ingredientRepository;
    private final PlatProducer platProducer;

    public PlatService(PlatRepository platRepository,
                       IngredientRepository ingredientRepository ,PlatProducer platProducer) {
        this.platRepository = platRepository;
        this.ingredientRepository = ingredientRepository;
        this.platProducer = platProducer;
    }

    public Plat createPlat(Plat plat) {
        return platRepository.save(plat);
    }

    public List<Plat> getAll() {
        return platRepository.findAll();
    }

    public Plat getById(Long id) {
        return platRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plat non trouvé"));
    }
    public Plat update (Long id, Plat newPlat) {
        if (platRepository.findById(id).isPresent()) {

            Plat existingPlat = platRepository.findById(id).get();
            existingPlat.setNom(newPlat.getNom());
            existingPlat.setPrix(newPlat.getPrix());
            existingPlat.setIngredients(newPlat.getIngredients());
        return platRepository.save(existingPlat);
    } else
        return null;
    }



    public void delete(Long id) {
        platRepository.deleteById(id);
    }

    @Transactional

    public Plat saveAndSend(Plat plat) {

        Plat saved = platRepository.save(plat);

        PlatDTO dto = new PlatDTO(
                saved.getId(),
                saved.getNom(),
                saved.getPrix()
        );
        platProducer.sendPlat(dto);

        return saved;
    }
}
