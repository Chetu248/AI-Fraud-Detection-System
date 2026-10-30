package com.example.backend.controller;

import com.example.backend.dto.audit.AuditLogRequest;
import com.example.backend.dto.audit.AuditLogResponse;
import com.example.backend.service.interfaces.AuditLogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/audit-logs")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogService auditLogService;

    @PostMapping
    public ResponseEntity<AuditLogResponse> createAuditLog(
            @Valid @RequestBody AuditLogRequest request) {

        AuditLogResponse response =
                auditLogService.createAuditLog(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<AuditLogResponse>> getAllAuditLogs() {

        return ResponseEntity.ok(
                auditLogService.getAllAuditLogs()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<AuditLogResponse> getAuditLogById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                auditLogService.getAuditLogById(id)
        );
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AuditLogResponse>> getAuditLogsByUser(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                auditLogService.getAuditLogsByUser(userId)
        );
    }

    @GetMapping("/entity/{entityType}/{entityId}")
    public ResponseEntity<List<AuditLogResponse>> getAuditLogsByEntity(
            @PathVariable String entityType,
            @PathVariable Long entityId) {

        return ResponseEntity.ok(
                auditLogService.getAuditLogsByEntity(
                        entityType,
                        entityId
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAuditLog(
            @PathVariable Long id) {

        auditLogService.deleteAuditLog(id);

        return ResponseEntity.noContent().build();
    }
}