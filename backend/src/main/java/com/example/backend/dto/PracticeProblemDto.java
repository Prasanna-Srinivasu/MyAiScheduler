package com.example.backend.dto;

public class PracticeProblemDto {

    private Long id;
    private Long topicId;
    private String pattern;
    private String title;
    private Integer leetcodeNumber;
    private String leetcodeUrl;
    private String difficulty;
    private String technology;
    private String companies;
    private String description;
    private String hints;
    private Boolean isCustom;
    private String concept;
    private String method;
    private String userStatus; // "NOT_STARTED", "IN_PROGRESS", "SOLVED", "NEEDS_REVISION"
    private String solutionNotes;

    public PracticeProblemDto() {
    }

    public PracticeProblemDto(Long id, Long topicId, String pattern, String title, Integer leetcodeNumber, String leetcodeUrl, String difficulty, String technology, String companies, String description, String hints, Boolean isCustom) {
        this.id = id;
        this.topicId = topicId;
        this.pattern = pattern;
        this.title = title;
        this.leetcodeNumber = leetcodeNumber;
        this.leetcodeUrl = leetcodeUrl;
        this.difficulty = difficulty;
        this.technology = technology;
        this.companies = companies;
        this.description = description;
        this.hints = hints;
        this.isCustom = isCustom;
        this.userStatus = "NOT_STARTED";
    }

    public PracticeProblemDto(Long id, Long topicId, String pattern, String title, Integer leetcodeNumber, String leetcodeUrl, String difficulty, String technology, String companies, String description, String hints, Boolean isCustom, String concept, String method) {
        this(id, topicId, pattern, title, leetcodeNumber, leetcodeUrl, difficulty, technology, companies, description, hints, isCustom);
        this.concept = concept;
        this.method = method;
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

    public String getUserStatus() {
        return userStatus;
    }

    public void setUserStatus(String userStatus) {
        this.userStatus = userStatus;
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

    public String getSolutionNotes() {
        return solutionNotes;
    }

    public void setSolutionNotes(String solutionNotes) {
        this.solutionNotes = solutionNotes;
    }
}
