package com.restaurant.reviews.feign;


import com.restaurant.reviews.dto.OrderDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "Commande")   // nom exact dans Eureka (cf. votre gateway)
public interface OrderClient {

    @GetMapping("/commandes/{id}")
    OrderDTO getOrderById(@PathVariable("id") Long id);
}