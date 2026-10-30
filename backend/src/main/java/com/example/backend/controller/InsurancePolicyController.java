package com.example.backend.controller;

import com.example.backend.dto.policy.InsurancePolicyRequest;
import com.example.backend.dto.policy.InsurancePolicyResponse;
import com.example.backend.service.interfaces.InsurancePolicyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/policies")
@RequiredArgsConstructor
public class InsurancePolicyController {

    private final InsurancePolicyService policyService ;

    @PostMapping
    public ResponseEntity<InsurancePolicyResponse> createPolicy(
            @Valid @RequestBody InsurancePolicyRequest request ,
            Authentication authentication) {

        Long userId = Long.valueOf(authentication.getName());

        InsurancePolicyResponse response =
                policyService.createPolicy(request, userId);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<InsurancePolicyResponse>> getMyPolicies(
            Authentication authentication) {

        Long userId = Long.valueOf(authentication.getName());

        return ResponseEntity.ok(policyService.getMyPolicies(userId));
    }

    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<List<InsurancePolicyResponse>>
    getPoliciesByVehicle(
            @PathVariable Long vehicleId,
            Authentication authentication) {

        Long userId = Long.valueOf(authentication.getName());

        return ResponseEntity.ok(
                policyService.getPoliciesByVehicle(
                        vehicleId,
                        userId
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<InsurancePolicyResponse> getPolicyById(
            @PathVariable Long id,
            Authentication authentication) {

        Long userId = Long.valueOf(authentication.getName());

        return ResponseEntity.ok(
                policyService.getPolicyById(id, userId)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<InsurancePolicyResponse> updatePolicy(
            @PathVariable Long id,
            @Valid @RequestBody InsurancePolicyRequest request,
            Authentication authentication) {

        Long userId = Long.valueOf(authentication.getName());

        return ResponseEntity.ok(
                policyService.updatePolicy(
                        id,
                        request,
                        userId
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePolicy(
            @PathVariable Long id,
            Authentication authentication) {

        Long userId = Long.valueOf(authentication.getName());

        policyService.deletePolicy(id, userId);

        return ResponseEntity.noContent().build();
    }
}
