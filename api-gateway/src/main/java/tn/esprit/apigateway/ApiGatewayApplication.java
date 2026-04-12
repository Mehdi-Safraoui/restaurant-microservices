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
                // ── User & Auth ──
                .route("user-service", r -> r.path("/api/users/**")
                        .uri("lb://USER-SERVICE"))
                .route("user-auth-service", r -> r.path("/api/auth/**")
                        .uri("lb://USER-SERVICE"))

                // ── Plats & Ingredients ──
                .route("gestion-plat-service-api-root", r -> r.path("/api/plats")
                        .filters(f -> f.setPath("/plats"))
                        .uri("lb://gestion-plat-service"))
                .route("gestion-plat-service-api", r -> r.path("/api/plats/**")
                        .filters(f -> f.rewritePath("/api/plats/(?<segment>.*)", "/plats/${segment}"))
                        .uri("lb://gestion-plat-service"))
                .route("gestion-plat-service-root", r -> r.path("/plats")
                        .uri("lb://gestion-plat-service"))
                .route("gestion-plat-service", r -> r.path("/plats/**")
                        .uri("lb://gestion-plat-service"))
                .route("ingredients-service-api-root", r -> r.path("/api/ingredients")
                        .filters(f -> f.setPath("/ingredients"))
                        .uri("lb://gestion-plat-service"))
                .route("ingredients-service-api", r -> r.path("/api/ingredients/**")
                        .filters(f -> f.rewritePath("/api/ingredients/(?<segment>.*)", "/ingredients/${segment}"))
                        .uri("lb://gestion-plat-service"))
                .route("ingredients-service-root", r -> r.path("/ingredients")
                        .uri("lb://gestion-plat-service"))
                .route("ingredients-service", r -> r.path("/ingredients/**")
                        .uri("lb://gestion-plat-service"))

                // ── Commandes ──
                .route("commande-service-api-root", r -> r.path("/api/commandes")
                        .filters(f -> f.setPath("/commandes"))
                        .uri("lb://Commande"))
                .route("commande-service-api", r -> r.path("/api/commandes/**")
                        .filters(f -> f.rewritePath("/api/commandes/(?<segment>.*)", "/commandes/${segment}"))
                        .uri("lb://Commande"))
                .route("commande-service-root", r -> r.path("/commandes")
                        .uri("lb://Commande"))
                .route("commande-service", r -> r.path("/commandes/**")
                        .uri("lb://Commande"))

                // ── Événements ──
                .route("evenement-service-api-root", r -> r.path("/api/events")
                        .filters(f -> f.setPath("/evenements"))
                        .uri("lb://EVENEMENT-SERVICE"))
                .route("evenement-service-api", r -> r.path("/api/events/**")
                        .filters(f -> f.rewritePath("/api/events/(?<segment>.*)", "/evenements/${segment}"))
                        .uri("lb://EVENEMENT-SERVICE"))
                .route("evenement-service-root", r -> r.path("/evenements")
                        .uri("lb://EVENEMENT-SERVICE"))
                .route("evenement-service", r -> r.path("/evenements/**")
                        .uri("lb://EVENEMENT-SERVICE"))

                // ── Reviews & Complaints ──
                .route("reviews-service", r -> r.path("/api/reviews/**")
                        .uri("lb://reviews"))
                .route("complaints-service", r -> r.path("/api/complaints/**")
                        .uri("lb://reviews"))

                // ── Livraison ──
                .route("livraison-service", r -> r.path("/api/deliveries/**")
                        .uri("lb://microserviceLivraison"))

                // ── Blog ──
                .route("blog-service-api-root", r -> r.path("/api/blogs")
                        .filters(f -> f.setPath("/blogs"))
                        .uri("lb://BLOG-SERVICE"))
                .route("blog-service-api", r -> r.path("/api/blogs/**")
                        .filters(f -> f.rewritePath("/api/blogs/(?<segment>.*)", "/blogs/${segment}"))
                        .uri("lb://BLOG-SERVICE"))
                .route("blog-service-root", r -> r.path("/blogs")
                        .uri("lb://BLOG-SERVICE"))
                .route("blog-service", r -> r.path("/blogs/**")
                        .uri("lb://BLOG-SERVICE"))

                .build();
    }

}
