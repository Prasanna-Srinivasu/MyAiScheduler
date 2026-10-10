package com.example.backend.dto;

import java.time.LocalDate;
import java.util.List;

public class AiScheduleResponse {

    private String summary;
    private String generatedReason;
    private LocalDate scheduleDate;
    private Integer plannedMinutes;
    private Integer availableMinutes;
    private String energyLevel;
    private List<TaskDto> suggestedTasks;
    private List<String> tips;
    private String motivationalQuote;

    public AiScheduleResponse() {
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getGeneratedReason() {
        return generatedReason;
    }

    public void setGeneratedReason(String generatedReason) {
        this.generatedReason = generatedReason;
    }

    public LocalDate getScheduleDate() {
        return scheduleDate;
    }

    public void setScheduleDate(LocalDate scheduleDate) {
        this.scheduleDate = scheduleDate;
    }

    public Integer getPlannedMinutes() {
        return plannedMinutes;
    }

    public void setPlannedMinutes(Integer plannedMinutes) {
        this.plannedMinutes = plannedMinutes;
    }

    public Integer getAvailableMinutes() {
        return availableMinutes;
    }

    public void setAvailableMinutes(Integer availableMinutes) {
        this.availableMinutes = availableMinutes;
    }

    public String getEnergyLevel() {
        return energyLevel;
    }

    public void setEnergyLevel(String energyLevel) {
        this.energyLevel = energyLevel;
    }

    public List<TaskDto> getSuggestedTasks() {
        return suggestedTasks;
    }

    public void setSuggestedTasks(List<TaskDto> suggestedTasks) {
        this.suggestedTasks = suggestedTasks;
    }

    public List<String> getTips() {
        return tips;
    }

    public void setTips(List<String> tips) {
        this.tips = tips;
    }

    public String getMotivationalQuote() {
        return motivationalQuote;
    }

    public void setMotivationalQuote(String motivationalQuote) {
        this.motivationalQuote = motivationalQuote;
    }
}
