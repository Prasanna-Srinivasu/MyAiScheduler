package com.example.backend.dto;

public class SubtopicDto {

    private Long id;
    private Long topicId;
    private String title;
    private String description;
    private Integer orderIndex;
    private String notes;

    public SubtopicDto() {
    }

    public SubtopicDto(Long id, Long topicId, String title, String description, Integer orderIndex, String notes) {
        this.id = id;
        this.topicId = topicId;
        this.title = title;
        this.description = description;
        this.orderIndex = orderIndex;
        this.notes = notes;
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

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
