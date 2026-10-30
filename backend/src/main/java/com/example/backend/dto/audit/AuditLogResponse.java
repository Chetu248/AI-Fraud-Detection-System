package com.example.backend.dto.audit;

import com.example.backend.enums.AuditAction;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLogResponse {

    private Long id;

    private AuditAction action;

    private String entityType;

    private Long entityId;

    private Long userId;

    private String description;

    private LocalDateTime timestamp;
}