-- ============================================================
-- AI Developer Life Tracker
-- Part 1 - Core Database Schema
-- Flyway Migration: V1__initial_schema.sql
-- Database: MySQL 8+
-- ============================================================

CREATE DATABASE IF NOT EXISTS ai_scheduler
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE ai_scheduler;


-- ============================================================
-- 1. USERS
-- ============================================================

CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    target_role VARCHAR(150),
    experience_level VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);


-- ============================================================
-- 2. USER PREFERENCES
-- ============================================================

CREATE TABLE user_preferences (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL UNIQUE,

    preferred_study_intensity VARCHAR(50),

    wake_up_time TIME,
    sleep_time TIME,

    notification_enabled BOOLEAN DEFAULT TRUE,
    daily_summary_enabled BOOLEAN DEFAULT TRUE,
    weekly_report_enabled BOOLEAN DEFAULT TRUE,
    mission_reminders_enabled BOOLEAN DEFAULT TRUE,
    revision_reminders_enabled BOOLEAN DEFAULT TRUE,
    news_enabled BOOLEAN DEFAULT TRUE,
    credits_enabled BOOLEAN DEFAULT TRUE,
    knowledge_gap_enabled BOOLEAN DEFAULT TRUE,

    CONSTRAINT fk_preferences_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- ============================================================
-- 3. USER AVAILABILITY
-- ============================================================

CREATE TABLE user_availability (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,

    available_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    available_hours DECIMAL(5,2),

    energy_level VARCHAR(30),
    notes TEXT,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    INDEX idx_availability_user_date (user_id, available_date)
);


-- ============================================================
-- 4. PERSONAL ACTIVITIES
-- ============================================================

CREATE TABLE personal_activities (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,

    activity_date DATE NOT NULL,
    activity_type VARCHAR(50) NOT NULL,

    start_time TIME,
    end_time TIME,

    description VARCHAR(255),

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    INDEX idx_activity_user_date (user_id, activity_date)
);


-- ============================================================
-- 5. TECHNOLOGIES
-- ============================================================

CREATE TABLE technologies (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(100),

    priority VARCHAR(30),
    active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- 6. TECHNOLOGY TOPICS
--
-- Hierarchy:
--
-- Technology
--     ↓
-- TOPIC
--     ↓
-- SUBTOPIC
--     ↓
-- CONCEPT
--
-- parent_topic_id       = hierarchy
-- prerequisite_topic_id = learning dependency
-- level                 = explicit hierarchy level
-- ============================================================

CREATE TABLE technology_topics (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    technology_id BIGINT NOT NULL,

    parent_topic_id BIGINT NULL,
    prerequisite_topic_id BIGINT NULL,

    name VARCHAR(150) NOT NULL,
    description TEXT,

    level VARCHAR(20) NOT NULL,

    estimated_learning_hours DECIMAL(6,2),
    priority VARCHAR(30),

    active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_topic_level
        CHECK (level IN ('TOPIC', 'SUBTOPIC', 'CONCEPT')),

    CONSTRAINT fk_topic_technology
        FOREIGN KEY (technology_id)
        REFERENCES technologies(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_topic_parent
        FOREIGN KEY (parent_topic_id)
        REFERENCES technology_topics(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_topic_prerequisite
        FOREIGN KEY (prerequisite_topic_id)
        REFERENCES technology_topics(id)
        ON DELETE SET NULL,

    INDEX idx_topics_technology (technology_id),
    INDEX idx_topics_parent (parent_topic_id),
    INDEX idx_topics_prerequisite (prerequisite_topic_id),
    INDEX idx_topics_level (level)
);


-- ============================================================
-- 7. CONCEPT LEARNING POINTS
--
-- A CONCEPT can contain multiple structured
-- learning objectives / skills.
--
-- Example:
--
-- ArrayList
--     ├── Explain internal working
--     ├── Explain capacity
--     ├── Explain resizing
--     └── Analyze time complexity
-- ============================================================

CREATE TABLE concept_learning_points (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    concept_id BIGINT NOT NULL,

    title VARCHAR(250) NOT NULL,
    description TEXT,

    learning_objective TEXT,
    expected_skill TEXT,

    difficulty VARCHAR(30),
    importance VARCHAR(30),

    estimated_minutes INT,

    sequence_order INT DEFAULT 1,

    active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_learning_point_concept
        FOREIGN KEY (concept_id)
        REFERENCES technology_topics(id)
        ON DELETE CASCADE,

    INDEX idx_learning_points_concept (concept_id),

    UNIQUE KEY uk_learning_point_order
        (concept_id, sequence_order)
);


-- ============================================================
-- 8. LEARNING GOALS
-- ============================================================

CREATE TABLE learning_goals (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    user_id BIGINT NOT NULL,

    title VARCHAR(200) NOT NULL,
    description TEXT,

    target_role VARCHAR(150),

    deadline DATE NULL,

    flexible_roadmap BOOLEAN DEFAULT FALSE,

    estimated_hours DECIMAL(8,2),

    status VARCHAR(30) DEFAULT 'ACTIVE',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    INDEX idx_goal_user (user_id),
    INDEX idx_goal_status (user_id, status)
);


-- ============================================================
-- 9. ROADMAPS
-- ============================================================

CREATE TABLE roadmaps (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    user_id BIGINT NOT NULL,
    learning_goal_id BIGINT NOT NULL,

    start_date DATE NOT NULL,
    end_date DATE NULL,

    roadmap_type VARCHAR(30),
    status VARCHAR(30) DEFAULT 'ACTIVE',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (learning_goal_id)
        REFERENCES learning_goals(id)
        ON DELETE CASCADE,

    INDEX idx_roadmap_user (user_id),
    INDEX idx_roadmap_goal (learning_goal_id)
);


-- ============================================================
-- 10. ROADMAP ITEMS
-- ============================================================

CREATE TABLE roadmap_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    roadmap_id BIGINT NOT NULL,

    topic_id BIGINT NULL,

    item_type VARCHAR(40),

    title VARCHAR(200) NOT NULL,

    planned_date DATE,

    estimated_minutes INT,

    priority VARCHAR(30),

    status VARCHAR(30) DEFAULT 'PENDING',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (roadmap_id)
        REFERENCES roadmaps(id)
        ON DELETE CASCADE,

    FOREIGN KEY (topic_id)
        REFERENCES technology_topics(id)
        ON DELETE SET NULL,

    INDEX idx_roadmap_items_roadmap (roadmap_id),
    INDEX idx_roadmap_items_topic (topic_id),
    INDEX idx_roadmap_items_date (planned_date)
);


-- ============================================================
-- 11. DAILY SCHEDULES
-- ============================================================

CREATE TABLE daily_schedules (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    user_id BIGINT NOT NULL,

    schedule_date DATE NOT NULL,

    available_minutes INT,
    planned_minutes INT,

    energy_level VARCHAR(30),

    generated_reason TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    UNIQUE KEY uk_daily_schedule
        (user_id, schedule_date)
);


-- ============================================================
-- 12. TASKS
-- ============================================================

CREATE TABLE tasks (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    user_id BIGINT NOT NULL,

    roadmap_item_id BIGINT NULL,
    schedule_id BIGINT NULL,

    title VARCHAR(200) NOT NULL,
    description TEXT,

    task_date DATE NOT NULL,

    estimated_minutes INT,

    completed_at DATETIME NULL,

    status VARCHAR(30) DEFAULT 'PENDING',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (roadmap_item_id)
        REFERENCES roadmap_items(id)
        ON DELETE SET NULL,

    FOREIGN KEY (schedule_id)
        REFERENCES daily_schedules(id)
        ON DELETE SET NULL,

    INDEX idx_tasks_user_date (user_id, task_date),
    INDEX idx_tasks_status (user_id, status)
);


-- ============================================================
-- 13. MISSIONS
-- ============================================================

CREATE TABLE missions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    user_id BIGINT NOT NULL,

    topic_id BIGINT NULL,

    title VARCHAR(200) NOT NULL,
    description TEXT,

    base_credits INT NOT NULL DEFAULT 0,

    due_date DATE,

    status VARCHAR(30) DEFAULT 'PENDING',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (topic_id)
        REFERENCES technology_topics(id)
        ON DELETE SET NULL,

    INDEX idx_missions_user (user_id),
    INDEX idx_missions_due_date (user_id, due_date),
    INDEX idx_missions_status (user_id, status)
);


-- ============================================================
-- 14. MISSION ATTEMPTS
-- ============================================================

CREATE TABLE mission_attempts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    mission_id BIGINT NOT NULL,

    attempt_number INT NOT NULL,

    approach_text TEXT,

    started_at DATETIME,
    completed_at DATETIME,

    status VARCHAR(30),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (mission_id)
        REFERENCES missions(id)
        ON DELETE CASCADE,

    UNIQUE KEY uk_mission_attempt
        (mission_id, attempt_number)
);


-- ============================================================
-- 15. MISSION QUESTIONS
-- ============================================================

CREATE TABLE mission_questions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    mission_id BIGINT NOT NULL,

    question_order INT NOT NULL,

    question_text TEXT NOT NULL,

    question_type VARCHAR(40),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (mission_id)
        REFERENCES missions(id)
        ON DELETE CASCADE,

    UNIQUE KEY uk_mission_question_order
        (mission_id, question_order)
);


