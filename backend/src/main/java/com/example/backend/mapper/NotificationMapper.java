package com.example.backend.mapper;

import com.example.backend.dto.notification.NotificationResponse;
import com.example.backend.entity.Notification;
import org.springframework.stereotype.Component;

@Component
public class NotificationMapper {

    public NotificationResponse toResponse(Notification notification) {

        return NotificationResponse.builder()
                .id(notification.getId())
                .message(notification.getMessage())
                .type(notification.getType())
                .status(notification.getStatus())
                .userId(notification.getUserId())
                .claimId(notification.getClaimId())
                .investigationId(notification.getInvestigationId())
                .createdAt(notification.getCreatedAt())
                .readAt(notification.getReadAt())
                .build();
    }
}
