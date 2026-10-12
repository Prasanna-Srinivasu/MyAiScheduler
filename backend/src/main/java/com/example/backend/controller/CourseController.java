package com.example.backend.controller;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.CourseDto;
import com.example.backend.dto.ProgressUpdateRequest;
import com.example.backend.entity.Course;
import com.example.backend.entity.Subtopic;
import com.example.backend.entity.Topic;
import com.example.backend.entity.Users;
import com.example.backend.service.CourseService;
import com.example.backend.service.UsersService;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;
    private final UsersService usersService;

    public CourseController(CourseService courseService, UsersService usersService) {
        this.courseService = courseService;
        this.usersService = usersService;
    }

    private Long getUserId(Authentication auth) {
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return null;
        }
        Users u = usersService.getUserByEmail(auth.getName());
        return u != null ? u.getId() : null;
    }

    @GetMapping
    public ResponseEntity<List<CourseDto>> getAllCourses(Authentication auth) {
        Long userId = getUserId(auth);
        return ResponseEntity.ok(courseService.getCoursesForUser(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseDto> getCourseDetails(
            @PathVariable Long id,
            Authentication auth) {
        Long userId = getUserId(auth);
        return ResponseEntity.ok(courseService.getCourseDetails(id, userId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<CourseDto>> searchCourses(
            @RequestParam(required = false) String q,
            Authentication auth) {
        Long userId = getUserId(auth);
        return ResponseEntity.ok(courseService.search(q, userId));
    }

    @PostMapping
    public ResponseEntity<Course> createCourse(
            @RequestBody Map<String, String> body,
            Authentication auth) {
        Long userId = getUserId(auth);
        String technology = body.getOrDefault("technology", "Full Stack Java");
        String title = body.getOrDefault("title", technology + " Course");
        String description = body.getOrDefault("description", "");
        String category = body.getOrDefault("category", "BACKEND");
        String level = body.getOrDefault("level", "Intermediate");

        Course created = courseService.createCourse(technology, title, description, category, level, userId);
        return ResponseEntity.ok(created);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteCourse(
            @PathVariable Long id,
            Authentication auth) {
        Long userId = getUserId(auth);
        courseService.deleteCourse(id, userId);
        return ResponseEntity.ok(Collections.singletonMap("message", "Course deleted successfully"));
    }

    @PostMapping("/{courseId}/topics")
    public ResponseEntity<Topic> addTopic(
            @PathVariable Long courseId,
            @RequestBody Map<String, Object> body,
            Authentication auth) {
        Long userId = getUserId(auth);
        String title = (String) body.get("title");
        String description = (String) body.getOrDefault("description", "");
        String difficulty = (String) body.getOrDefault("difficulty", "Medium");
        Integer hours = body.get("estimatedHours") != null ? ((Number) body.get("estimatedHours")).intValue() : 5;
        String conceptsJson = (String) body.getOrDefault("conceptsJson", "[]");
        String challenge = (String) body.getOrDefault("challengeProject", "");

        Topic topic = courseService.addTopic(courseId, title, description, difficulty, hours, conceptsJson, challenge, userId);
        return ResponseEntity.ok(topic);
    }

    @PostMapping("/topics/{topicId}/subtopics")
    public ResponseEntity<Subtopic> addSubtopic(
            @PathVariable Long topicId,
            @RequestBody Map<String, String> body,
            Authentication auth) {
        Long userId = getUserId(auth);
        String title = body.get("title");
        String description = body.getOrDefault("description", "");

        Subtopic subtopic = courseService.addSubtopic(topicId, title, description, userId);
        return ResponseEntity.ok(subtopic);
    }

    @PutMapping("/topics/{topicId}/status")
    public ResponseEntity<Map<String, String>> updateTopicStatus(
            @PathVariable Long topicId,
            @RequestBody ProgressUpdateRequest request,
            Authentication auth) {
        Long userId = getUserId(auth);
        if (userId == null) {
            return ResponseEntity.status(401).body(Collections.singletonMap("message", "Authentication required to track progress"));
        }
        courseService.updateTopicStatus(topicId, request.getStatus(), userId);
        return ResponseEntity.ok(Collections.singletonMap("message", "Topic status updated"));
    }
}
