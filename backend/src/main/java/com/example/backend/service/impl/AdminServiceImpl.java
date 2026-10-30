package com.example.backend.service.impl;

import com.example.backend.dto.admin.AdminResponse;
import com.example.backend.enums.InvestigationStatus;
import com.example.backend.enums.NotificationStatus;
import com.example.backend.repository.ClaimRepository;
import com.example.backend.repository.InvestigationRepository;
import com.example.backend.repository.NotificationRepository;
import com.example.backend.service.interfaces.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminServiceImpl implements AdminService {

    private final ClaimRepository claimRepository;
    private final InvestigationRepository investigationRepository;
    private final NotificationRepository notificationRepository;

    @Override
    public AdminResponse getAdminOverview() {

        long totalClaims = claimRepository.count();

        long totalInvestigations =
                investigationRepository.count();

        long pendingInvestigations =
                investigationRepository.countByStatus(
                        InvestigationStatus.PENDING
                );

        long completedInvestigations =
                investigationRepository.countByStatus(
                        InvestigationStatus.COMPLETED
                );

        long totalNotifications =
                notificationRepository.count();

        long unreadNotifications =
                notificationRepository.countByStatus(
                        NotificationStatus.UNREAD
                );

        return AdminResponse.builder()
                .totalClaims(totalClaims)
                .totalInvestigations(totalInvestigations)
                .pendingInvestigations(pendingInvestigations)
                .completedInvestigations(completedInvestigations)
                .totalNotifications(totalNotifications)
                .unreadNotifications(unreadNotifications)
                .build();
    }
}