-- ============================================================
-- 16. MISSION ANSWERS
-- ============================================================

CREATE TABLE mission_answers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    question_id BIGINT NOT NULL,
    attempt_id BIGINT NOT NULL,

    answer_text TEXT,

    answer_source VARCHAR(20),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (question_id)
        REFERENCES mission_questions(id)
        ON DELETE CASCADE,

    FOREIGN KEY (attempt_id)
        REFERENCES mission_attempts(id)
        ON DELETE CASCADE,

    INDEX idx_answers_attempt (attempt_id),
    INDEX idx_answers_question (question_id)
);


-- ============================================================
-- 17. EVALUATIONS
-- ============================================================

CREATE TABLE evaluations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    attempt_id BIGINT NOT NULL,

    concept_score DECIMAL(5,2),
    coding_score DECIMAL(5,2),
    problem_solving_score DECIMAL(5,2),
    explanation_score DECIMAL(5,2),
    overall_score DECIMAL(5,2),

    feedback TEXT,

    evaluated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (attempt_id)
        REFERENCES mission_attempts(id)
        ON DELETE CASCADE,

    INDEX idx_evaluation_attempt (attempt_id)
);


-- ============================================================
-- 18. KNOWLEDGE GAPS
-- ============================================================

CREATE TABLE knowledge_gaps (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    user_id BIGINT NOT NULL,

    topic_id BIGINT NULL,

    title VARCHAR(200) NOT NULL,
    description TEXT,

    severity VARCHAR(30),

    status VARCHAR(30) DEFAULT 'OPEN',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    resolved_at TIMESTAMP NULL,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (topic_id)
        REFERENCES technology_topics(id)
        ON DELETE SET NULL,

    INDEX idx_knowledge_gap_user_status
        (user_id, status),

    INDEX idx_knowledge_gap_topic
        (topic_id)
);


