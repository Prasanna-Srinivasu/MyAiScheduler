package com.example.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.backend.entity.PracticeProblem;

@Repository
public interface PracticeProblemRepository extends JpaRepository<PracticeProblem, Long> {

    List<PracticeProblem> findByPatternOrderByLeetcodeNumberAsc(String pattern);

    List<PracticeProblem> findByTopicId(Long topicId);

    @Query("SELECT DISTINCT p.pattern FROM PracticeProblem p ORDER BY p.pattern ASC")
    List<String> findAllDistinctPatterns();

    @Query("SELECT DISTINCT p.concept FROM PracticeProblem p WHERE p.concept IS NOT NULL ORDER BY p.concept ASC")
    List<String> findAllDistinctConcepts();

    @Query("SELECT DISTINCT p.technology FROM PracticeProblem p WHERE p.technology IS NOT NULL ORDER BY p.technology ASC")
    List<String> findAllDistinctTechnologies();

    @Query("SELECT p FROM PracticeProblem p WHERE p.isCustom = false OR p.createdByUserId = :userId ORDER BY p.pattern ASC, p.leetcodeNumber ASC")
    List<PracticeProblem> findAllAvailableForUser(@Param("userId") Long userId);

    @Query("SELECT p FROM PracticeProblem p WHERE (p.isCustom = false OR p.createdByUserId = :userId) AND LOWER(p.pattern) = LOWER(:pattern) ORDER BY p.leetcodeNumber ASC")
    List<PracticeProblem> findByPatternForUser(@Param("pattern") String pattern, @Param("userId") Long userId);

    @Query("SELECT p FROM PracticeProblem p WHERE LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.pattern) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.concept) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<PracticeProblem> searchProblems(@Param("query") String query);

    boolean existsByTitleIgnoreCase(String title);

    long countByTechnology(String technology);

    java.util.Optional<PracticeProblem> findByTitleIgnoreCase(String title);
}
