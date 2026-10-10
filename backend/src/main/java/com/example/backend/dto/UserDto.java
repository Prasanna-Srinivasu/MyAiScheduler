package com.example.backend.dto;

public class UserDto {

    private Long id;
    private String name;
    private String email;
    private String targetRole;
    private String experienceLevel;
    private String provider;
    private String pictureUrl;

    public UserDto() {
    }

    public UserDto(Long id, String name, String email, String targetRole, String experienceLevel) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.targetRole = targetRole;
        this.experienceLevel = experienceLevel;
    }

    public UserDto(Long id, String name, String email, String targetRole, String experienceLevel, String provider, String pictureUrl) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.targetRole = targetRole;
        this.experienceLevel = experienceLevel;
        this.provider = provider;
        this.pictureUrl = pictureUrl;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public String getPictureUrl() {
        return pictureUrl;
    }

    public void setPictureUrl(String pictureUrl) {
        this.pictureUrl = pictureUrl;
    }
}
