package com.example.backend.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.DashboardStatsDto;
import com.example.backend.dto.TaskDto;
import com.example.backend.dto.TaskRequest;
import com.example.backend.entity.Users;
import com.example.backend.service.TaskService;
import com.example.backend.service.UsersService;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;
    private final UsersService usersService;

    public TaskController(TaskService taskService, UsersService usersService) {
        this.taskService = taskService;
        this.usersService = usersService;
    }

    private Users getAuthenticatedUser(Authentication auth) {
        return usersService.getUserByEmail(auth.getName());
    }

    @GetMapping
    public ResponseEntity<List<TaskDto>> getTasks(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) String status,
            Authentication auth) {
        Users user = getAuthenticatedUser(auth);
        return ResponseEntity.ok(taskService.getTasksForUser(user, date, status));
    }

    @GetMapping("/range")
    public ResponseEntity<List<TaskDto>> getTasksBetween(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end,
            Authentication auth) {
        Users user = getAuthenticatedUser(auth);
        return ResponseEntity.ok(taskService.getTasksBetweenDates(user, start, end));
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDto> getStats(Authentication auth) {
        Users user = getAuthenticatedUser(auth);
        return ResponseEntity.ok(taskService.getDashboardStats(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskDto> getTaskById(@PathVariable Long id, Authentication auth) {
        Users user = getAuthenticatedUser(auth);
        return ResponseEntity.ok(taskService.getTaskById(id, user));
    }

    @PostMapping
    public ResponseEntity<TaskDto> createTask(@RequestBody TaskRequest request, Authentication auth) {
        Users user = getAuthenticatedUser(auth);
        return ResponseEntity.ok(taskService.createTask(request, user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskDto> updateTask(
            @PathVariable Long id,
            @RequestBody TaskRequest request,
            Authentication auth) {
        Users user = getAuthenticatedUser(auth);
        return ResponseEntity.ok(taskService.updateTask(id, request, user));
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<TaskDto> toggleTaskStatus(@PathVariable Long id, Authentication auth) {
        Users user = getAuthenticatedUser(auth);
        return ResponseEntity.ok(taskService.toggleTaskStatus(id, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id, Authentication auth) {
        Users user = getAuthenticatedUser(auth);
        taskService.deleteTask(id, user);
        return ResponseEntity.noContent().build();
    }
}
