package tn.esprit.gestionplatservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class GestionPlatServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(GestionPlatServiceApplication.class, args);
    }

}
