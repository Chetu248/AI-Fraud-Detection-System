package com.example.backend.dto.investigation;

import com.example.backend.enums.InvestigationStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvestigationRequest {

    @NotNull(message = "Claim ID is required")
    private Long claimId ;

    @Size(max = 2000, message = "Findings cannot exceed 2000 characters")
    private String reason ;

    @Size(max = 1000, message = "Reason cannot exceed 1000 characters")
    private String findings ;

    private InvestigationStatus status ;

    private String investigator ;
}
