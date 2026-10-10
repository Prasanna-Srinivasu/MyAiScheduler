package com.example.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.backend.entity.Course;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    List<Course> findByIsPredefinedTrueOrderByTechnologyAsc();

    @Query("SELECT c FROM Course c WHERE c.isPredefined = true OR c.createdByUserId = :userId ORDER BY c.technology ASC")
    List<Course> findAllAvailableForUser(@Param("userId") Long userId);

    List<Course> findByTechnologyIgnoreCase(String technology);

    @Query("SELECT c FROM Course c WHERE LOWER(c.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(c.technology) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Course> searchCourses(@Param("query") String query);

    boolean existsByTitleIgnoreCase(String title);
}
