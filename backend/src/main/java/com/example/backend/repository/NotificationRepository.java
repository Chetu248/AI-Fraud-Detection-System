package com.example.backend.repository;

import com.example.backend.entity.Notification;
import com.example.backend.enums.ClaimStatus;
import com.example.backend.enums.NotificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification , Long> {

    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Notification> findByStatusOrderByCreatedAtDesc(NotificationStatus status);

    long countByUserIdAndStatus(
            Long userId,
            NotificationStatus status
    );

    long countByStatus(NotificationStatus status) ;

}
