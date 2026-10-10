package com.example.backend.dto;

import java.util.List;

public class TopicDto {

    private Long id;
    private Long courseId;
    private String title;
    private String description;
    private Integer orderIndex;
    private String dsaPattern;
    private String difficulty;
    private Integer estimatedHours;
    private String conceptsJson;
    private String challengeProject;
    private String userStatus; // "NOT_STARTED", "IN_PROGRESS", "NEEDS_REVISION", "COMPLETED"
    private List<SubtopicDto> subtopics;

    public TopicDto() {
    }

    public TopicDto(Long id, Long courseId, String title, String description, Integer orderIndex, String dsaPattern, String difficulty, Integer estimatedHours, String conceptsJson, String challengeProject) {
        this.id = id;
        this.courseId = courseId;
        this.title = title;
        this.description = description;
        this.orderIndex = orderIndex;
        this.dsaPattern = dsaPattern;
        this.difficulty = difficulty;
        this.estimatedHours = estimatedHours;
        this.conceptsJson = conceptsJson;
        this.challengeProject = challengeProject;
        this.userStatus = "NOT_STARTED";
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
    }

    public String getDsaPattern() {
        return dsaPattern;
    }

    public void setDsaPattern(String dsaPattern) {
        this.dsaPattern = dsaPattern;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public Integer getEstimatedHours() {
        return estimatedHours;
    }

    public void setEstimatedHours(Integer estimatedHours) {
        this.estimatedHours = estimatedHours;
    }

    public String getConceptsJson() {
        return conceptsJson;
    }

    public void setConceptsJson(String conceptsJson) {
        this.conceptsJson = conceptsJson;
    }

    public String getChallengeProject() {
        return challengeProject;
    }

    public void setChallengeProject(String challengeProject) {
        this.challengeProject = challengeProject;
    }

    public String getUserStatus() {
        return userStatus;
    }

    public void setUserStatus(String userStatus) {
        this.userStatus = userStatus;
    }

    public List<SubtopicDto> getSubtopics() {
        return subtopics;
    }

    public void setSubtopics(List<SubtopicDto> subtopics) {
        this.subtopics = subtopics;
    }
}
