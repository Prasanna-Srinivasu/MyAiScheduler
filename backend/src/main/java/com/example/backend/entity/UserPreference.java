package com.example.backend.entity;

import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "user_preferences")
public class UserPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @OneToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private Users user;

    @Column(name = "preferred_study_intensity", length = 50)
    private String preferredStudyIntensity = "MODERATE"; // LIGHT, MODERATE, INTENSIVE

    @Column(name = "wake_up_time")
    private LocalTime wakeUpTime;

    @Column(name = "sleep_time")
    private LocalTime sleepTime;

    @Column(name = "notification_enabled")
    private Boolean notificationEnabled = true;

    @Column(name = "daily_summary_enabled")
    private Boolean dailySummaryEnabled = true;

    @Column(name = "weekly_report_enabled")
    private Boolean weeklyReportEnabled = true;

    public UserPreference() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Users getUser() {
        return user;
    }

    public void setUser(Users user) {
        this.user = user;
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

    public Boolean getWeeklyReportEnabled() {
        return weeklyReportEnabled;
    }

    public void setWeeklyReportEnabled(Boolean weeklyReportEnabled) {
        this.weeklyReportEnabled = weeklyReportEnabled;
    }
}
