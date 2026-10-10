package com.example.backend.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.entity.DailySchedule;
import com.example.backend.entity.Users;

@Repository
public interface DailyScheduleRepository extends JpaRepository<DailySchedule, Long> {

    Optional<DailySchedule> findByUserAndScheduleDate(Users user, LocalDate scheduleDate);

    List<DailySchedule> findByUserAndScheduleDateBetweenOrderByScheduleDateAsc(Users user, LocalDate startDate, LocalDate endDate);

    List<DailySchedule> findByUserOrderByScheduleDateDesc(Users user);
}
