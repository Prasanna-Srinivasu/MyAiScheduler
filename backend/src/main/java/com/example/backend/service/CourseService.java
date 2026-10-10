package com.example.backend.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.dto.CourseDto;
import com.example.backend.dto.SubtopicDto;
import com.example.backend.dto.TopicDto;
import com.example.backend.entity.Course;
import com.example.backend.entity.Subtopic;
import com.example.backend.entity.Topic;
import com.example.backend.entity.UserProgress;
import com.example.backend.repository.CourseRepository;
import com.example.backend.repository.SubtopicRepository;
import com.example.backend.repository.TopicRepository;

@Service
@Transactional
public class CourseService {

    private final CourseRepository courseRepository;
    private final TopicRepository topicRepository;
    private final SubtopicRepository subtopicRepository;
    private final UserProgressService userProgressService;

    public CourseService(
            CourseRepository courseRepository,
            TopicRepository topicRepository,
            SubtopicRepository subtopicRepository,
            UserProgressService userProgressService) {
        this.courseRepository = courseRepository;
        this.topicRepository = topicRepository;
        this.subtopicRepository = subtopicRepository;
        this.userProgressService = userProgressService;
    }

    public List<CourseDto> getCoursesForUser(Long userId) {
        List<Course> courses = courseRepository.findAllAvailableForUser(userId);
        return courses.stream().map(c -> {
            List<Topic> topics = topicRepository.findByCourseIdOrderByOrderIndexAsc(c.getId());
            CourseDto dto = new CourseDto(
                    c.getId(),
                    c.getTechnology(),
                    c.getTitle(),
                    c.getDescription(),
                    c.getCategory(),
                    c.getLevel(),
                    c.getIsPredefined()
            );
            dto.setTopicCount(topics.size());

            if (userId != null && !topics.isEmpty()) {
                List<Long> topicIds = topics.stream().map(Topic::getId).toList();
                Map<Long, UserProgress> map = userProgressService.getProgressMap(userId, "TOPIC", topicIds);
                long completed = map.values().stream()
                        .filter(p -> "COMPLETED".equalsIgnoreCase(p.getStatus()) || "SOLVED".equalsIgnoreCase(p.getStatus()))
                        .count();
                dto.setCompletedTopicCount((int) completed);
            }
            return dto;
        }).collect(Collectors.toList());
    }

    public CourseDto getCourseDetails(Long courseId, Long userId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found: " + courseId));

        List<Topic> topics = topicRepository.findByCourseIdOrderByOrderIndexAsc(courseId);
        List<Long> topicIds = topics.stream().map(Topic::getId).toList();
        Map<Long, UserProgress> progressMap = (userId != null)
                ? userProgressService.getProgressMap(userId, "TOPIC", topicIds)
                : Collections.emptyMap();

        List<TopicDto> topicDtos = topics.stream().map(t -> {
            TopicDto td = new TopicDto(
                    t.getId(),
                    t.getCourseId(),
                    t.getTitle(),
                    t.getDescription(),
                    t.getOrderIndex(),
                    t.getDsaPattern(),
                    t.getDifficulty(),
                    t.getEstimatedHours(),
                    t.getConceptsJson(),
                    t.getChallengeProject()
            );

            UserProgress up = progressMap.get(t.getId());
            td.setUserStatus(up != null ? up.getStatus() : "NOT_STARTED");

            List<Subtopic> subtopics = subtopicRepository.findByTopicIdOrderByOrderIndexAsc(t.getId());
            List<SubtopicDto> stds = subtopics.stream().map(st ->
                    new SubtopicDto(st.getId(), st.getTopicId(), st.getTitle(), st.getDescription(), st.getOrderIndex(), st.getNotes())
            ).collect(Collectors.toList());
            td.setSubtopics(stds);
            return td;
        }).collect(Collectors.toList());

        CourseDto dto = new CourseDto(
                course.getId(),
                course.getTechnology(),
                course.getTitle(),
                course.getDescription(),
                course.getCategory(),
                course.getLevel(),
                course.getIsPredefined()
        );
        dto.setTopicCount(topics.size());
        long completed = progressMap.values().stream()
                .filter(p -> "COMPLETED".equalsIgnoreCase(p.getStatus()) || "SOLVED".equalsIgnoreCase(p.getStatus()))
                .count();
        dto.setCompletedTopicCount((int) completed);
        dto.setTopics(topicDtos);
        return dto;
    }

    public Course createCourse(String technology, String title, String description, String category, String level, Long userId) {
        if (title == null || title.isBlank()) {
            title = technology != null && !technology.isBlank() ? technology + " Course" : "Custom Course";
        }
        if (technology == null || technology.isBlank()) {
            technology = "Full Stack Java";
        }

        Course course = new Course();
        course.setTechnology(technology.trim());
        course.setTitle(title.trim());
        course.setDescription(description != null ? description.trim() : "Custom learning course");
        course.setCategory(category != null ? category : "BACKEND");
        course.setLevel(level != null ? level : "Intermediate");
        course.setIsPredefined(false);
        course.setCreatedByUserId(userId);
        return courseRepository.save(course);
    }

    public Topic addTopic(Long courseId, String title, String description, String difficulty, Integer hours, String conceptsJson, String challengeProject) {
        if (title == null || title.isBlank()) {
            throw new RuntimeException("Topic title is required");
        }
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found: " + courseId));

        List<Topic> existing = topicRepository.findByCourseIdOrderByOrderIndexAsc(courseId);
        int nextOrder = existing.size() + 1;

        Topic topic = new Topic(
                course.getId(),
                title.trim(),
                description != null ? description.trim() : "",
                nextOrder,
                difficulty != null ? difficulty : "Medium",
                hours != null ? hours : 5,
                conceptsJson,
                challengeProject
        );
        return topicRepository.save(topic);
    }

    public Subtopic addSubtopic(Long topicId, String title, String description) {
        if (title == null || title.isBlank()) {
            throw new RuntimeException("Subtopic title is required");
        }
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new RuntimeException("Topic not found: " + topicId));

        List<Subtopic> existing = subtopicRepository.findByTopicIdOrderByOrderIndexAsc(topicId);
        int nextOrder = existing.size() + 1;

        Subtopic subtopic = new Subtopic(topic.getId(), title.trim(), description, nextOrder);
        return subtopicRepository.save(subtopic);
    }

    public void updateTopicStatus(Long topicId, String status, Long userId) {
        userProgressService.updateProgress(userId, "TOPIC", topicId, status, null);
    }

    public List<CourseDto> search(String query, Long userId) {
        if (query == null || query.isBlank()) {
            return getCoursesForUser(userId);
        }
        List<Course> found = courseRepository.searchCourses(query.trim());
        return found.stream().map(c -> {
            CourseDto dto = new CourseDto(
                    c.getId(),
                    c.getTechnology(),
                    c.getTitle(),
                    c.getDescription(),
                    c.getCategory(),
                    c.getLevel(),
                    c.getIsPredefined()
            );
            dto.setTopicCount(topicRepository.findByCourseIdOrderByOrderIndexAsc(c.getId()).size());
            return dto;
        }).collect(Collectors.toList());
    }

    public void deleteCourse(Long courseId, Long userId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found: " + courseId));
        if (Boolean.TRUE.equals(course.getIsPredefined())) {
            throw new RuntimeException("Cannot delete predefined system courses");
        }
        if (course.getCreatedByUserId() != null && !course.getCreatedByUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized to delete this course");
        }
        courseRepository.delete(course);
    }
}
