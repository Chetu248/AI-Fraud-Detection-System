package com.example.backend.service.interfaces;

import com.example.backend.dto.notification.NotificationRequest;
import com.example.backend.dto.notification.NotificationResponse;

import java.util.List;

public interface NotificationService {

    NotificationResponse createNotification(NotificationRequest request);

    List<NotificationResponse> getAllNotifications();

    List<NotificationResponse> getNotificationsByUser(Long userId);

    NotificationResponse getNotificationById(Long id);

    NotificationResponse markAsRead(Long id);

    void deleteNotification(Long id);
}
