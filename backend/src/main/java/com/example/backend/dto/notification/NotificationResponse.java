package com.example.backend.dto.notification;

import com.example.backend.enums.NotificationStatus;
import com.example.backend.enums.NotificationType;
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
public class NotificationResponse {

    private Long id;

    private String message;

    private NotificationType type;

    private NotificationStatus status;

    private Long userId;

    private Long claimId;

    private Long investigationId;

    private LocalDateTime createdAt;

    private LocalDateTime readAt;
}