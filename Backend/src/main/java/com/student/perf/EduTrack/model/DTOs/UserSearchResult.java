package com.student.perf.EduTrack.model.DTOs;

public class UserSearchResult {
    private String username;
    private String name;
    private String role;
    private boolean detailsFilled;

    public UserSearchResult(String username, String name, String role) {
        this.username = username;
        this.name = name;
        this.role = role;
        this.detailsFilled = false;
    }

    // getters
    public String getUsername() { return username; }
    public String getName() { return name; }
    public String getRole() { return role; }
    public boolean isDetailsFilled() { return detailsFilled; }
}

