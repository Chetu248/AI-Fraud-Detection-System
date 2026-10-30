package com.example.backend.dto.analytics;

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
public class AnalyticsResponse {

    private long totalClaims;

    private long pendingClaims;

    private long approvedClaims;

    private long rejectedClaims;

    private long totalInvestigations;

    private long pendingInvestigations;

    private long inProgressInvestigations;

    private long completedInvestigations;
}