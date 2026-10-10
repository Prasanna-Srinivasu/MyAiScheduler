package com.example.backend.controller;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.NotificationDto;
import com.example.backend.entity.Users;
import com.example.backend.service.NotificationService;
import com.example.backend.service.UsersService;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final UsersService usersService;

    public NotificationController(NotificationService notificationService, UsersService usersService) {
        this.notificationService = notificationService;
        this.usersService = usersService;
    }

    private Users getAuthenticatedUser(Authentication auth) {
        return usersService.getUserByEmail(auth.getName());
    }

    @GetMapping
    public ResponseEntity<List<NotificationDto>> getNotifications(
            @RequestParam(required = false) Boolean unreadOnly,
            Authentication auth) {
        Users user = getAuthenticatedUser(auth);
        return ResponseEntity.ok(notificationService.getNotificationsForUser(user, unreadOnly));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(Authentication auth) {
        Users user = getAuthenticatedUser(auth);
        long count = notificationService.getUnreadCount(user);
        return ResponseEntity.ok(Collections.singletonMap("count", count));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<NotificationDto> markAsRead(@PathVariable Long id, Authentication auth) {
        Users user = getAuthenticatedUser(auth);
        return ResponseEntity.ok(notificationService.markAsRead(id, user));
    }

    @PostMapping("/read-all")
    public ResponseEntity<Map<String, String>> markAllAsRead(Authentication auth) {
        Users user = getAuthenticatedUser(auth);
        notificationService.markAllAsRead(user);
        return ResponseEntity.ok(Collections.singletonMap("message", "All marked as read"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id, Authentication auth) {
        Users user = getAuthenticatedUser(auth);
        notificationService.deleteNotification(id, user);
        return ResponseEntity.noContent().build();
    }
}
