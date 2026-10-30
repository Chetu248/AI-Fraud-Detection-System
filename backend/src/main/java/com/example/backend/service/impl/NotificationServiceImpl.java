package com.example.backend.service.impl;

import com.example.backend.dto.notification.NotificationRequest;
import com.example.backend.dto.notification.NotificationResponse;
import com.example.backend.entity.Notification;
import com.example.backend.enums.NotificationStatus;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.mapper.NotificationMapper;
import com.example.backend.repository.NotificationRepository;
import com.example.backend.service.interfaces.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;

    @Override
    public NotificationResponse createNotification(NotificationRequest request) {
        Notification notification = Notification.builder()
                .message(request.getMessage())
                .type(request.getType())
                .status(
                        request.getStatus() != null
                                ? request.getStatus()
                                : NotificationStatus.UNREAD
                )
                .userId(request.getUserId())
                .claimId(request.getClaimId())
                .investigationId(request.getInvestigationId())
                .build();

        if (notification.getStatus() == NotificationStatus.READ) {
            notification.setReadAt(LocalDateTime.now());
        }

        Notification savedNotification =
                notificationRepository.save(notification);

        return notificationMapper.toResponse(savedNotification);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> getAllNotifications() {
        return notificationRepository.findAll()
                .stream()
                .map(notificationMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> getNotificationsByUser(Long userId) {
        return notificationRepository
                .findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(notificationMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public NotificationResponse getNotificationById(Long id) {
        Notification notification =
                notificationRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Notification not found with id: " + id
                                )
                        );

        return notificationMapper.toResponse(notification);
    }

    @Override
    public NotificationResponse markAsRead(Long id) {
        Notification notification =
                notificationRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Notification not found with id: " + id
                                )
                        );

        notification.setStatus(NotificationStatus.READ);
        notification.setReadAt(LocalDateTime.now());

        Notification updatedNotification =
                notificationRepository.save(notification);

        return notificationMapper.toResponse(updatedNotification);
    }

    @Override
    public void deleteNotification(Long id) {
        Notification notification =
                notificationRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Notification not found with id: " + id
                                )
                        );

        notificationRepository.delete(notification);
    }
}
