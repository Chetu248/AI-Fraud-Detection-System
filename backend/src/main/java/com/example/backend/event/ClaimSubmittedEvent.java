package com.example.backend.event;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClaimSubmittedEvent {

    private Long claimId;
    private Long vehicleId;
    private BigDecimal claimAmount;
    private LocalDateTime claimDate;
    private LocalDateTime submittedAt;
    private BigDecimal premiumAmount;
    private LocalDate policyStartDate;
    private long previousClaimsCount;
    private long claimsLast90Days;
}
