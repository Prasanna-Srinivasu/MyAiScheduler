package com.example.backend.dto;

public class ProgressUpdateRequest {

    private String status; // "NOT_STARTED", "IN_PROGRESS", "SOLVED", "COMPLETED", "NEEDS_REVISION"
    private String solutionNotes;

    public ProgressUpdateRequest() {
    }

    public ProgressUpdateRequest(String status, String solutionNotes) {
        this.status = status;
        this.solutionNotes = solutionNotes;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getSolutionNotes() {
        return solutionNotes;
    }

    public void setSolutionNotes(String solutionNotes) {
        this.solutionNotes = solutionNotes;
    }
}
