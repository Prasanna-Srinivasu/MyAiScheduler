package com.example.backend.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.dto.PracticeProblemDto;
import com.example.backend.entity.PracticeProblem;
import com.example.backend.entity.UserProgress;
import com.example.backend.repository.PracticeProblemRepository;

@Service
@Transactional
public class PracticeProblemService {

    private final PracticeProblemRepository practiceProblemRepository;
    private final UserProgressService userProgressService;

    public PracticeProblemService(
            PracticeProblemRepository practiceProblemRepository,
            UserProgressService userProgressService) {
        this.practiceProblemRepository = practiceProblemRepository;
        this.userProgressService = userProgressService;
    }

    public List<PracticeProblemDto> getProblemsByPattern(String pattern, Long userId) {
        return getProblems(pattern, null, null, null, null, "EASY_TO_HARD", userId);
    }

    public List<PracticeProblemDto> getProblems(String pattern, String technology, String concept, String method, String difficulty, String sortBy, Long userId) {
        List<PracticeProblem> problems = practiceProblemRepository.findAllAvailableForUser(userId);

        // Filter by technology
        if (technology != null && !technology.isBlank() && !"ALL".equalsIgnoreCase(technology)) {
            problems = problems.stream()
                    .filter(p -> p.getTechnology() != null && technology.equalsIgnoreCase(p.getTechnology()))
                    .collect(Collectors.toList());
        }

        // Filter by concept
        if (concept != null && !concept.isBlank() && !"ALL".equalsIgnoreCase(concept)) {
            problems = problems.stream()
                    .filter(p -> p.getConcept() != null && concept.equalsIgnoreCase(p.getConcept()))
                    .collect(Collectors.toList());
        }

        // Filter by method
        if (method != null && !method.isBlank() && !"ALL".equalsIgnoreCase(method)) {
            problems = problems.stream()
                    .filter(p -> p.getMethod() != null && method.equalsIgnoreCase(p.getMethod()))
                    .collect(Collectors.toList());
        }

        // Filter by pattern
        if (pattern != null && !pattern.isBlank() && !"ALL".equalsIgnoreCase(pattern)) {
            problems = problems.stream()
                    .filter(p -> (p.getPattern() != null && pattern.equalsIgnoreCase(p.getPattern()))
                              || (p.getMethod() != null && pattern.equalsIgnoreCase(p.getMethod())))
                    .collect(Collectors.toList());
        }

        // Filter by difficulty
        if (difficulty != null && !difficulty.isBlank() && !"ALL".equalsIgnoreCase(difficulty)) {
            problems = problems.stream()
                    .filter(p -> p.getDifficulty() != null && difficulty.equalsIgnoreCase(p.getDifficulty()))
                    .collect(Collectors.toList());
        }

        // Sorting
        final String sortOrder = (sortBy != null && !sortBy.isBlank()) ? sortBy.toUpperCase() : "EASY_TO_HARD";
        problems = new ArrayList<>(problems);
        problems.sort((a, b) -> {
            int rankA = getDifficultyRank(a.getDifficulty());
            int rankB = getDifficultyRank(b.getDifficulty());

            if ("HARD_TO_EASY".equals(sortOrder)) {
                int cmp = Integer.compare(rankB, rankA);
                if (cmp != 0) return cmp;
            } else if ("LEETCODE_ASC".equals(sortOrder)) {
                Integer numA = a.getLeetcodeNumber() != null ? a.getLeetcodeNumber() : Integer.MAX_VALUE;
                Integer numB = b.getLeetcodeNumber() != null ? b.getLeetcodeNumber() : Integer.MAX_VALUE;
                int cmp = numA.compareTo(numB);
                if (cmp != 0) return cmp;
            } else if ("TITLE_ASC".equals(sortOrder)) {
                int cmp = a.getTitle().compareToIgnoreCase(b.getTitle());
                if (cmp != 0) return cmp;
            } else {
                // Default: EASY_TO_HARD
                int cmp = Integer.compare(rankA, rankB);
                if (cmp != 0) return cmp;
            }

            // Secondary sort: leetcode number if available, else title
            Integer numA = a.getLeetcodeNumber() != null ? a.getLeetcodeNumber() : 999999;
            Integer numB = b.getLeetcodeNumber() != null ? b.getLeetcodeNumber() : 999999;
            int numCmp = numA.compareTo(numB);
            if (numCmp != 0) return numCmp;
            return a.getTitle().compareToIgnoreCase(b.getTitle());
        });

        List<Long> problemIds = problems.stream().map(PracticeProblem::getId).toList();
        Map<Long, UserProgress> progressMap = (userId != null)
                ? userProgressService.getProgressMap(userId, "PROBLEM", problemIds)
                : Collections.emptyMap();

        return problems.stream().map(p -> {
            PracticeProblemDto dto = new PracticeProblemDto(
                    p.getId(),
                    p.getTopicId(),
                    p.getPattern(),
                    p.getTitle(),
                    p.getLeetcodeNumber(),
                    p.getLeetcodeUrl(),
                    p.getDifficulty(),
                    p.getTechnology(),
                    p.getCompanies(),
                    p.getDescription(),
                    p.getHints(),
                    p.getIsCustom(),
                    p.getConcept(),
                    p.getMethod()
            );
            UserProgress up = progressMap.get(p.getId());
            if (up != null) {
                dto.setUserStatus(up.getStatus());
                dto.setSolutionNotes(up.getSolutionNotes());
            } else {
                dto.setUserStatus("NOT_STARTED");
            }
            return dto;
        }).collect(Collectors.toList());
    }

