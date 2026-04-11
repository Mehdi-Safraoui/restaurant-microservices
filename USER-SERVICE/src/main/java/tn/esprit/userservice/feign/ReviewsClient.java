package tn.esprit.userservice.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import tn.esprit.userservice.dto.ComplaintDTO;

import java.util.List;

@FeignClient(name = "reviews")
public interface ReviewsClient {

    @GetMapping("/api/complaints/user/{userId}")
    List<ComplaintDTO> getComplaintsByUserId(@PathVariable("userId") Long userId);
}

