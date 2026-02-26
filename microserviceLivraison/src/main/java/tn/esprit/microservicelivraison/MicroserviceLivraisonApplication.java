package tn.esprit.microservicelivraison;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;

import java.time.LocalDateTime;
@EnableDiscoveryClient
@SpringBootApplication
public class MicroserviceLivraisonApplication {

    public static void main(String[] args) {
        SpringApplication.run(MicroserviceLivraisonApplication.class, args);
    }

    @Autowired
    private DeliveryPersonRepository deliveryPersonRepository;

    @Autowired
    private DeliveryRepository deliveryRepository;

    @Bean
    ApplicationRunner init() {
        return (args) -> {

            // ===== Ajouter des livreurs =====
            DeliveryPerson dp1 = new DeliveryPerson(null,"Ali","22111111",true,36.80,10.18);
            DeliveryPerson dp2 = new DeliveryPerson(null,"Sami","22333333",true,36.81,10.20);
            DeliveryPerson dp3 = new DeliveryPerson(null,"Mouna","22444444",true,36.79,10.22);

            deliveryPersonRepository.save(dp1);
            deliveryPersonRepository.save(dp2);
            deliveryPersonRepository.save(dp3);

            // ===== Ajouter livraisons test =====
            Delivery d1 = new Delivery(null,101L,"Tunis centre",DeliveryStatus.CREATED,
                    LocalDateTime.now(),null,30,dp1);

            Delivery d2 = new Delivery(null,102L,"Ariana",DeliveryStatus.CREATED,
                    LocalDateTime.now(),null,25,dp2);

            deliveryRepository.save(d1);
            deliveryRepository.save(d2);

            // ===== Affichage =====
            deliveryRepository.findAll().forEach(System.out::println);
        };
    }
}
