package com.example.backend.service.interfaces;

import com.example.backend.dto.claim.ClaimRequest;
import com.example.backend.dto.claim.ClaimResponse;

import java.util.List;

public interface ClaimService {

    ClaimResponse createClaim(ClaimRequest requestDTO);

    List<ClaimResponse> getAllClaims();

    ClaimResponse getClaimById(Long id);

    ClaimResponse updateClaim(Long id, ClaimRequest requestDTO);

    void deleteClaim(Long id);
}