-- ============================================================
-- 19. RESOURCES
-- ============================================================

CREATE TABLE resources (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    knowledge_gap_id BIGINT NULL,

    title VARCHAR(250) NOT NULL,

    resource_type VARCHAR(50),

    url VARCHAR(500),

    description TEXT,

    estimated_minutes INT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (knowledge_gap_id)
        REFERENCES knowledge_gaps(id)
        ON DELETE CASCADE
);


-- ============================================================
-- 20. REVISIONS
-- ============================================================

CREATE TABLE revisions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    user_id BIGINT NOT NULL,

    topic_id BIGINT NOT NULL,

    revision_number INT NOT NULL,

    revision_type VARCHAR(50) NOT NULL,

    scheduled_date DATE,

    status VARCHAR(30) DEFAULT 'PENDING',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (topic_id)
        REFERENCES technology_topics(id)
        ON DELETE CASCADE,

    INDEX idx_revision_user_date
        (user_id, scheduled_date),

    INDEX idx_revision_topic
        (topic_id)
);


-- ============================================================
-- 21. REVISION ATTEMPTS
-- ============================================================

CREATE TABLE revision_attempts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    revision_id BIGINT NOT NULL,

    score DECIMAL(5,2),

    response_text TEXT,

    feedback TEXT,

    completed_at DATETIME,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (revision_id)
        REFERENCES revisions(id)
        ON DELETE CASCADE
);


