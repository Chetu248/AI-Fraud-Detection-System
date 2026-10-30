package com.example.backend.service.impl;

import com.example.backend.dto.dashboard.DashboardResponse;
import com.example.backend.enums.ClaimStatus;
import com.example.backend.enums.InvestigationStatus;
import com.example.backend.enums.NotificationStatus;
import com.example.backend.repository.ClaimRepository;
import com.example.backend.repository.InvestigationRepository;
import com.example.backend.repository.NotificationRepository;
import com.example.backend.service.interfaces.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final ClaimRepository claimRepository;
    private final InvestigationRepository investigationRepository;
    private final NotificationRepository notificationRepository;

    @Override
    public DashboardResponse getDashboardSummary() {

        long totalClaims = claimRepository.count();

        long pendingClaims =
                claimRepository.countByStatus(ClaimStatus.PENDING);

        long approvedClaims =
                claimRepository.countByStatus(ClaimStatus.APPROVED);

        long rejectedClaims =
                claimRepository.countByStatus(ClaimStatus.REJECTED);

        long totalInvestigations =
                investigationRepository.count();

        long completedInvestigations =
                investigationRepository.countByStatus(
                        InvestigationStatus.COMPLETED
                );

        long pendingInvestigations =
                investigationRepository.countByStatus(
                        InvestigationStatus.PENDING
                );

        long underInvestigation =
                investigationRepository.countByStatus(
                        InvestigationStatus.IN_PROGRESS
                );

        long totalNotifications =
                notificationRepository.count();

        long unreadNotifications =
                notificationRepository.countByStatus(
                        NotificationStatus.UNREAD
                );

        return DashboardResponse.builder()
                .totalClaims(totalClaims)
                .pendingClaims(pendingClaims)
                .approvedClaims(approvedClaims)
                .rejectedClaims(rejectedClaims)
                .underInvestigation(underInvestigation)
                .totalInvestigations(totalInvestigations)
                .completedInvestigations(completedInvestigations)
                .pendingInvestigations(pendingInvestigations)
                .totalNotifications(totalNotifications)
                .unreadNotifications(unreadNotifications)
                .build();
    }
}