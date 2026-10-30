package com.example.backend.service.impl;

import com.example.backend.dto.analytics.AnalyticsResponse;
import com.example.backend.enums.ClaimStatus;
import com.example.backend.enums.InvestigationStatus;
import com.example.backend.repository.ClaimRepository;
import com.example.backend.repository.InvestigationRepository;
import com.example.backend.service.interfaces.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AnalyticsServiceImpl implements AnalyticsService {

    private final ClaimRepository claimRepository;
    private final InvestigationRepository investigationRepository;

    @Override
    public AnalyticsResponse getAnalyticsSummary() {

        long totalClaims = claimRepository.count();

        long pendingClaims =
                claimRepository.countByStatus(ClaimStatus.PENDING);

        long approvedClaims =
                claimRepository.countByStatus(ClaimStatus.APPROVED);

        long rejectedClaims =
                claimRepository.countByStatus(ClaimStatus.REJECTED);

        long totalInvestigations =
                investigationRepository.count();

        long pendingInvestigations =
                investigationRepository.countByStatus(
                        InvestigationStatus.PENDING
                );

        long inProgressInvestigations =
                investigationRepository.countByStatus(
                        InvestigationStatus.IN_PROGRESS
                );

        long completedInvestigations =
                investigationRepository.countByStatus(
                        InvestigationStatus.COMPLETED
                );

        return AnalyticsResponse.builder()
                .totalClaims(totalClaims)
                .pendingClaims(pendingClaims)
                .approvedClaims(approvedClaims)
                .rejectedClaims(rejectedClaims)
                .totalInvestigations(totalInvestigations)
                .pendingInvestigations(pendingInvestigations)
                .inProgressInvestigations(inProgressInvestigations)
                .completedInvestigations(completedInvestigations)
                .build();
    }
}