package com.example.backend.dto;

public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String targetRole;
    private String experienceLevel;

    public RegisterRequest(){}

    public String getName() {return name;}
    public void setName(String name) {this.name = name;}

    public String getEmail() {return email;}
    public void setEmail(String email) {this.email = email;}

    public String getPassword() {return password;}
    public void setPassword(String password) {this.password = password;}
    public void setPassWord(String password) {this.password = password;}

    public String getTargetRole() { return targetRole; }
    public void setTargetRole(String targetRole) { this.targetRole = targetRole; }

    public String getExperienceLevel() { return experienceLevel;}
    public void setExperienceLevel(String experienceLevel) { this.experienceLevel = experienceLevel; }
}