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
@Table(name = "practice_problems")
public class PracticeProblem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "topic_id")
    private Long topicId;

    @Column(name = "pattern", nullable = false, length = 100)
    private String pattern; // "Two Pointers", "Sliding Window", "Arrays & Hashing", etc.

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "leetcode_number")
    private Integer leetcodeNumber;

    @Column(name = "leetcode_url", length = 500)
    private String leetcodeUrl;

    @Column(name = "difficulty", nullable = false, length = 30)
    private String difficulty; // Easy, Medium, Hard

    @Column(name = "technology", length = 50)
    private String technology = "DSA"; // DSA, Java, Spring Boot, React, SQL

    @Column(name = "companies", length = 300)
    private String companies;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "hints", columnDefinition = "TEXT")
    private String hints;

    @Column(name = "is_custom", nullable = false)
    private Boolean isCustom = false;

    @Column(name = "created_by_user_id")
    private Long createdByUserId;

    @Column(name = "concept", length = 100)
    private String concept;

    @Column(name = "method", length = 100)
    private String method;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public PracticeProblem() {
    }

    public PracticeProblem(String pattern, String title, Integer leetcodeNumber, String leetcodeUrl, String difficulty, String technology, String companies, String description) {
        this.pattern = pattern;
        this.title = title;
        this.leetcodeNumber = leetcodeNumber;
        this.leetcodeUrl = leetcodeUrl;
        this.difficulty = difficulty != null ? difficulty : "Medium";
        this.technology = technology != null ? technology : "DSA";
        this.companies = companies;
        this.description = description;
        this.isCustom = false;
    }

    public PracticeProblem(String pattern, String title, Integer leetcodeNumber, String leetcodeUrl, String difficulty, String technology, String companies, String description, String concept, String method) {
        this(pattern, title, leetcodeNumber, leetcodeUrl, difficulty, technology, companies, description);
        this.concept = concept;
        this.method = method;
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

    public Long getTopicId() {
        return topicId;
    }

    public void setTopicId(Long topicId) {
        this.topicId = topicId;
    }

    public String getPattern() {
        return pattern;
    }

    public void setPattern(String pattern) {
        this.pattern = pattern;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getLeetcodeNumber() {
        return leetcodeNumber;
    }

    public void setLeetcodeNumber(Integer leetcodeNumber) {
        this.leetcodeNumber = leetcodeNumber;
    }

    public String getLeetcodeUrl() {
        return leetcodeUrl;
    }

    public void setLeetcodeUrl(String leetcodeUrl) {
        this.leetcodeUrl = leetcodeUrl;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public String getTechnology() {
        return technology;
    }

    public void setTechnology(String technology) {
        this.technology = technology;
    }

    public String getCompanies() {
        return companies;
    }

    public void setCompanies(String companies) {
        this.companies = companies;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getHints() {
        return hints;
    }

    public void setHints(String hints) {
        this.hints = hints;
    }

    public Boolean getIsCustom() {
        return isCustom;
    }

    public void setIsCustom(Boolean isCustom) {
        this.isCustom = isCustom;
    }

    public Long getCreatedByUserId() {
        return createdByUserId;
    }

    public void setCreatedByUserId(Long createdByUserId) {
        this.createdByUserId = createdByUserId;
    }

    public String getConcept() {
        return concept;
    }

    public void setConcept(String concept) {
        this.concept = concept;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
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
