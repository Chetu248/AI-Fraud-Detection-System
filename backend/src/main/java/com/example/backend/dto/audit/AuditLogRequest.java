package com.example.backend.dto.audit;

import com.example.backend.enums.AuditAction;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLogRequest {

    @NotNull(message = "Action is required")
    private AuditAction action;

    @NotBlank(message = "Entity type is required")
    private String entityType;

    private Long entityId;

    private Long userId;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;
}