package com.pedro.finances_manager.dto.notification;

import java.time.LocalDateTime;

import com.pedro.finances_manager.entities.Notification;

public record NotificationResponseDTO(
        Long id,
        String title,
        String message,
        boolean read,
        LocalDateTime createdAt
) {
    public static NotificationResponseDTO from(Notification n) {
        return new NotificationResponseDTO(n.getId(), n.getTitle(), n.getMessage(), n.isRead(), n.getCreatedAt());
    }
}
