package com.example.backend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "topics")
public class Topic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "course_id", nullable = false)
    private Long courseId;

    @Column(name = "title", nullable = false, length = 150)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "order_index", nullable = false)
    private Integer orderIndex = 0;

    @Column(name = "dsa_pattern", length = 80)
    private String dsaPattern;

    @Column(name = "difficulty", length = 30)
    private String difficulty; // Easy, Medium, Hard

    @Column(name = "estimated_hours")
    private Integer estimatedHours = 5;

    @Column(name = "concepts_json", columnDefinition = "TEXT")
    private String conceptsJson;

    @Column(name = "challenge_project", columnDefinition = "TEXT")
    private String challengeProject;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Topic() {
    }

    public Topic(Long courseId, String title, String description, Integer orderIndex, String difficulty, Integer estimatedHours, String conceptsJson, String challengeProject) {
        this.courseId = courseId;
        this.title = title;
        this.description = description;
        this.orderIndex = orderIndex != null ? orderIndex : 0;
        this.difficulty = difficulty != null ? difficulty : "Medium";
        this.estimatedHours = estimatedHours != null ? estimatedHours : 5;
        this.conceptsJson = conceptsJson;
        this.challengeProject = challengeProject;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
