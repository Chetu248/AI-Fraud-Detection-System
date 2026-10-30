package com.example.backend.entity;

import com.example.backend.enums.AuditAction;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuditAction action;

    @Column(nullable = false)
    private String entityType;

    private Long entityId;

    private Long userId;

    @Column(length = 1000)
    private String description;

    private LocalDateTime timestamp;

    @PrePersist
    protected void onCreate() {

        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
    }
}