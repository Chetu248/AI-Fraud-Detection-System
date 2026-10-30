package com.example.backend.service.impl;

import com.example.backend.dto.investigation.InvestigationRequest;
import com.example.backend.dto.investigation.InvestigationResponse;
import com.example.backend.entity.Claim;
import com.example.backend.entity.Investigation;
import com.example.backend.enums.InvestigationStatus;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.mapper.InvestigationMapper;
import com.example.backend.repository.ClaimRepository;
import com.example.backend.repository.InvestigationRepository;
import com.example.backend.service.interfaces.InvestigationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class InvestigationServiceImpl implements InvestigationService {

    private final InvestigationRepository investigationRepository;
    private final ClaimRepository claimRepository;
    private final InvestigationMapper investigationMapper;

    @Override
    public InvestigationResponse createInvestigation(InvestigationRequest request) {

        Claim claim = claimRepository.findById(request.getClaimId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Claim not found with id: " + request.getClaimId()
                        )
                );

        if (investigationRepository.findByClaimId(request.getClaimId()).isPresent()) {
            throw new IllegalArgumentException(
                    "Investigation already exists for claim id: " + request.getClaimId()
            );
        }

        Investigation investigation = Investigation.builder()
                .claim(claim)
                .reason(request.getReason())
                .findings(request.getFindings())
                .status(
                        request.getStatus() != null
                                ? request.getStatus()
                                : InvestigationStatus.PENDING
                )
                .investigator(request.getInvestigator())
                .build();

        Investigation savedInvestigation =
                investigationRepository.save(investigation);

        return investigationMapper.toResponse(savedInvestigation);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InvestigationResponse> getAllInvestigations() {
        return investigationRepository.findAll()
                .stream()
                .map(investigationMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public InvestigationResponse getInvestigationById(Long id) {
        Investigation investigation = investigationRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Investigation not found with id: " + id
                        )
                );

        return investigationMapper.toResponse(investigation);
    }

    @Override
    @Transactional(readOnly = true)
    public InvestigationResponse getInvestigationByClaimId(Long claimId) {
        Investigation investigation = investigationRepository
                .findByClaimId(claimId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Investigation not found for claim id: " + claimId
                        )
                );

        return investigationMapper.toResponse(investigation);
    }

    @Override
    public InvestigationResponse updateInvestigation(Long id, InvestigationRequest request) {
        Investigation investigation = investigationRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Investigation not found with id: " + id
                        )
                );

        if (request.getClaimId() != null
                && !request.getClaimId().equals(investigation.getClaim().getId())) {

            Claim claim = claimRepository.findById(request.getClaimId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Claim not found with id: " + request.getClaimId()
                            )
                    );

            investigationRepository.findByClaimId(request.getClaimId())
                    .ifPresent(existing -> {
                        if (!existing.getId().equals(id)) {
                            throw new IllegalArgumentException(
                                    "Investigation already exists for claim id: "
                                            + request.getClaimId()
                            );
                        }
                    });

            investigation.setClaim(claim);
        }

        if (request.getReason() != null) {
            investigation.setReason(request.getReason());
        }

        if (request.getFindings() != null) {
            investigation.setFindings(request.getFindings());
        }

        if (request.getInvestigator() != null) {
            investigation.setInvestigator(request.getInvestigator());
        }

        if (request.getStatus() != null) {

            investigation.setStatus(request.getStatus());

            if (request.getStatus() == InvestigationStatus.COMPLETED) {
                investigation.setCompletedAt(LocalDateTime.now());
            } else {
                investigation.setCompletedAt(null);
            }
        }

        Investigation updatedInvestigation =
                investigationRepository.save(investigation);

        return investigationMapper.toResponse(updatedInvestigation);
    }

    @Override
    public void deleteInvestigation(Long id) {
        Investigation investigation = investigationRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Investigation not found with id: " + id
                        )
                );

        investigationRepository.delete(investigation);
    }
}
