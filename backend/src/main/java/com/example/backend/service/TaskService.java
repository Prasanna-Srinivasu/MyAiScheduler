package com.example.backend.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.dto.DashboardStatsDto;
import com.example.backend.dto.TaskDto;
import com.example.backend.dto.TaskRequest;
import com.example.backend.entity.Task;
import com.example.backend.entity.Users;
import com.example.backend.repository.TaskRepository;

@Service
@Transactional
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<TaskDto> getTasksForUser(Users user, LocalDate date, String status) {
        List<Task> tasks;
        if (date != null) {
            tasks = taskRepository.findByUserAndTaskDateOrderByCreatedAtDesc(user, date);
        } else if (status != null && !status.isBlank()) {
            tasks = taskRepository.findByUserAndStatusOrderByTaskDateAsc(user, status.toUpperCase());
        } else {
            tasks = taskRepository.findByUserOrderByTaskDateAscCreatedAtDesc(user);
        }
        return tasks.stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<TaskDto> getTasksBetweenDates(Users user, LocalDate startDate, LocalDate endDate) {
        return taskRepository.findByUserAndTaskDateBetweenOrderByTaskDateAscCreatedAtDesc(user, startDate, endDate)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    public TaskDto getTaskById(Long id, Users user) {
        Task task = taskRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));
        return toDto(task);
    }

    public TaskDto createTask(TaskRequest request, Users user) {
        Task task = new Task();
        task.setUser(user);
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setTaskDate(request.getTaskDate() != null ? request.getTaskDate() : LocalDate.now());
        task.setEstimatedMinutes(request.getEstimatedMinutes() != null ? request.getEstimatedMinutes() : 45);
        task.setPriority(request.getPriority() != null ? request.getPriority() : "MEDIUM");
        task.setCategory(request.getCategory() != null ? request.getCategory() : "STUDY");
        task.setStatus(request.getStatus() != null ? request.getStatus() : "PENDING");

        Task saved = taskRepository.save(task);
        return toDto(saved);
    }

    public TaskDto updateTask(Long id, TaskRequest request, Users user) {
        Task task = taskRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));

        if (request.getTitle() != null) {
            task.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            task.setDescription(request.getDescription());
        }
        if (request.getTaskDate() != null) {
            task.setTaskDate(request.getTaskDate());
        }
        if (request.getEstimatedMinutes() != null) {
            task.setEstimatedMinutes(request.getEstimatedMinutes());
        }
        if (request.getPriority() != null) {
            task.setPriority(request.getPriority());
        }
        if (request.getCategory() != null) {
            task.setCategory(request.getCategory());
        }
        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
            if ("COMPLETED".equalsIgnoreCase(request.getStatus()) && task.getCompletedAt() == null) {
                task.setCompletedAt(LocalDateTime.now());
            } else if (!"COMPLETED".equalsIgnoreCase(request.getStatus())) {
                task.setCompletedAt(null);
            }
        }

        Task saved = taskRepository.save(task);
        return toDto(saved);
    }

    public TaskDto toggleTaskStatus(Long id, Users user) {
        Task task = taskRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));

        if ("COMPLETED".equalsIgnoreCase(task.getStatus())) {
            task.setStatus("PENDING");
            task.setCompletedAt(null);
        } else {
            task.setStatus("COMPLETED");
            task.setCompletedAt(LocalDateTime.now());
        }

        Task saved = taskRepository.save(task);
        return toDto(saved);
    }

    public void deleteTask(Long id, Users user) {
        Task task = taskRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));
        taskRepository.delete(task);
    }

    public DashboardStatsDto getDashboardStats(Users user) {
        LocalDate today = LocalDate.now();
        List<Task> allTasks = taskRepository.findByUserOrderByTaskDateAscCreatedAtDesc(user);
        List<Task> todayTasks = taskRepository.findByUserAndTaskDateOrderByCreatedAtDesc(user, today);
        List<Task> upcomingTasks = taskRepository.findByUserAndTaskDateBetweenOrderByTaskDateAscCreatedAtDesc(user, today.plusDays(1), today.plusDays(7));

        long totalCount = allTasks.size();
        long completedCount = allTasks.stream().filter(t -> "COMPLETED".equalsIgnoreCase(t.getStatus())).count();
        long pendingCount = totalCount - completedCount;

        int completionRate = totalCount > 0 ? (int) Math.round(((double) completedCount / totalCount) * 100) : 0;

        int totalPlannedToday = todayTasks.stream()
                .mapToInt(t -> t.getEstimatedMinutes() != null ? t.getEstimatedMinutes() : 0)
                .sum();

        int completedToday = todayTasks.stream()
                .filter(t -> "COMPLETED".equalsIgnoreCase(t.getStatus()))
                .mapToInt(t -> t.getEstimatedMinutes() != null ? t.getEstimatedMinutes() : 0)
                .sum();

        // Calculate simple streak based on completed tasks
        int streak = completedCount > 0 ? (int) Math.min(7, Math.max(1, completedCount / 2)) : 0;

        DashboardStatsDto stats = new DashboardStatsDto();
        stats.setTotalTasks(totalCount);
        stats.setCompletedTasks(completedCount);
        stats.setPendingTasks(pendingCount);
        stats.setCompletionRate(completionRate);
        stats.setStudyStreakDays(streak);
        stats.setTotalPlannedMinutesToday(totalPlannedToday);
        stats.setCompletedMinutesToday(completedToday);
        stats.setTodayTasks(todayTasks.stream().map(this::toDto).collect(Collectors.toList()));
        stats.setUpcomingTasks(upcomingTasks.stream().map(this::toDto).collect(Collectors.toList()));

        return stats;
    }

    public TaskDto toDto(Task task) {
        TaskDto dto = new TaskDto();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setTaskDate(task.getTaskDate());
        dto.setEstimatedMinutes(task.getEstimatedMinutes());
        dto.setPriority(task.getPriority());
        dto.setCategory(task.getCategory());
        dto.setStatus(task.getStatus());
        dto.setCompletedAt(task.getCompletedAt());
        dto.setCreatedAt(task.getCreatedAt());
        dto.setUpdatedAt(task.getUpdatedAt());
        return dto;
    }
}
