package com.example.backend.dto;

import java.time.LocalTime;

public class UserProfileRequest {

    private String name;
    private String targetRole;
    private String experienceLevel;
    private String preferredStudyIntensity;
    private LocalTime wakeUpTime;
    private LocalTime sleepTime;
    private Boolean notificationEnabled;
    private Boolean dailySummaryEnabled;

    public UserProfileRequest() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public String getPreferredStudyIntensity() {
        return preferredStudyIntensity;
    }

    public void setPreferredStudyIntensity(String preferredStudyIntensity) {
        this.preferredStudyIntensity = preferredStudyIntensity;
    }

    public LocalTime getWakeUpTime() {
        return wakeUpTime;
    }

    public void setWakeUpTime(LocalTime wakeUpTime) {
        this.wakeUpTime = wakeUpTime;
    }

    public LocalTime getSleepTime() {
        return sleepTime;
    }

    public void setSleepTime(LocalTime sleepTime) {
        this.sleepTime = sleepTime;
    }

    public Boolean getNotificationEnabled() {
        return notificationEnabled;
    }

    public void setNotificationEnabled(Boolean notificationEnabled) {
        this.notificationEnabled = notificationEnabled;
    }

    public Boolean getDailySummaryEnabled() {
        return dailySummaryEnabled;
    }

    public void setDailySummaryEnabled(Boolean dailySummaryEnabled) {
        this.dailySummaryEnabled = dailySummaryEnabled;
    }
}
