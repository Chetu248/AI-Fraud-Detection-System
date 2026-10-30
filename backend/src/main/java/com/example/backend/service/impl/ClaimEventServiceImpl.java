package com.example.backend.service.impl;

import com.example.backend.entity.Investigation;
import com.example.backend.enums.InvestigationStatus;
import com.example.backend.event.ClaimSubmittedEvent;
import com.example.backend.repository.InvestigationRepository;
import com.example.backend.repository.ClaimRepository;
import com.example.backend.service.interfaces.AiFraudDetectionService;
import com.example.backend.service.interfaces.ClaimEventService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class ClaimEventServiceImpl implements ClaimEventService {

    private final AiFraudDetectionService aiFraudDetectionService;
    private final InvestigationRepository investigationRepository;
    private final ClaimRepository claimRepository;

    @Override
    public void processClaimSubmittedEvent(ClaimSubmittedEvent event) {
        log.info("Processing claim submitted event, claimId={}, vehicleId={}", event.getClaimId(), event.getVehicleId());

        try {
            var result = aiFraudDetectionService.analyze(event);
            var investigation = investigationRepository.findByClaimId(event.getClaimId())
                    .orElseGet(() -> {
                        var claim = claimRepository.findById(event.getClaimId())
                                .orElseThrow(() -> new IllegalStateException("Claim not found: " + event.getClaimId()));
                        return Investigation.builder().claim(claim).build();
                    });

            // The investigation record is the existing business-level place for the AI findings.
            investigation.setReason("Automated AI fraud-risk analysis");
            investigation.setFindings(formatFindings(result));
            investigation.setStatus(result.riskScore() >= 0.30 ? InvestigationStatus.IN_PROGRESS : InvestigationStatus.COMPLETED);
            investigationRepository.save(investigation);

            log.info("AI analysis completed for claimId={}, prediction={}, riskScore={}",
                    event.getClaimId(), result.prediction(), result.riskScore());
        } catch (Exception ex) {
            log.error("AI analysis failed for claimId={}. Claim remains durable for retry/review.", event.getClaimId(), ex);
            var investigation = investigationRepository.findByClaimId(event.getClaimId()).orElseGet(() -> {
                var claim = claimRepository.findById(event.getClaimId())
                        .orElseThrow(() -> new IllegalStateException("Claim not found: " + event.getClaimId()));
                return Investigation.builder().claim(claim).build();
            });
            investigation.setReason("Automated AI fraud-risk analysis");
            investigation.setFindings("AI analysis is currently unavailable. Please retry the analysis or review the claim manually.");
            investigation.setStatus(InvestigationStatus.PENDING);
            investigationRepository.save(investigation);
        }
    }

    private String formatFindings(AiFraudDetectionService.FraudAnalysisResult result) {
        StringBuilder sb = new StringBuilder();
        sb.append("Prediction: ").append(result.prediction())
          .append("\nRisk score: ").append(String.format("%.2f", result.riskScore()))
          .append("\nModel version: ").append(result.modelVersion());
        if (result.explanation() != null && !result.explanation().isEmpty()) {
            sb.append("\nExplanation:");
            result.explanation().forEach(item -> sb.append("\n- ").append(item));
        }
        return sb.toString();
    }
}
