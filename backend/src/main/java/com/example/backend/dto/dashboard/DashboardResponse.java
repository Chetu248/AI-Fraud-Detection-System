package com.example.backend.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardResponse {

    private long totalClaims;

    private long pendingClaims;

    private long approvedClaims;

    private long rejectedClaims;

    private long underInvestigation;

    private long totalInvestigations;

    private long completedInvestigations;

    private long pendingInvestigations;

    private long totalNotifications;

    private long unreadNotifications;
}