package com.example.backend.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Random;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.dto.AiChatRequest;
import com.example.backend.dto.AiChatResponse;
import com.example.backend.dto.AiScheduleRequest;
import com.example.backend.dto.AiScheduleResponse;
import com.example.backend.dto.TaskDto;
import com.example.backend.dto.TaskRequest;
import com.example.backend.entity.Users;

@Service
@Transactional
public class AiSchedulerService {

    private final TaskService taskService;
    private final ScheduleService scheduleService;
    private final NotificationService notificationService;

    public AiSchedulerService(TaskService taskService, ScheduleService scheduleService, NotificationService notificationService) {
        this.taskService = taskService;
        this.scheduleService = scheduleService;
        this.notificationService = notificationService;
    }

    public AiScheduleResponse generateSchedule(AiScheduleRequest request, Users user) {
        LocalDate date = request.getScheduleDate() != null ? request.getScheduleDate() : LocalDate.now();
        int availableHours = request.getAvailableHours() != null && request.getAvailableHours() > 0 ? request.getAvailableHours() : 4;
        int totalAvailableMinutes = availableHours * 60;
        String energy = request.getEnergyLevel() != null ? request.getEnergyLevel().toUpperCase() : "MEDIUM";
        String role = (request.getTargetRole() != null && !request.getTargetRole().isBlank()) 
                ? request.getTargetRole() 
                : (user.getTargetRole() != null ? user.getTargetRole() : "Full Stack Developer");
        String level = (request.getExperienceLevel() != null && !request.getExperienceLevel().isBlank()) 
                ? request.getExperienceLevel() 
                : (user.getExperienceLevel() != null ? user.getExperienceLevel() : "Intermediate");

        List<TaskRequest> generatedTaskRequests = planTasksByAi(role, level, energy, totalAvailableMinutes, request.getUserPrompt(), request.getFocusAreas());

        List<TaskDto> savedTasks = new ArrayList<>();
        int plannedMinutes = 0;

        for (TaskRequest tr : generatedTaskRequests) {
            tr.setTaskDate(date);
            plannedMinutes += tr.getEstimatedMinutes() != null ? tr.getEstimatedMinutes() : 45;
            if (Boolean.TRUE.equals(request.getAutoSaveTasks())) {
                TaskDto saved = taskService.createTask(tr, user);
                savedTasks.add(saved);
            } else {
                TaskDto temp = new TaskDto();
                temp.setTitle(tr.getTitle());
                temp.setDescription(tr.getDescription());
                temp.setTaskDate(date);
                temp.setEstimatedMinutes(tr.getEstimatedMinutes());
                temp.setPriority(tr.getPriority());
                temp.setCategory(tr.getCategory());
                temp.setStatus("PENDING");
                savedTasks.add(temp);
            }
        }

        String reason = String.format("AI generated optimized %s plan for %s (%s energy level) covering %d minutes.",
                level, role, energy, plannedMinutes);

        if (Boolean.TRUE.equals(request.getAutoSaveTasks())) {
            scheduleService.saveDailySchedule(user, date, totalAvailableMinutes, plannedMinutes, energy, reason);
            notificationService.createNotification(
                    user,
                    "AI_INSIGHT",
                    "New AI Schedule Ready!",
                    String.format("Generated %d tasks (%d mins) for %s based on your %s energy level.",
                            savedTasks.size(), plannedMinutes, date, energy)
            );
        }

        AiScheduleResponse response = new AiScheduleResponse();
        response.setScheduleDate(date);
        response.setAvailableMinutes(totalAvailableMinutes);
        response.setPlannedMinutes(plannedMinutes);
        response.setEnergyLevel(energy);
        response.setGeneratedReason(reason);
        response.setSuggestedTasks(savedTasks);
        response.setSummary(String.format("Tailored schedule for %s with %d tasks planned across %d minutes.", role, savedTasks.size(), plannedMinutes));
        response.setTips(getAiTipsForEnergy(energy));
        response.setMotivationalQuote(getRandomMotivationalQuote());

        return response;
    }

