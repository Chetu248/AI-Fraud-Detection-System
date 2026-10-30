package com.example.backend.controller;

import com.example.backend.dto.analytics.AnalyticsResponse;
import com.example.backend.service.interfaces.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/summary")
    public ResponseEntity<AnalyticsResponse> getAnalyticsSummary() {

        return ResponseEntity.ok(
                analyticsService.getAnalyticsSummary()
        );
    }
}