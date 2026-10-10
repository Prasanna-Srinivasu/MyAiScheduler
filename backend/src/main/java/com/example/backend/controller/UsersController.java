package com.example.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.UserDto;
import com.example.backend.dto.UserProfileRequest;
import com.example.backend.entity.UserPreference;
import com.example.backend.entity.Users;
import com.example.backend.service.UsersService;

@RestController
@RequestMapping("/api/users")
public class UsersController {

    private final UsersService usersService;

    public UsersController(UsersService usersService) {
        this.usersService = usersService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(Authentication auth) {
        return ResponseEntity.ok(usersService.getUserProfile(auth.getName()));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserDto> updateProfile(@RequestBody UserProfileRequest request, Authentication auth) {
        return ResponseEntity.ok(usersService.updateProfile(auth.getName(), request));
    }

    @GetMapping("/preferences")
    public ResponseEntity<UserPreference> getPreferences(Authentication auth) {
        Users user = usersService.getUserByEmail(auth.getName());
        return ResponseEntity.ok(usersService.getPreferences(user));
    }

    @GetMapping
    public List<Users> getAllusers() {
        return usersService.getAllusers();
    }

    @GetMapping("/{id}")
    public Users getUserById(@PathVariable Long id) {
        return usersService.getUserById(id);
    }

    @PostMapping
    public Users createUsers(@RequestBody Users user) {
        return usersService.createUser(user);
    }

    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable Long id) {
        return usersService.deleteUser(id);
    }
}