    public AiChatResponse chat(AiChatRequest request, Users user) {
        String msg = request.getMessage() != null ? request.getMessage().trim() : "";
        String topic = request.getTopic() != null ? request.getTopic().trim() : "";
        String action = request.getAction() != null ? request.getAction().toUpperCase() : "GENERAL";
        String lower = (msg + " " + topic).toLowerCase();

        AiChatResponse response = new AiChatResponse();
        response.setTopic(topic.isBlank() ? "Full Stack Engineering" : topic);

        if ("QUIZ".equals(action)) {
            buildQuizResponse(topic, response);
            return response;
        } else if ("CHALLENGE".equals(action)) {
            buildChallengeResponse(topic, response);
            return response;
        } else if ("INTERVIEW".equals(action)) {
            buildInterviewResponse(topic, response);
            return response;
        } else if ("NEXT_STEPS".equals(action)) {
            buildNextStepsResponse(topic, response);
            return response;
        } else if ("EXPLAIN".equals(action) || (!topic.isBlank() && (msg.isBlank() || msg.equalsIgnoreCase("explain")))) {
            buildExplainResponse(topic, response);
            return response;
        }

        // Custom conversational replies based on context
        if (lower.contains("schedule") || lower.contains("plan") || lower.contains("routine")) {
            response.setReply("### 📅 AI Study Routine Recommendation\n\nI recommend structuring your sessions using the **50/10 Pomodoro Rhythm**:\n* **50 mins:** Deep deliberate practice on core topics (DSA or Backend implementation)\n* **10 mins:** Active recall / documentation summary\n\nFor your role (**" 
                    + (user != null && user.getTargetRole() != null ? user.getTargetRole() : "Developer") + "**), schedule complex architectural problems in the morning and hands-on coding in the afternoon.");
            response.setSuggestions(Arrays.asList("Generate today's schedule", "Show my pending tasks", "Tips for high energy productivity"));
        } else if (lower.contains("react") || lower.contains("frontend") || lower.contains("hook")) {
            response.setReply("### ⚛️ Modern React 19 Best Practices\n\nKey areas to master:\n1. **React 19 Actions & Server Functions:** Handle form mutations smoothly without manual `useState` boolean flags.\n2. **Custom Hooks & Composition:** Separate business logic from rendering components.\n3. **Performance Optimization:** Use `useMemo`, `useCallback`, and component colocation to avoid redundant re-renders.\n4. **Styling Architecture:** Modern responsive styling using Tailwind CSS or CSS variables.\n\n```jsx\n// Example: Custom useFetch Hook with AbortController\nfunction useFetch(url) {\n  const [data, setData] = useState(null);\n  useEffect(() => {\n    const controller = new AbortController();\n    fetch(url, { signal: controller.signal })\n      .then(res => res.json())\n      .then(setData);\n    return () => controller.abort();\n  }, [url]);\n  return data;\n}\n```");
            response.setSuggestions(Arrays.asList("Hands-on React challenge", "React interview questions", "Quiz me on React Hooks"));
        } else if (lower.contains("java") || lower.contains("spring") || lower.contains("boot")) {
            response.setReply("### ☕ Java & Spring Boot Architecture\n\nCore pillars for production Java backend engineering:\n1. **Spring Boot 3/4 & Java 17/21:** Virtual Threads (Project Loom) for lightweight high-throughput concurrency.\n2. **Stateless Security:** SecurityFilterChain with JWT tokens, CORS policy, and password hashing.\n3. **Spring Data JPA & Hibernate:** Prevent N+1 query bottlenecks using `@EntityGraph` and JOIN FETCH queries.\n4. **Clean Layered Architecture:** Controller -> Service -> Repository with strict DTO boundaries.\n\n```java\n@RestController\n@RequestMapping(\"/api/orders\")\npublic class OrderController {\n    private final OrderService orderService;\n    public OrderController(OrderService orderService) { this.orderService = orderService; }\n\n    @PostMapping\n    public ResponseEntity<OrderDto> create(@Valid @RequestBody OrderRequest req) {\n        return ResponseEntity.ok(orderService.createOrder(req));\n    }\n}\n```");
            response.setSuggestions(Arrays.asList("Spring Boot interview questions", "Hands-on Spring challenge", "Quiz me on Spring JPA"));
        } else if (lower.contains("dsa") || lower.contains("algorithm") || lower.contains("leetcode") || lower.contains("pointer") || lower.contains("tree")) {
            response.setReply("### 🧠 Data Structures & Algorithms Roadmap\n\nMastering interview patterns over memorizing solutions:\n* **Two Pointers & Sliding Window:** Perfect for linear arrays and contiguous subarray constraints.\n* **Binary Search on Answer:** Applying monotonicity to find optimal thresholds in $O(\\log n)$.\n* **Graphs (BFS / DFS):** Cycle detection, topological sort (Kahn's algorithm), and shortest path algorithms.\n* **Dynamic Programming:** Identify state recurrence relations: $dp[i] = \\max(dp[i-1], dp[i-2] + val)$.\n\nCheck out the **LeetCode Practice Playground** (`/practice`) with 110 seeded problems across 11 core models!");
            response.setSuggestions(Arrays.asList("Solve Arrays & Hashing #1", "Two Pointers problem set", "Quiz me on Time Complexity"));
        } else if (!topic.isBlank()) {
            buildExplainResponse(topic, response);
        } else {
            response.setReply("### 🤖 Roadmap AI Tutor Ready\n\nHello! I am your **AI Roadmap Tutor & Mentor**, inspired by roadmap.sh. I can guide you through every role-based and skill-based roadmap:\n* Select any topic in the roadmap flowchart to inspect concepts and get code walkthroughs.\n* Request hands-on coding challenges or top interview questions.\n* Test your retention with interactive quizzes!\n* Schedule topics directly into your daily study missions.");
            response.setSuggestions(Arrays.asList("Explain Full Stack Developer path", "Show Core Java roadmap", "Quiz me on System Design"));
        }

        return response;
    }

