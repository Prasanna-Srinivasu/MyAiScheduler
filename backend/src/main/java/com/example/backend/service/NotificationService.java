package com.example.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.dto.NotificationDto;
import com.example.backend.entity.Notification;
import com.example.backend.entity.Users;
import com.example.backend.repository.NotificationRepository;

@Service
@Transactional
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public Notification createNotification(Users user, String category, String title, String message) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setCategory(category != null ? category : "SYSTEM");
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setChannel("IN_APP");
        notification.setIsRead(false);
        return notificationRepository.save(notification);
    }

    public List<NotificationDto> getNotificationsForUser(Users user, Boolean unreadOnly) {
        List<Notification> list;
        if (Boolean.TRUE.equals(unreadOnly)) {
            list = notificationRepository.findByUserAndIsReadFalseOrderByCreatedAtDesc(user);
        } else {
            list = notificationRepository.findByUserOrderByCreatedAtDesc(user);
        }
        return list.stream().map(this::toDto).collect(Collectors.toList());
    }

    public long getUnreadCount(Users user) {
        return notificationRepository.countByUserAndIsReadFalse(user);
    }

    public NotificationDto markAsRead(Long id, Users user) {
        Notification notification = notificationRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Notification not found with id: " + id));
        notification.setIsRead(true);
        Notification saved = notificationRepository.save(notification);
        return toDto(saved);
    }

    public void markAllAsRead(Users user) {
        List<Notification> unread = notificationRepository.findByUserAndIsReadFalseOrderByCreatedAtDesc(user);
        for (Notification n : unread) {
            n.setIsRead(true);
        }
        notificationRepository.saveAll(unread);
    }

    public void deleteNotification(Long id, Users user) {
        Notification notification = notificationRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Notification not found with id: " + id));
        notificationRepository.delete(notification);
    }

    private NotificationDto toDto(Notification notification) {
        NotificationDto dto = new NotificationDto();
        dto.setId(notification.getId());
        dto.setCategory(notification.getCategory());
        dto.setTitle(notification.getTitle());
        dto.setMessage(notification.getMessage());
        dto.setChannel(notification.getChannel());
        dto.setIsRead(notification.getIsRead());
        dto.setCreatedAt(notification.getCreatedAt());
        return dto;
    }
}
