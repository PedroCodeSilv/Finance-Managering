package com.pedro.finances_manager.controller;

import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pedro.finances_manager.dto.notification.NotificationResponseDTO;
import com.pedro.finances_manager.entities.Notification;
import com.pedro.finances_manager.repository.NotificationRepository;
import com.pedro.finances_manager.security.JWTUserData;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationRepository notificationRepository;

    public NotificationController(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @GetMapping
    public List<NotificationResponseDTO> getAll(@AuthenticationPrincipal JWTUserData user) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.userId())
                .stream()
                .map(NotificationResponseDTO::from)
                .toList();
    }

    @GetMapping("/unread")
    public List<NotificationResponseDTO> getUnread(@AuthenticationPrincipal JWTUserData user) {
        return notificationRepository.findByUserIdAndReadFalseOrderByCreatedAtDesc(user.userId())
                .stream()
                .map(NotificationResponseDTO::from)
                .toList();
    }

    @GetMapping("/unread/count")
    public long getUnreadCount(@AuthenticationPrincipal JWTUserData user) {
        return notificationRepository.countByUserIdAndReadFalse(user.userId());
    }

    @PutMapping("/{id}/read")
    public void markAsRead(@AuthenticationPrincipal JWTUserData user, @PathVariable Long id) {
        Notification notification = notificationRepository.findById(id).orElse(null);
        if (notification != null && notification.getUser().getId().equals(user.userId())) {
            notification.setRead(true);
            notificationRepository.save(notification);
        }
    }

    @PutMapping("/read-all")
    public void markAllAsRead(@AuthenticationPrincipal JWTUserData user) {
        List<Notification> unread = notificationRepository.findByUserIdAndReadFalseOrderByCreatedAtDesc(user.userId());
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }
}
