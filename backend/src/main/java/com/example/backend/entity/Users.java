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
@Table(name = "users")
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "email", nullable = false, unique = true, length = 150)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "target_role")
    private String targetRole;

    @Column(name = "experience_level")
    private String experienceLevel;

    @Column(name = "provider")
    private String provider;

    @Column(name = "picture_url", length = 500)
    private String pictureUrl;

    @Column(name = "google_id")
    private String googleId;

    @Column(name = "github_id")
    private String githubId;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Setter methodt
    public void setId(Long id) {
        this.id = id;

    }

    public void setName(String name) {
        this.name = name;

    }

    public void setEmail(String email) {
        this.email = email;

    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;

    }

    public void setTargetRole(String targetRole) {
        this.targetRole = targetRole;

    }

    public void setExperienceLevel(String experienceLevel) {
        this.experienceLevel = experienceLevel;

    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;

    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;

    }

    public Users() {
    }

    // Getter method

    public Long getId() {
        return this.id;
    }

    public String getName() {
        return this.name;
    }

    public String getEmail() {
        return this.email;
    }

    public String getPasswordHash() {
        return this.passwordHash;
    }

    public String getTargetRole() {
        return this.targetRole;
    }

    public String getExperienceLevel() {
        return this.experienceLevel;
    }

    public String getProvider() {
        return this.provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public String getPictureUrl() {
        return this.pictureUrl;
    }

    public void setPictureUrl(String pictureUrl) {
        this.pictureUrl = pictureUrl;
    }

    public String getGoogleId() {
        return this.googleId;
    }

    public void setGoogleId(String googleId) {
        this.googleId = googleId;
    }

    public String getGithubId() {
        return this.githubId;
    }

    public void setGithubId(String githubId) {
        this.githubId = githubId;
    }

    public LocalDateTime getCreatedAt() {
        return this.createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return this.updatedAt;
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
}
