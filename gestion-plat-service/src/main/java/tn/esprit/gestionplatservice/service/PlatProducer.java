package tn.esprit.gestionplatservice.service;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import tn.esprit.gestionplatservice.config.RabbitMQConfig;
import org.springframework.stereotype.Service;
import tn.esprit.gestionplatservice.Dto.PlatDTO;

@Service
public class PlatProducer {

    private final RabbitTemplate rabbitTemplate;

    public PlatProducer(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void sendPlat(PlatDTO platDTO) {
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.PLAT_QUEUE,
                platDTO
        );

        System.out.println("Plat envoyé : " + platDTO.getNom());
    }
}
