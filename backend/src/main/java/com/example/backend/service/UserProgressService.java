package com.example.backend.service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.entity.PracticeProblem;
import com.example.backend.entity.UserProgress;
import com.example.backend.repository.PracticeProblemRepository;
import com.example.backend.repository.UserProgressRepository;

@Service
@Transactional
public class UserProgressService {

    private final UserProgressRepository userProgressRepository;
    private final PracticeProblemRepository practiceProblemRepository;

    public UserProgressService(UserProgressRepository userProgressRepository, PracticeProblemRepository practiceProblemRepository) {
        this.userProgressRepository = userProgressRepository;
        this.practiceProblemRepository = practiceProblemRepository;
    }

    public UserProgress getOrCreateProgress(Long userId, String itemType, Long itemId) {
        return userProgressRepository.findByUserIdAndItemTypeAndItemId(userId, itemType, itemId)
                .orElseGet(() -> {
                    UserProgress up = new UserProgress(userId, itemType, itemId, "NOT_STARTED");
                    return userProgressRepository.save(up);
                });
    }

    public UserProgress updateProgress(Long userId, String itemType, Long itemId, String status, String solutionNotes) {
        UserProgress up = userProgressRepository.findByUserIdAndItemTypeAndItemId(userId, itemType, itemId)
                .orElseGet(() -> new UserProgress(userId, itemType, itemId, "NOT_STARTED"));

        if (status != null && !status.isBlank()) {
            up.setStatus(status.toUpperCase().trim());
            if ("SOLVED".equalsIgnoreCase(status) || "COMPLETED".equalsIgnoreCase(status)) {
                up.setCompletedAt(LocalDateTime.now());
            }
        }

        if (solutionNotes != null) {
            up.setSolutionNotes(solutionNotes);
        }

        if ("NEEDS_REVISION".equalsIgnoreCase(status)) {
            up.setRevisionCount(up.getRevisionCount() + 1);
        }

        up.setLastStudiedAt(LocalDateTime.now());
        return userProgressRepository.save(up);
    }

    public Map<Long, UserProgress> getProgressMap(Long userId, String itemType, List<Long> itemIds) {
        if (itemIds == null || itemIds.isEmpty()) {
            return Collections.emptyMap();
        }
        List<UserProgress> list = userProgressRepository.findByUserIdAndItemTypeAndItemIdIn(userId, itemType, itemIds);
        return list.stream().collect(Collectors.toMap(UserProgress::getItemId, p -> p));
    }

    public Map<String, Object> getDsaStats(Long userId) {
        List<PracticeProblem> allProblems = practiceProblemRepository.findAll();
        List<UserProgress> userProgressList = userProgressRepository.findByUserIdAndItemType(userId, "PROBLEM");
        Map<Long, UserProgress> progressMap = userProgressList.stream()
                .collect(Collectors.toMap(UserProgress::getItemId, p -> p, (a, b) -> a));

        int totalCount = allProblems.size();
        int solvedCount = 0;
        int inProgressCount = 0;
        int needsRevisionCount = 0;
        int easySolved = 0;
        int mediumSolved = 0;
        int hardSolved = 0;
        int easyTotal = 0;
        int mediumTotal = 0;
        int hardTotal = 0;

        for (PracticeProblem p : allProblems) {
            String diff = p.getDifficulty() != null ? p.getDifficulty().toUpperCase() : "MEDIUM";
            if (diff.contains("EASY")) easyTotal++;
            else if (diff.contains("HARD")) hardTotal++;
            else mediumTotal++;

            UserProgress up = progressMap.get(p.getId());
            if (up != null) {
                if ("SOLVED".equalsIgnoreCase(up.getStatus())) {
                    solvedCount++;
                    if (diff.contains("EASY")) easySolved++;
                    else if (diff.contains("HARD")) hardSolved++;
                    else mediumSolved++;
                } else if ("IN_PROGRESS".equalsIgnoreCase(up.getStatus())) {
                    inProgressCount++;
                } else if ("NEEDS_REVISION".equalsIgnoreCase(up.getStatus())) {
                    needsRevisionCount++;
                }
            }
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProblems", totalCount);
        stats.put("solvedCount", solvedCount);
        stats.put("inProgressCount", inProgressCount);
        stats.put("needsRevisionCount", needsRevisionCount);
        stats.put("easySolved", easySolved);
        stats.put("easyTotal", easyTotal);
        stats.put("mediumSolved", mediumSolved);
        stats.put("mediumTotal", mediumTotal);
        stats.put("hardSolved", hardSolved);
        stats.put("hardTotal", hardTotal);
        stats.put("completionRate", totalCount > 0 ? Math.round(((double) solvedCount / totalCount) * 100) : 0);
        return stats;
    }
}
