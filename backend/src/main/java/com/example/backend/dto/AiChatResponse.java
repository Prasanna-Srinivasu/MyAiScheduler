package com.example.backend.dto;

import java.util.List;

public class AiChatResponse {

    private String reply;
    private String topic;
    private List<String> suggestions;
    private List<TaskDto> suggestedTasks;
    private String quizQuestion;
    private List<String> quizOptions;
    private Integer correctOptionIndex;
    private String quizExplanation;

    public AiChatResponse() {
    }

    public AiChatResponse(String reply) {
        this.reply = reply;
    }

    public AiChatResponse(String reply, List<String> suggestions) {
        this.reply = reply;
        this.suggestions = suggestions;
    }

    public String getReply() {
        return reply;
    }

    public void setReply(String reply) {
        this.reply = reply;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public List<String> getSuggestions() {
        return suggestions;
    }

    public void setSuggestions(List<String> suggestions) {
        this.suggestions = suggestions;
    }

    public List<TaskDto> getSuggestedTasks() {
        return suggestedTasks;
    }

    public void setSuggestedTasks(List<TaskDto> suggestedTasks) {
        this.suggestedTasks = suggestedTasks;
    }

    public String getQuizQuestion() {
        return quizQuestion;
    }

    public void setQuizQuestion(String quizQuestion) {
        this.quizQuestion = quizQuestion;
    }

    public List<String> getQuizOptions() {
        return quizOptions;
    }

    public void setQuizOptions(List<String> quizOptions) {
        this.quizOptions = quizOptions;
    }

    public Integer getCorrectOptionIndex() {
        return correctOptionIndex;
    }

    public void setCorrectOptionIndex(Integer correctOptionIndex) {
        this.correctOptionIndex = correctOptionIndex;
    }

    public String getQuizExplanation() {
        return quizExplanation;
    }

    public void setQuizExplanation(String quizExplanation) {
        this.quizExplanation = quizExplanation;
    }
}
