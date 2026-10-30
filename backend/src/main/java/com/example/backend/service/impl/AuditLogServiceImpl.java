package com.example.backend.service.impl;

import com.example.backend.dto.audit.AuditLogRequest;
import com.example.backend.dto.audit.AuditLogResponse;
import com.example.backend.entity.AuditLog;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.mapper.AuditLogMapper;
import com.example.backend.repository.AuditLogRepository;
import com.example.backend.service.interfaces.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AuditLogServiceImpl implements AuditLogService {

    private final AuditLogRepository auditLogRepository ;
    private final AuditLogMapper auditLogMapper ;

    @Override
    public AuditLogResponse createAuditLog(AuditLogRequest request) {
        AuditLog auditLog = AuditLog.builder()
                .action(request.getAction())
                .entityType(request.getEntityType())
                .entityId(request.getEntityId())
                .userId(request.getUserId())
                .description(request.getDescription())
                .build();

        AuditLog savedAuditLog =
                auditLogRepository.save(auditLog);

        return auditLogMapper.toResponse(savedAuditLog);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuditLogResponse> getAllAuditLogs() {

        return auditLogRepository.findAllByOrderByTimestampDesc()
                .stream()
                .map(auditLogMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public AuditLogResponse getAuditLogById(Long id) {
        AuditLog auditLog = auditLogRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Audit log not found with id: " + id
                        )
                );

        return auditLogMapper.toResponse(auditLog);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuditLogResponse> getAuditLogsByUser(Long userId) {
        return auditLogRepository
                .findByUserIdOrderByTimestampDesc(userId)
                .stream()
                .map(auditLogMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuditLogResponse> getAuditLogsByEntity(String entityType, Long entityId) {
        return auditLogRepository
                .findByEntityTypeAndEntityIdOrderByTimestampDesc(
                        entityType,
                        entityId
                )
                .stream()
                .map(auditLogMapper::toResponse)
                .toList();
    }

    @Override
    public void deleteAuditLog(Long id) {
        AuditLog auditLog = auditLogRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Audit log not found with id: " + id
                        )
                );

        auditLogRepository.delete(auditLog);
    }
}
