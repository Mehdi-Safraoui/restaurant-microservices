package tn.esprit.commande;



import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import tn.esprit.commande.Dto.Plat;
import tn.esprit.commande.config.RabbitMQConfig;


@Service
public class PlatConsumer {

    private final CommandeService commandeService;

    public PlatConsumer(CommandeService commandeService) {
        this.commandeService = commandeService;
    }

    @RabbitListener(
            queues = RabbitMQConfig.PLAT_QUEUE,
            containerFactory = "rabbitListenerContainerFactory"
    )
    public void receivePlat(Plat platDTO) {

        System.out.println("🔥 Plat reçu dans commande : " + platDTO.getNom());

        commandeService.addPlat(platDTO);
    }
}