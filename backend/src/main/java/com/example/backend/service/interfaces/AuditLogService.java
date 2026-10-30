package com.example.backend.service.interfaces;

import com.example.backend.dto.audit.AuditLogRequest;
import com.example.backend.dto.audit.AuditLogResponse;

import java.util.List;

public interface AuditLogService {

    AuditLogResponse createAuditLog(AuditLogRequest request);

    List<AuditLogResponse> getAllAuditLogs();

    AuditLogResponse getAuditLogById(Long id);

    List<AuditLogResponse> getAuditLogsByUser(Long userId);

    List<AuditLogResponse> getAuditLogsByEntity(
            String entityType,
            Long entityId
    );

    void deleteAuditLog(Long id);
}
