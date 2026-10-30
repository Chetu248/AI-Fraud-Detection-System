package com.example.backend.repository;

import com.example.backend.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog , Long> {

    List<AuditLog> findAllByOrderByTimestampDesc();

    List<AuditLog> findByUserIdOrderByTimestampDesc(Long userId);

    List<AuditLog> findByEntityTypeAndEntityIdOrderByTimestampDesc(
            String entityType,
            Long entityId
    );
}
