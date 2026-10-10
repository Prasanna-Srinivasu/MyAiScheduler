package com.example.backend.dto;

import java.time.LocalDate;
import java.util.List;

public class AiScheduleRequest {

    private LocalDate scheduleDate;
    private Integer availableHours;
    private String energyLevel; // HIGH, MEDIUM, LOW
    private String targetRole;
    private String experienceLevel;
    private List<String> focusAreas;
    private String userPrompt;
    private Boolean autoSaveTasks = true;

    public AiScheduleRequest() {
    }

    public LocalDate getScheduleDate() {
        return scheduleDate;
    }

    public void setScheduleDate(LocalDate scheduleDate) {
        this.scheduleDate = scheduleDate;
    }

    public Integer getAvailableHours() {
        return availableHours;
    }

    public void setAvailableHours(Integer availableHours) {
        this.availableHours = availableHours;
    }

    public String getEnergyLevel() {
        return energyLevel;
    }

    public void setEnergyLevel(String energyLevel) {
        this.energyLevel = energyLevel;
    }

    public String getTargetRole() {
        return targetRole;
    }

    public void setTargetRole(String targetRole) {
        this.targetRole = targetRole;
    }

    public String getExperienceLevel() {
        return experienceLevel;
    }

    public void setExperienceLevel(String experienceLevel) {
        this.experienceLevel = experienceLevel;
    }

    public List<String> getFocusAreas() {
        return focusAreas;
    }

    public void setFocusAreas(List<String> focusAreas) {
        this.focusAreas = focusAreas;
    }

    public String getUserPrompt() {
        return userPrompt;
    }

    public void setUserPrompt(String userPrompt) {
        this.userPrompt = userPrompt;
    }

    public Boolean getAutoSaveTasks() {
        return autoSaveTasks;
    }

    public void setAutoSaveTasks(Boolean autoSaveTasks) {
        this.autoSaveTasks = autoSaveTasks;
    }
}
