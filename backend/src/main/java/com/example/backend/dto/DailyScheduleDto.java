package com.example.backend.dto;

import java.time.LocalDate;
import java.util.List;

public class DailyScheduleDto {

    private Long id;
    private LocalDate scheduleDate;
    private Integer availableMinutes;
    private Integer plannedMinutes;
    private String energyLevel;
    private String generatedReason;
    private List<TaskDto> tasks;

    public DailyScheduleDto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getScheduleDate() {
        return scheduleDate;
    }

    public void setScheduleDate(LocalDate scheduleDate) {
        this.scheduleDate = scheduleDate;
    }

    public Integer getAvailableMinutes() {
        return availableMinutes;
    }

    public void setAvailableMinutes(Integer availableMinutes) {
        this.availableMinutes = availableMinutes;
    }

    public Integer getPlannedMinutes() {
        return plannedMinutes;
    }

    public void setPlannedMinutes(Integer plannedMinutes) {
        this.plannedMinutes = plannedMinutes;
    }

    public String getEnergyLevel() {
        return energyLevel;
    }

    public void setEnergyLevel(String energyLevel) {
        this.energyLevel = energyLevel;
    }

    public String getGeneratedReason() {
        return generatedReason;
    }

    public void setGeneratedReason(String generatedReason) {
        this.generatedReason = generatedReason;
    }

    public List<TaskDto> getTasks() {
        return tasks;
    }

    public void setTasks(List<TaskDto> tasks) {
        this.tasks = tasks;
    }
}
