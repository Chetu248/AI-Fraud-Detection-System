package com.example.backend.controller;

import com.example.backend.dto.investigation.InvestigationRequest;
import com.example.backend.dto.investigation.InvestigationResponse;
import com.example.backend.service.interfaces.InvestigationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/investigation")
@RequiredArgsConstructor
public class InvestigationController {

    private final InvestigationService investigationService ;

    @PostMapping
    public ResponseEntity<InvestigationResponse> createInvestigation(
            @Valid @RequestBody InvestigationRequest request) {

        InvestigationResponse response =
                investigationService.createInvestigation(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<InvestigationResponse>> getAllInvestigations() {

        return ResponseEntity.ok(
                investigationService.getAllInvestigations()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<InvestigationResponse> getInvestigationById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                investigationService.getInvestigationById(id)
        );
    }

    @GetMapping("/claim/{claimId}")
    public ResponseEntity<InvestigationResponse> getInvestigationByClaimId(
            @PathVariable Long claimId) {

        return ResponseEntity.ok(
                investigationService.getInvestigationByClaimId(claimId)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<InvestigationResponse> updateInvestigation(
            @PathVariable Long id,
            @Valid @RequestBody InvestigationRequest request) {

        return ResponseEntity.ok(
                investigationService.updateInvestigation(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInvestigation(
            @PathVariable Long id) {

        investigationService.deleteInvestigation(id);

        return ResponseEntity.noContent().build();
    }
}