    private void buildExplainResponse(String topic, AiChatResponse resp) {
        resp.setReply("### 📚 Comprehensive Guide: " + topic + "\n\n" +
                "**What is it?**\n" +
                topic + " is a foundational pillar in modern developer stacks. Mastering it gives you the ability to build robust, scalable applications.\n\n" +
                "**Core Principles:**\n" +
                "1. **Architectural Role:** Fits squarely into production workflows to handle data flow and component decoupling.\n" +
                "2. **Production Best Practices:** Always implement defensive input validation, proper error boundaries, and telemetry.\n" +
                "3. **Industry Standard:** Widely expected in 3-year professional engineering interviews.\n\n" +
                "**Practical Implementation Tip:**\n" +
                "When implementing " + topic + ", always write automated unit tests and verify edge cases before deploying to production.");
        resp.setSuggestions(Arrays.asList("Hands-on " + topic + " challenge", "Top " + topic + " interview questions", "Quiz me on " + topic, "Add " + topic + " to AI Schedule"));
    }

    private void buildChallengeResponse(String topic, AiChatResponse resp) {
        resp.setReply("### 🎯 Hands-on Coding Challenge: " + topic + "\n\n" +
                "**Project Goal:**\n" +
                "Build a mini production-ready service or component demonstrating mastery of **" + topic + "**.\n\n" +
                "**Requirements:**\n" +
                "1. Implement core business logic with clean separation of concerns.\n" +
                "2. Include error handling for invalid user inputs and edge cases.\n" +
                "3. Write at least 2 unit tests verifying expected behavior.\n" +
                "4. Add comprehensive README documentation explaining your design choices.\n\n" +
                "**Bonus Stretch:**\n" +
                "Containerize your project with Docker and configure a CI pipeline.");
        resp.setSuggestions(Arrays.asList("Explain " + topic + " concepts", "Quiz me on " + topic, "Add to AI Study Schedule"));
    }

