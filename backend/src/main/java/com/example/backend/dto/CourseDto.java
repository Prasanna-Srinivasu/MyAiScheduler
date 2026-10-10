package com.example.backend.dto;

import java.util.List;

public class CourseDto {

    private Long id;
    private String technology;
    private String title;
    private String description;
    private String category;
    private String level;
    private Boolean isPredefined;
    private Integer topicCount = 0;
    private Integer completedTopicCount = 0;
    private List<TopicDto> topics;

    public CourseDto() {
    }

    public CourseDto(Long id, String technology, String title, String description, String category, String level, Boolean isPredefined) {
        this.id = id;
        this.technology = technology;
        this.title = title;
        this.description = description;
        this.category = category;
        this.level = level;
        this.isPredefined = isPredefined;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTechnology() {
        return technology;
    }

    public void setTechnology(String technology) {
        this.technology = technology;
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

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public Boolean getIsPredefined() {
        return isPredefined;
    }

    public void setIsPredefined(Boolean isPredefined) {
        this.isPredefined = isPredefined;
    }

    public Integer getTopicCount() {
        return topicCount;
    }

    public void setTopicCount(Integer topicCount) {
        this.topicCount = topicCount;
    }

    public Integer getCompletedTopicCount() {
        return completedTopicCount;
    }

    public void setCompletedTopicCount(Integer completedTopicCount) {
        this.completedTopicCount = completedTopicCount;
    }

    public List<TopicDto> getTopics() {
        return topics;
    }

    public void setTopics(List<TopicDto> topics) {
        this.topics = topics;
    }
}