-- ============================================================
-- 22. CONCEPT MASTERY
-- ============================================================

CREATE TABLE mastery_scores (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    user_id BIGINT NOT NULL,

    topic_id BIGINT NOT NULL,

    concept_score DECIMAL(5,2) DEFAULT 0,
    coding_score DECIMAL(5,2) DEFAULT 0,
    problem_solving_score DECIMAL(5,2) DEFAULT 0,
    explanation_score DECIMAL(5,2) DEFAULT 0,
    revision_score DECIMAL(5,2) DEFAULT 0,

    overall_score DECIMAL(5,2) DEFAULT 0,

    status VARCHAR(30) DEFAULT 'WEAK',

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY uk_user_topic_mastery
        (user_id, topic_id),

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (topic_id)
        REFERENCES technology_topics(id)
        ON DELETE CASCADE
);


-- ============================================================
-- 23. USER LEARNING POINT PROGRESS
--
-- Current state of a learner for each learning point.
-- ============================================================

CREATE TABLE user_learning_point_progress (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    user_id BIGINT NOT NULL,

    learning_point_id BIGINT NOT NULL,

    mastery_score DECIMAL(5,2) DEFAULT 0,

    status VARCHAR(30) DEFAULT 'NOT_STARTED',

    attempt_count INT DEFAULT 0,

    correct_attempt_count INT DEFAULT 0,

    incorrect_attempt_count INT DEFAULT 0,

    confidence_level VARCHAR(30),

    difficulty_experienced VARCHAR(30),

    last_attempted_at DATETIME NULL,

    last_evaluated_at DATETIME NULL,

    next_revision_date DATE NULL,

    first_mastered_at DATETIME NULL,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (learning_point_id)
        REFERENCES concept_learning_points(id)
        ON DELETE CASCADE,

    UNIQUE KEY uk_user_learning_point
        (user_id, learning_point_id),

    INDEX idx_learning_progress_user
        (user_id),

    INDEX idx_learning_progress_revision
        (user_id, next_revision_date),

    INDEX idx_learning_progress_status
        (user_id, status)
);


-- ============================================================
-- 24. USER LEARNING POINT PROGRESS HISTORY
--
-- Historical snapshots of learning progress.
-- This allows the AI to understand improvement,
-- regression, forgetting and learning trends.
-- ============================================================

CREATE TABLE user_learning_point_progress_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    user_id BIGINT NOT NULL,

    learning_point_id BIGINT NOT NULL,

    progress_id BIGINT NULL,

    mastery_score DECIMAL(5,2) DEFAULT 0,

    status VARCHAR(30),

    attempt_count INT DEFAULT 0,

    correct_attempt_count INT DEFAULT 0,

    incorrect_attempt_count INT DEFAULT 0,

    confidence_level VARCHAR(30),

    difficulty_experienced VARCHAR(30),

    evaluation_reason VARCHAR(100),

    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (learning_point_id)
        REFERENCES concept_learning_points(id)
        ON DELETE CASCADE,

    FOREIGN KEY (progress_id)
        REFERENCES user_learning_point_progress(id)
        ON DELETE SET NULL,

    INDEX idx_progress_history_user
        (user_id, recorded_at),

    INDEX idx_progress_history_learning_point
        (learning_point_id, recorded_at)
);


-- ============================================================
-- 25. CREDITS
-- ============================================================

