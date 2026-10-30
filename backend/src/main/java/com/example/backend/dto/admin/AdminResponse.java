package com.example.backend.dto.admin;

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
public class AdminResponse {

    private long totalClaims;

    private long totalInvestigations;

    private long pendingInvestigations;

    private long completedInvestigations;

    private long totalNotifications;

    private long unreadNotifications;
}