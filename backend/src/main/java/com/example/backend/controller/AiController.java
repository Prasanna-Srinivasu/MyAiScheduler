package com.example.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.AiChatRequest;
import com.example.backend.dto.AiChatResponse;
import com.example.backend.dto.AiScheduleRequest;
import com.example.backend.dto.AiScheduleResponse;
import com.example.backend.entity.Users;
import com.example.backend.service.AiSchedulerService;
import com.example.backend.service.UsersService;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final AiSchedulerService aiSchedulerService;
    private final UsersService usersService;

    public AiController(AiSchedulerService aiSchedulerService, UsersService usersService) {
        this.aiSchedulerService = aiSchedulerService;
        this.usersService = usersService;
    }

    private Users getAuthenticatedUser(Authentication auth) {
        if (auth == null || auth.getName() == null) {
            return null;
        }
        try {
            return usersService.getUserByEmail(auth.getName());
        } catch (Exception e) {
            return null;
        }
    }

    @PostMapping("/generate-schedule")
    public ResponseEntity<AiScheduleResponse> generateSchedule(
            @RequestBody AiScheduleRequest request,
            Authentication auth) {
        Users user = getAuthenticatedUser(auth);
        return ResponseEntity.ok(aiSchedulerService.generateSchedule(request, user));
    }

    @PostMapping("/chat")
    public ResponseEntity<AiChatResponse> chat(
            @RequestBody AiChatRequest request,
            Authentication auth) {
        Users user = getAuthenticatedUser(auth);
        return ResponseEntity.ok(aiSchedulerService.chat(request, user));
    }
}