CREATE TABLE credits (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    user_id BIGINT NOT NULL UNIQUE,

    total_credits INT DEFAULT 0,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- ============================================================
-- 26. CREDIT TRANSACTIONS
-- ============================================================

CREATE TABLE credit_transactions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    user_id BIGINT NOT NULL,

    mission_id BIGINT NULL,

    amount INT NOT NULL,

    reason VARCHAR(255),

    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (mission_id)
        REFERENCES missions(id)
        ON DELETE SET NULL,

    INDEX idx_credit_transactions_user
        (user_id, transaction_date)
);


-- ============================================================
-- 27. NOTES
-- ============================================================

CREATE TABLE notes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    user_id BIGINT NOT NULL,

    topic_id BIGINT NULL,

    title VARCHAR(250) NOT NULL,

    content LONGTEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (topic_id)
        REFERENCES technology_topics(id)
        ON DELETE SET NULL
);


-- ============================================================
-- 28. HIGHLIGHTS
-- ============================================================

CREATE TABLE highlights (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    user_id BIGINT NOT NULL,

    topic_id BIGINT NULL,

    title VARCHAR(250),

    content LONGTEXT,

    source_type VARCHAR(50),

    source_reference VARCHAR(500),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (topic_id)
        REFERENCES technology_topics(id)
        ON DELETE SET NULL
);


-- ============================================================
-- 29. NEWS
-- ============================================================

CREATE TABLE news (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    technology_id BIGINT NULL,

    title VARCHAR(300) NOT NULL,

    source_name VARCHAR(150),

    source_url VARCHAR(500),

    published_at DATETIME,

    summary TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (technology_id)
        REFERENCES technologies(id)
        ON DELETE SET NULL,

    INDEX idx_news_technology
        (technology_id),

    INDEX idx_news_published
        (published_at)
);


-- ============================================================
-- 30. NEWS ANALYSIS
-- ============================================================

CREATE TABLE news_analysis (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    news_id BIGINT NOT NULL,

    importance_score DECIMAL(5,2),
    relevance_score DECIMAL(5,2),

    what_happened TEXT,
    why_it_matters TEXT,
    who_should_care TEXT,
    what_to_learn TEXT,
    short_notes TEXT,

    reading_time_minutes INT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (news_id)
        REFERENCES news(id)
        ON DELETE CASCADE,

    UNIQUE KEY uk_news_analysis
        (news_id)
);


-- ============================================================
-- 31. NOTIFICATIONS
-- ============================================================

CREATE TABLE notifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    user_id BIGINT NOT NULL,

    category VARCHAR(50) NOT NULL,

    title VARCHAR(250) NOT NULL,

    message TEXT,

    channel VARCHAR(30),

    is_read BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    INDEX idx_notifications_user_read
        (user_id, is_read),

    INDEX idx_notifications_user_date
        (user_id, created_at)
);


-- ============================================================
-- 32. WEB PUSH SUBSCRIPTIONS
-- ============================================================

CREATE TABLE web_push_subscriptions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    user_id BIGINT NOT NULL,

    endpoint TEXT NOT NULL,

    p256dh TEXT NOT NULL,

    auth TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    INDEX idx_push_user
        (user_id)
);


-- ============================================================
-- 33. TELEGRAM CONNECTIONS
-- ============================================================

CREATE TABLE telegram_connections (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    user_id BIGINT NOT NULL UNIQUE,

    telegram_chat_id VARCHAR(100),

    connected BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- ============================================================
-- 34. ANALYTICS
-- ============================================================

CREATE TABLE analytics (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    user_id BIGINT NOT NULL,

    period_type VARCHAR(30),

    period_start DATE,
    period_end DATE,

    study_minutes INT DEFAULT 0,

    task_count INT DEFAULT 0,

    completed_task_count INT DEFAULT 0,

    revision_count INT DEFAULT 0,

    average_score DECIMAL(5,2),

    credits_earned INT DEFAULT 0,

    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    INDEX idx_analytics_user_period
        (user_id, period_type, period_start)
);