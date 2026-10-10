package com.example.backend.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.DailyScheduleDto;
import com.example.backend.entity.Users;
import com.example.backend.service.ScheduleService;
import com.example.backend.service.UsersService;

@RestController
@RequestMapping("/api/schedules")
public class ScheduleController {

    private final ScheduleService scheduleService;
    private final UsersService usersService;

    public ScheduleController(ScheduleService scheduleService, UsersService usersService) {
        this.scheduleService = scheduleService;
        this.usersService = usersService;
    }

    private Users getAuthenticatedUser(Authentication auth) {
        return usersService.getUserByEmail(auth.getName());
    }

    @GetMapping("/daily")
    public ResponseEntity<DailyScheduleDto> getDailySchedule(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            Authentication auth) {
        Users user = getAuthenticatedUser(auth);
        return ResponseEntity.ok(scheduleService.getScheduleForDate(user, date));
    }

    @GetMapping("/range")
    public ResponseEntity<List<DailyScheduleDto>> getSchedulesBetween(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end,
            Authentication auth) {
        Users user = getAuthenticatedUser(auth);
        return ResponseEntity.ok(scheduleService.getSchedulesBetween(user, start, end));
    }
}
