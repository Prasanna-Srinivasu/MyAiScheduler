package com.example.backend.controller;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.PracticeProblemDto;
import com.example.backend.dto.ProgressUpdateRequest;
import com.example.backend.entity.PracticeProblem;
import com.example.backend.entity.Users;
import com.example.backend.service.PracticeProblemService;
import com.example.backend.service.UsersService;

@RestController
@RequestMapping("/api/practice")
public class PracticeProblemController {

    private final PracticeProblemService practiceProblemService;
    private final UsersService usersService;

    public PracticeProblemController(
            PracticeProblemService practiceProblemService,
            UsersService usersService) {
        this.practiceProblemService = practiceProblemService;
        this.usersService = usersService;
    }

    private Long getUserId(Authentication auth) {
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return null;
        }
        Users u = usersService.getUserByEmail(auth.getName());
        return u != null ? u.getId() : null;
    }

    @GetMapping("/problems")
    public ResponseEntity<List<PracticeProblemDto>> getProblems(
            @RequestParam(required = false) String pattern,
            @RequestParam(required = false) String technology,
            @RequestParam(required = false) String concept,
            @RequestParam(required = false) String method,
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false, defaultValue = "EASY_TO_HARD") String sortBy,
            Authentication auth) {
        Long userId = getUserId(auth);
        return ResponseEntity.ok(practiceProblemService.getProblems(pattern, technology, concept, method, difficulty, sortBy, userId));
    }

    @GetMapping("/metadata")
    public ResponseEntity<Map<String, Object>> getPracticeMetadata(Authentication auth) {
        Long userId = getUserId(auth);
        return ResponseEntity.ok(practiceProblemService.getPracticeMetadata(userId));
    }

    @GetMapping("/patterns")
    public ResponseEntity<List<Map<String, Object>>> getPatterns(Authentication auth) {
        Long userId = getUserId(auth);
        return ResponseEntity.ok(practiceProblemService.getPatternsSummary(userId));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDsaStats(Authentication auth) {
        Long userId = getUserId(auth);
        return ResponseEntity.ok(practiceProblemService.getDsaStats(userId));
    }

    @PostMapping("/problems")
    public ResponseEntity<PracticeProblem> addCustomProblem(
            @RequestBody Map<String, Object> body,
            Authentication auth) {
        Long userId = getUserId(auth);
        String pattern = (String) body.getOrDefault("pattern", "General DSA");
        String title = (String) body.get("title");
        Integer num = body.get("leetcodeNumber") != null ? ((Number) body.get("leetcodeNumber")).intValue() : null;
        String url = (String) body.getOrDefault("leetcodeUrl", "");
        String difficulty = (String) body.getOrDefault("difficulty", "Medium");
        String notes = (String) body.getOrDefault("solutionNotes", "");

        PracticeProblem p = practiceProblemService.addCustomProblem(pattern, title, num, url, difficulty, notes, userId);
        return ResponseEntity.ok(p);
    }

    @PutMapping("/problems/{id}/status")
    public ResponseEntity<Map<String, String>> updateProblemStatus(
            @PathVariable Long id,
            @RequestBody ProgressUpdateRequest request,
            Authentication auth) {
        Long userId = getUserId(auth);
        if (userId == null) {
            return ResponseEntity.status(401).body(Collections.singletonMap("message", "Authentication required to record problem progress"));
        }
        practiceProblemService.updateProblemStatus(id, request.getStatus(), request.getSolutionNotes(), userId);
        return ResponseEntity.ok(Collections.singletonMap("message", "Problem progress updated successfully"));
    }
}
