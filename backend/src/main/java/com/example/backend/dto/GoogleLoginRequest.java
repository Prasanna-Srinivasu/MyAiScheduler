package com.example.backend.dto;

public class GoogleLoginRequest {

    private String credential; // Google ID Token (from GIS)
    private String accessToken; // Google OAuth2 Access Token
    private String code; // Google OAuth2 Authorization Code
    private String email;
    private String name;
    private String picture;
    private String sub;

    public GoogleLoginRequest() {
    }

    public GoogleLoginRequest(String credential, String email, String name, String picture, String sub) {
        this.credential = credential;
        this.email = email;
        this.name = name;
        this.picture = picture;
        this.sub = sub;
    }

    public String getCredential() {
        return credential;
    }

    public void setCredential(String credential) {
        this.credential = credential;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPicture() {
        return picture;
    }

    public void setPicture(String picture) {
        this.picture = picture;
    }

    public String getSub() {
        return sub;
    }

    public void setSub(String sub) {
        this.sub = sub;
    }
}
