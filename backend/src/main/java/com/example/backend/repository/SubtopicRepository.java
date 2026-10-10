package com.example.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.entity.Subtopic;

@Repository
public interface SubtopicRepository extends JpaRepository<Subtopic, Long> {

    List<Subtopic> findByTopicIdOrderByOrderIndexAsc(Long topicId);

    boolean existsByTopicIdAndTitleIgnoreCase(Long topicId, String title);
}