    private void buildInterviewResponse(String topic, AiChatResponse resp) {
        resp.setReply("### 💼 Top Interview Q&A: " + topic + "\n\n" +
                "**Q1: What are the primary trade-offs of using " + topic + " in production?**\n" +
                "*Answer:* Discuss maintainability, throughput, memory footprint, and horizontal scalability vs architectural complexity.\n\n" +
                "**Q2: How do you troubleshoot performance bottlenecks in " + topic + "?**\n" +
                "*Answer:* Profile memory and CPU utilization, inspect slow query/network logs, and apply caching or indexing where appropriate.\n\n" +
                "**Q3: Describe a real-world edge case you encountered with " + topic + " and how you resolved it.**\n" +
                "*Answer:* Highlight idempotency, thread-safety, or concurrency locks, showing deep technical understanding.");
        resp.setSuggestions(Arrays.asList("Explain " + topic + " in simple terms", "Quiz me on " + topic, "Coding Challenge"));
    }

    private void buildNextStepsResponse(String topic, AiChatResponse resp) {
        resp.setReply("### 🚀 Next Steps After Mastering: " + topic + "\n\n" +
                "Once you are comfortable with " + topic + ", your immediate next milestones are:\n" +
                "1. **Deepen Database & Data Access:** Master connection pooling and transaction isolation.\n" +
                "2. **Microservices & Messaging:** Integrate asynchronous event brokers like Apache Kafka or RabbitMQ.\n" +
                "3. **Observability & Cloud:** Deploy to AWS using Docker containers and set up metrics monitoring.");
        resp.setSuggestions(Arrays.asList("Schedule next study block", "Quiz me on " + topic, "Explain " + topic));
    }

    private void buildQuizResponse(String topic, AiChatResponse resp) {
        resp.setReply("### 📝 Quick Knowledge Check: " + topic + "\n\nTest your understanding of " + topic + " with the question below:");
        resp.setQuizQuestion("Which of the following is considered a primary best practice when designing a production system using " + topic + "?");
        resp.setQuizOptions(Arrays.asList(
                "A) Hardcoding credentials directly in application source files",
                "B) Implementing proper exception handling, logging, and input validation",
                "C) Disabling all timeouts to prevent connection cancellations",
                "D) Storing all state in memory without persistence backups"
        ));
        resp.setCorrectOptionIndex(1); // Option B is correct
        resp.setQuizExplanation("Option B is correct. Production systems require robust error boundaries, structured logging for observability, and thorough validation of all inbound payloads.");
        resp.setSuggestions(Arrays.asList("Another Quiz question", "Explain " + topic, "Coding Challenge"));
    }

