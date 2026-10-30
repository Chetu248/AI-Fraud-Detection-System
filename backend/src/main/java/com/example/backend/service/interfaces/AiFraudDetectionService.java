package com.example.backend.service.interfaces;

import com.example.backend.event.ClaimSubmittedEvent;

public interface AiFraudDetectionService {
    FraudAnalysisResult analyze(ClaimSubmittedEvent event);

    record FraudAnalysisResult(String prediction, double riskScore, String modelVersion, java.util.List<String> explanation) {}
}
