package com.example.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.backend.entity.UserProgress;

@Repository
public interface UserProgressRepository extends JpaRepository<UserProgress, Long> {

    List<UserProgress> findByUserIdAndItemType(Long userId, String itemType);

    Optional<UserProgress> findByUserIdAndItemTypeAndItemId(Long userId, String itemType, Long itemId);

    @Query("SELECT up FROM UserProgress up WHERE up.userId = :userId AND up.itemType = :itemType AND up.itemId IN :itemIds")
    List<UserProgress> findByUserIdAndItemTypeAndItemIdIn(
            @Param("userId") Long userId,
            @Param("itemType") String itemType,
            @Param("itemIds") List<Long> itemIds);

    long countByUserIdAndItemTypeAndStatus(Long userId, String itemType, String status);

    @Query("SELECT COUNT(up) FROM UserProgress up WHERE up.userId = :userId AND up.itemType = 'PROBLEM' AND up.status = 'SOLVED'")
    long countSolvedProblemsForUser(@Param("userId") Long userId);
}
