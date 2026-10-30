package com.example.backend.dto.investigation;

import com.example.backend.enums.InvestigationStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvestigationResponse {

    private Long id ;

    private Long claimId ;

    private String reason ;

    private String findings ;

    private InvestigationStatus status ;

    private String investigator;

    private LocalDateTime startedAt;

    private LocalDateTime completedAt;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
