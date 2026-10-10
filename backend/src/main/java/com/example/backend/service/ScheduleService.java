package com.example.backend.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.dto.DailyScheduleDto;
import com.example.backend.dto.TaskDto;
import com.example.backend.entity.DailySchedule;
import com.example.backend.entity.Users;
import com.example.backend.repository.DailyScheduleRepository;

@Service
@Transactional
public class ScheduleService {

    private final DailyScheduleRepository dailyScheduleRepository;
    private final TaskService taskService;

    public ScheduleService(DailyScheduleRepository dailyScheduleRepository, TaskService taskService) {
        this.dailyScheduleRepository = dailyScheduleRepository;
        this.taskService = taskService;
    }

    public DailyScheduleDto getScheduleForDate(Users user, LocalDate date) {
        LocalDate queryDate = date != null ? date : LocalDate.now();
        Optional<DailySchedule> scheduleOpt = dailyScheduleRepository.findByUserAndScheduleDate(user, queryDate);

        List<TaskDto> tasks = taskService.getTasksForUser(user, queryDate, null);
        int plannedMins = tasks.stream()
                .mapToInt(t -> t.getEstimatedMinutes() != null ? t.getEstimatedMinutes() : 0)
                .sum();

        DailyScheduleDto dto = new DailyScheduleDto();
        dto.setScheduleDate(queryDate);
        dto.setTasks(tasks);
        dto.setPlannedMinutes(plannedMins);

        if (scheduleOpt.isPresent()) {
            DailySchedule schedule = scheduleOpt.get();
            dto.setId(schedule.getId());
            dto.setAvailableMinutes(schedule.getAvailableMinutes());
            dto.setEnergyLevel(schedule.getEnergyLevel());
            dto.setGeneratedReason(schedule.getGeneratedReason());
        } else {
            dto.setAvailableMinutes(240); // default 4 hours
            dto.setEnergyLevel("MEDIUM");
            dto.setGeneratedReason("Standard daily learning schedule");
        }

        return dto;
    }

    public DailySchedule saveDailySchedule(Users user, LocalDate date, int availableMinutes, int plannedMinutes, String energyLevel, String reason) {
        DailySchedule schedule = dailyScheduleRepository.findByUserAndScheduleDate(user, date)
                .orElse(new DailySchedule());

        schedule.setUser(user);
        schedule.setScheduleDate(date);
        schedule.setAvailableMinutes(availableMinutes);
        schedule.setPlannedMinutes(plannedMinutes);
        schedule.setEnergyLevel(energyLevel != null ? energyLevel : "MEDIUM");
        schedule.setGeneratedReason(reason);

        return dailyScheduleRepository.save(schedule);
    }

    public List<DailyScheduleDto> getSchedulesBetween(Users user, LocalDate startDate, LocalDate endDate) {
        List<DailySchedule> schedules = dailyScheduleRepository.findByUserAndScheduleDateBetweenOrderByScheduleDateAsc(user, startDate, endDate);
        return schedules.stream().map(s -> {
            DailyScheduleDto dto = new DailyScheduleDto();
            dto.setId(s.getId());
            dto.setScheduleDate(s.getScheduleDate());
            dto.setAvailableMinutes(s.getAvailableMinutes());
            dto.setPlannedMinutes(s.getPlannedMinutes());
            dto.setEnergyLevel(s.getEnergyLevel());
            dto.setGeneratedReason(s.getGeneratedReason());
            return dto;
        }).collect(Collectors.toList());
    }
}