    private int getDifficultyRank(String diff) {
        if (diff == null) return 2;
        switch (diff.trim().toUpperCase()) {
            case "EASY": return 1;
            case "MEDIUM": return 2;
            case "HARD": return 3;
            default: return 2;
        }
    }

    public Map<String, Object> getPracticeMetadata(Long userId) {
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("technologies", List.of("ALL", "DSA", "Java"));
        metadata.put("concepts", practiceProblemRepository.findAllDistinctConcepts());
        metadata.put("patterns", practiceProblemRepository.findAllDistinctPatterns());
        metadata.put("dsaCount", practiceProblemRepository.countByTechnology("DSA"));
        metadata.put("javaCount", practiceProblemRepository.countByTechnology("Java"));
        metadata.put("totalCount", practiceProblemRepository.count());
        metadata.put("summary", getPatternsSummary(userId));
        return metadata;
    }

    public List<Map<String, Object>> getPatternsSummary(Long userId) {
        List<String> patterns = practiceProblemRepository.findAllDistinctPatterns();
        List<PracticeProblem> allProblems = practiceProblemRepository.findAllAvailableForUser(userId);

        List<Long> allIds = allProblems.stream().map(PracticeProblem::getId).toList();
        Map<Long, UserProgress> progressMap = (userId != null)
                ? userProgressService.getProgressMap(userId, "PROBLEM", allIds)
                : Collections.emptyMap();

        List<Map<String, Object>> list = new ArrayList<>();
        for (String pat : patterns) {
            List<PracticeProblem> group = allProblems.stream()
                    .filter(p -> pat.equalsIgnoreCase(p.getPattern()))
                    .toList();

            long solved = group.stream().filter(p -> {
                UserProgress up = progressMap.get(p.getId());
                return up != null && "SOLVED".equalsIgnoreCase(up.getStatus());
            }).count();

            Map<String, Object> map = new HashMap<>();
            map.put("pattern", pat);
            map.put("totalProblems", group.size());
            map.put("solvedCount", solved);
            map.put("progressPercent", group.size() > 0 ? Math.round(((double) solved / group.size()) * 100) : 0);
            list.add(map);
        }
        return list;
    }

    public PracticeProblem addCustomProblem(String pattern, String title, Integer lcNum, String url, String difficulty, String notes, Long userId) {
        if (title == null || title.isBlank()) {
            throw new RuntimeException("Problem title is required");
        }
        if (pattern == null || pattern.isBlank()) {
            pattern = "General DSA";
        }
        if (difficulty == null || difficulty.isBlank()) {
            difficulty = "Medium";
        }

        PracticeProblem p = new PracticeProblem();
        p.setPattern(pattern.trim());
        p.setTitle(title.trim());
        p.setLeetcodeNumber(lcNum);
        p.setLeetcodeUrl(url != null ? url.trim() : "");
        p.setDifficulty(difficulty.trim());
        p.setTechnology("DSA");
        p.setIsCustom(true);
        p.setCreatedByUserId(userId);
        PracticeProblem saved = practiceProblemRepository.save(p);

        if (notes != null && !notes.isBlank() && userId != null) {
            userProgressService.updateProgress(userId, "PROBLEM", saved.getId(), "IN_PROGRESS", notes);
        }

        return saved;
    }

    public void updateProblemStatus(Long problemId, String status, String solutionNotes, Long userId) {
        userProgressService.updateProgress(userId, "PROBLEM", problemId, status, solutionNotes);
    }

    public Map<String, Object> getDsaStats(Long userId) {
        return userProgressService.getDsaStats(userId);
    }
}
