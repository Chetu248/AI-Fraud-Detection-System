package com.example.backend.service.interfaces;

import com.example.backend.dto.investigation.InvestigationRequest;
import com.example.backend.dto.investigation.InvestigationResponse;

import java.util.List;

public interface InvestigationService {

    InvestigationResponse createInvestigation(InvestigationRequest request);

    List<InvestigationResponse> getAllInvestigations();

    InvestigationResponse getInvestigationById(Long id);

    InvestigationResponse getInvestigationByClaimId(Long claimId);

    InvestigationResponse updateInvestigation(Long id, InvestigationRequest request);

    void deleteInvestigation(Long id);
}
