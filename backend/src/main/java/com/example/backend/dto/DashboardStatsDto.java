package com.example.backend.dto;

import java.util.List;

public class DashboardStatsDto {

    private long totalTasks;
    private long completedTasks;
    private long pendingTasks;
    private int completionRate;
    private int studyStreakDays;
    private int totalPlannedMinutesToday;
    private int completedMinutesToday;
    private List<TaskDto> todayTasks;
    private List<TaskDto> upcomingTasks;

    public DashboardStatsDto() {
    }

    public long getTotalTasks() {
        return totalTasks;
    }

    public void setTotalTasks(long totalTasks) {
        this.totalTasks = totalTasks;
    }

    public long getCompletedTasks() {
        return completedTasks;
    }

    public void setCompletedTasks(long completedTasks) {
        this.completedTasks = completedTasks;
    }

    public long getPendingTasks() {
        return pendingTasks;
    }

    public void setPendingTasks(long pendingTasks) {
        this.pendingTasks = pendingTasks;
    }

    public int getCompletionRate() {
        return completionRate;
    }

    public void setCompletionRate(int completionRate) {
        this.completionRate = completionRate;
    }

    public int getStudyStreakDays() {
        return studyStreakDays;
    }

    public void setStudyStreakDays(int studyStreakDays) {
        this.studyStreakDays = studyStreakDays;
    }

    public int getTotalPlannedMinutesToday() {
        return totalPlannedMinutesToday;
    }

    public void setTotalPlannedMinutesToday(int totalPlannedMinutesToday) {
        this.totalPlannedMinutesToday = totalPlannedMinutesToday;
    }

    public int getCompletedMinutesToday() {
        return completedMinutesToday;
    }

    public void setCompletedMinutesToday(int completedMinutesToday) {
        this.completedMinutesToday = completedMinutesToday;
    }

    public List<TaskDto> getTodayTasks() {
        return todayTasks;
    }

    public void setTodayTasks(List<TaskDto> todayTasks) {
        this.todayTasks = todayTasks;
    }

    public List<TaskDto> getUpcomingTasks() {
        return upcomingTasks;
    }

    public void setUpcomingTasks(List<TaskDto> upcomingTasks) {
        this.upcomingTasks = upcomingTasks;
    }
}