    private List<TaskRequest> planTasksByAi(String role, String level, String energy, int availableMinutes, String prompt, List<String> focusAreas) {
        List<TaskRequest> tasks = new ArrayList<>();
        int remainingMins = availableMinutes;

        // Customize based on prompt or role
        if (prompt != null && !prompt.isBlank()) {
            TaskRequest customTask = new TaskRequest();
            customTask.setTitle("Focus: " + prompt);
            customTask.setDescription("Dedicated deep work on requested goal: " + prompt);
            int duration = Math.min(60, Math.max(30, remainingMins / 2));
            customTask.setEstimatedMinutes(duration);
            customTask.setPriority("HIGH");
            customTask.setCategory("CODING");
            tasks.add(customTask);
            remainingMins -= duration;
        }

        if (focusAreas != null) {
            for (String area : focusAreas) {
                if (remainingMins < 30) break;
                TaskRequest areaTask = new TaskRequest();
                areaTask.setTitle("Deep Dive: " + area);
                areaTask.setDescription("Hands-on implementation and concept mastering for " + area);
                int duration = Math.min(45, remainingMins);
                areaTask.setEstimatedMinutes(duration);
                areaTask.setPriority("HIGH");
                areaTask.setCategory("STUDY");
                tasks.add(areaTask);
                remainingMins -= duration;
            }
        }

        // Standard role template blocks
        if (remainingMins >= 45) {
            TaskRequest t1 = new TaskRequest();
            t1.setTitle(getCoreCodingTitle(role, level));
            t1.setDescription("Active problem solving and coding practice aligned with " + role);
            int d1 = energy.equals("HIGH") ? 60 : 45;
            d1 = Math.min(d1, remainingMins);
            t1.setEstimatedMinutes(d1);
            t1.setPriority("HIGH");
            t1.setCategory("CODING");
            tasks.add(t1);
            remainingMins -= d1;
        }

        if (remainingMins >= 30) {
            TaskRequest t2 = new TaskRequest();
            t2.setTitle(getConceptReviewTitle(role));
            t2.setDescription("Theoretical concept reinforcement and architecture understanding");
            int d2 = Math.min(30, remainingMins);
            t2.setEstimatedMinutes(d2);
            t2.setPriority("MEDIUM");
            t2.setCategory("STUDY");
            tasks.add(t2);
            remainingMins -= d2;
        }

        if (remainingMins >= 20) {
            TaskRequest t3 = new TaskRequest();
            t3.setTitle("Daily Revision & Retrospective");
            t3.setDescription("Review completed work, commit code to git, and record knowledge gaps");
            t3.setEstimatedMinutes(Math.min(20, remainingMins));
            t3.setPriority("LOW");
            t3.setCategory("REVISION");
            tasks.add(t3);
            remainingMins -= t3.getEstimatedMinutes();
        }

        return tasks;
    }

    private String getCoreCodingTitle(String role, String level) {
        if (role.toLowerCase().contains("frontend") || role.toLowerCase().contains("react")) {
            return "Implement Responsive UI Components & State Hooks";
        } else if (role.toLowerCase().contains("backend") || role.toLowerCase().contains("java")) {
            return "Build & Test REST APIs with Spring Boot & Database Service";
        } else if (role.toLowerCase().contains("ai") || role.toLowerCase().contains("data")) {
            return "Develop AI Pipeline & Prompt Integration Engine";
        }
        return "Full Stack Feature Integration: Frontend UI to Backend Service";
    }

    private String getConceptReviewTitle(String role) {
        if (role.toLowerCase().contains("frontend")) {
            return "Review React Virtual DOM, Hooks Lifecycle, and CSS Grid";
        } else if (role.toLowerCase().contains("backend")) {
            return "Review Database Indexing, Transactions, and JWT Security Flow";
        }
        return "System Design Patterns & API Architecture Review";
    }

    private List<String> getAiTipsForEnergy(String energy) {
        if ("HIGH".equalsIgnoreCase(energy)) {
            return Arrays.asList(
                    "High energy mode active: Tackle your most difficult algorithmic or architectural challenges first.",
                    "Block all social notifications during your core 60-minute coding sprint.",
                    "Keep water at your desk and take a short stretch between blocks."
            );
        } else if ("LOW".equalsIgnoreCase(energy)) {
            return Arrays.asList(
                    "Low energy mode active: Avoid heavy debugging and focus on conceptual reading or tutorial walk-throughs.",
                    "Use 25-minute Pomodoro sessions with frequent rests to avoid cognitive fatigue.",
                    "Prioritize quality over volume — even 30 minutes of consistent review preserves momentum."
            );
        }
        return Arrays.asList(
                "Moderate pace: Balance one hands-on coding task with one concept review session.",
                "Take a 10-minute walk between deep work sessions to refresh focus.",
                "Log your questions as you study to convert them into future revision topics."
        );
    }

    private String getRandomMotivationalQuote() {
        String[] quotes = {
                "Small daily disciplines repeated consistently lead to exponential mastery.",
                "The secret of getting ahead is getting started.",
                "Focus on progress, not perfection. Every line of code written is a step forward.",
                "Mastery is not an accident; it is the natural consequence of intentional practice.",
                "Energy flows where attention goes. Make today count!"
        };
        return quotes[new Random().nextInt(quotes.length)];
    }
}
