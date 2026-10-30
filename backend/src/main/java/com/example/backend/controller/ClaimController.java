package com.example.backend.controller;

import com.example.backend.dto.claim.ClaimRequest;
import com.example.backend.dto.claim.ClaimResponse;
import com.example.backend.service.interfaces.ClaimService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/claims")
@RequiredArgsConstructor
public class ClaimController {

    private final ClaimService claimService ;

    @PostMapping
    public ResponseEntity<ClaimResponse> createClaim(
            @Valid @RequestBody ClaimRequest requestDTO) {

        ClaimResponse response = claimService.createClaim(requestDTO);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<ClaimResponse>> getAllClaims() {
        return ResponseEntity.ok(
                claimService.getAllClaims()
        ) ;
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClaimResponse> getClaimById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                claimService.getClaimById(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClaimResponse> updateClaim(
            @PathVariable Long id,
            @Valid @RequestBody ClaimRequest requestDTO) {

        return ResponseEntity.ok(
                claimService.updateClaim(id, requestDTO)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClaim(
            @PathVariable Long id) {

        claimService.deleteClaim(id);

        return ResponseEntity.noContent().build();
    }

}
