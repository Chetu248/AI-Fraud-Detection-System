package com.example.backend.dto.notification;

import com.example.backend.enums.NotificationStatus;
import com.example.backend.enums.NotificationType;
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
public class NotificationRequest {

    @NotBlank(message = "Message is required")
    @Size(max = 500, message = "Message cannot exceed 500 characters")
    private String message;

    @NotNull(message = "Notification type is required")
    private NotificationType type;

    private NotificationStatus status;

    private Long userId;

    private Long claimId;

    private Long investigationId;
}