package com.example.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.entity.Notification;
import com.example.backend.entity.Users;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUserOrderByCreatedAtDesc(Users user);

    List<Notification> findByUserAndIsReadFalseOrderByCreatedAtDesc(Users user);

    Optional<Notification> findByIdAndUser(Long id, Users user);

    long countByUserAndIsReadFalse(Users user);
}
