package tn.esprit.apigateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;


@SpringBootApplication
@EnableDiscoveryClient
public class ApiGatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("user-service", r -> r.path("/api/users/**")
                        .uri("lb://USER-SERVICE"))
                .route("user-auth-service", r -> r.path("/api/auth/**")
                        .uri("lb://USER-SERVICE"))
                .route("evenement-service", r -> r.path("/evenements/**")
                        .uri("lb://EVENEMENT-SERVICE"))
                .route("commande-service", r -> r.path("/commandes/**")
                        .uri("lb://Commande"))
                .route("gestion-plat-service", r -> r.path("/plats/**")
                        .uri("lb://gestion-plat-service"))
                .route("reviews-service", r -> r.path("/api/reviews/**")
                        .uri("lb://reviews"))
                .route("complaints-service", r -> r.path("/api/complaints/**")
                        .uri("lb://reviews"))
                .route("livraison-service", r -> r.path("/api/deliveries/**")
                        .uri("lb://microserviceLivraison"))
                .build();
    }

}
