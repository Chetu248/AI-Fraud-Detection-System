package com.example.backend.mapper;

import com.example.backend.dto.audit.AuditLogResponse;
import com.example.backend.entity.AuditLog;
import org.springframework.stereotype.Component;

@Component
public class AuditLogMapper {

    public AuditLogResponse toResponse(AuditLog auditLog) {

        return AuditLogResponse.builder()
                .id(auditLog.getId())
                .action(auditLog.getAction())
                .entityType(auditLog.getEntityType())
                .entityId(auditLog.getEntityId())
                .userId(auditLog.getUserId())
                .description(auditLog.getDescription())
                .timestamp(auditLog.getTimestamp())
                .build();
    }
}
