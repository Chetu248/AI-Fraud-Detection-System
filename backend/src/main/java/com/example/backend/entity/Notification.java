package com.example.backend.entity;

import com.example.backend.enums.NotificationStatus;
import com.example.backend.enums.NotificationType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "notifications")
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id ;

    @Column(nullable = false , length = 500)
    private String message ;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationType type ;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationStatus status ;

    private Long userId ;

    private Long claimId ;

    private Long investigationId ;

    private LocalDateTime createdAt ;

    private LocalDateTime readAt ;

    @PrePersist
    protected void onCreate() {

        createdAt = LocalDateTime.now();

        if (status == null) {
            status = NotificationStatus.UNREAD;
        }
    }
}
