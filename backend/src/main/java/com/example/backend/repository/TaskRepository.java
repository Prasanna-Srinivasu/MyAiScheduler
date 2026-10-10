package com.example.backend.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.entity.Task;
import com.example.backend.entity.Users;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByUserOrderByTaskDateAscCreatedAtDesc(Users user);

    List<Task> findByUserAndTaskDateOrderByCreatedAtDesc(Users user, LocalDate taskDate);

    List<Task> findByUserAndTaskDateBetweenOrderByTaskDateAscCreatedAtDesc(Users user, LocalDate startDate, LocalDate endDate);

    List<Task> findByUserAndStatusOrderByTaskDateAsc(Users user, String status);

    Optional<Task> findByIdAndUser(Long id, Users user);

    long countByUserAndStatus(Users user, String status);

    long countByUser(Users user);
}
