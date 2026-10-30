package com.example.backend.service.impl;

import com.example.backend.event.ClaimSubmittedEvent;
import com.example.backend.service.interfaces.AiFraudDetectionService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class AiFraudDetectionServiceImpl implements AiFraudDetectionService {

    private final RestClient client;

    public AiFraudDetectionServiceImpl(
            RestClient.Builder builder,
            @Value("${ai.service.url:http://localhost:8000}") String baseUrl) {
        this.client = builder.baseUrl(baseUrl).build();
    }

    @Override
    public FraudAnalysisResult analyze(ClaimSubmittedEvent event) {
        Map<String, Object> features = new LinkedHashMap<>();
        if (event.getPremiumAmount() != null) features.put("premiumAmount", event.getPremiumAmount());
        if (event.getPolicyStartDate() != null) features.put("policyStartDate", event.getPolicyStartDate().toString());
        features.put("previousClaimsCount", event.getPreviousClaimsCount());
        features.put("claimsLast90Days", event.getClaimsLast90Days());

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("claimId", event.getClaimId());
        body.put("vehicleId", event.getVehicleId());
        body.put("claimAmount", event.getClaimAmount());
        body.put("claimDate", event.getClaimDate());
        body.put("features", features);

        var response = client.post()
                .uri("/predict")
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(AiResponse.class);

        if (response == null) throw new IllegalStateException("AI service returned an empty response");
        return new FraudAnalysisResult(response.prediction(), response.riskScore(), response.modelVersion(), response.explanation());
    }

    private record AiResponse(Long claimId, String prediction, double riskScore, String modelVersion, java.util.List<String> explanation) {}
}
