package com.example.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.backend.entity.Topic;

@Repository
public interface TopicRepository extends JpaRepository<Topic, Long> {

    List<Topic> findByCourseIdOrderByOrderIndexAsc(Long courseId);

    List<Topic> findByDsaPatternIgnoreCaseOrderByOrderIndexAsc(String dsaPattern);

    @Query("SELECT t FROM Topic t WHERE LOWER(t.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(t.description) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Topic> searchTopics(@Param("query") String query);

    boolean existsByCourseIdAndTitleIgnoreCase(Long courseId, String title);
}
