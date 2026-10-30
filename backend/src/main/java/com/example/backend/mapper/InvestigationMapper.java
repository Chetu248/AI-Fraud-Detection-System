package com.example.backend.mapper;

import com.example.backend.dto.investigation.InvestigationResponse;
import com.example.backend.entity.Investigation;
import org.springframework.stereotype.Component;

@Component
public class InvestigationMapper {

    public InvestigationResponse toResponse(Investigation investigation) {

        return InvestigationResponse.builder()
                .id(investigation.getId())
                .claimId(investigation.getClaim().getId())
                .reason(investigation.getReason())
                .findings(investigation.getFindings())
                .status(investigation.getStatus())
                .investigator(investigation.getInvestigator())
                .startedAt(investigation.getStartedAt())
                .completedAt(investigation.getCompletedAt())
                .createdAt(investigation.getCreatedAt())
                .updatedAt(investigation.getUpdatedAt())
                .build();
    }
}
