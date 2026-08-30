-- =========================================================
-- IELTS BETA DATABASE
-- Supabase PostgreSQL
-- =========================================================

-- =========================================================
-- 1. PERSON
-- =========================================================
CREATE TABLE person (
    person_id BIGINT GENERATED ALWAYS AS IDENTITY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(20),
    phone VARCHAR(30),
    address TEXT,
    CONSTRAINT pk_person
        PRIMARY KEY (person_id),
    CONSTRAINT ck_person_first_name
        CHECK (length(trim(first_name)) > 0),
    CONSTRAINT ck_person_last_name
        CHECK (length(trim(last_name)) > 0)
);

-- =========================================================
-- 2. USERS
-- =========================================================
CREATE TABLE users (
    user_id BIGINT GENERATED ALWAYS AS IDENTITY,
    person_id BIGINT NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL
        DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_users
        PRIMARY KEY (user_id),
    CONSTRAINT uq_users_person_id
        UNIQUE (person_id),
    CONSTRAINT uq_users_email
        UNIQUE (email),
    CONSTRAINT fk_users_person
        FOREIGN KEY (person_id)
        REFERENCES person (person_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT ck_users_email
        CHECK (position('@' IN email) > 1),
    CONSTRAINT ck_users_role
        CHECK (role IN ('Student', 'Teacher', 'Admin')),
    CONSTRAINT ck_users_password_hash
        CHECK (length(trim(password_hash)) > 0)
);

-- =========================================================
-- 3. STUDENTS
-- =========================================================
CREATE TABLE students (
    student_id BIGINT GENERATED ALWAYS AS IDENTITY,
    user_id BIGINT NOT NULL,
    target_band NUMERIC(2,1),
    current_band NUMERIC(2,1),
    days_active INTEGER NOT NULL
        DEFAULT 0,
    CONSTRAINT pk_students
        PRIMARY KEY (student_id),
    CONSTRAINT uq_students_user_id
        UNIQUE (user_id),
    CONSTRAINT fk_students_user
        FOREIGN KEY (user_id)
        REFERENCES users (user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT ck_students_target_band
        CHECK (
            target_band IS NULL
            OR target_band BETWEEN 0.0 AND 9.0
        ),
    CONSTRAINT ck_students_current_band
        CHECK (
            current_band IS NULL
            OR current_band BETWEEN 0.0 AND 9.0
        ),
    CONSTRAINT ck_students_days_active
        CHECK (days_active >= 0)
);

-- =========================================================
-- 4. TEACHERS
-- =========================================================
CREATE TABLE teachers (
    teacher_id BIGINT GENERATED ALWAYS AS IDENTITY,
    user_id BIGINT NOT NULL,
    specialization VARCHAR(255),
    CONSTRAINT pk_teachers
        PRIMARY KEY (teacher_id),
    CONSTRAINT uq_teachers_user_id
        UNIQUE (user_id),
    CONSTRAINT fk_teachers_user
        FOREIGN KEY (user_id)
        REFERENCES users (user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- =========================================================
-- 5. ADMINS
-- =========================================================
CREATE TABLE admins (
    admin_id BIGINT GENERATED ALWAYS AS IDENTITY,
    user_id BIGINT NOT NULL,
    CONSTRAINT pk_admins
        PRIMARY KEY (admin_id),
    CONSTRAINT uq_admins_user_id
        UNIQUE (user_id),
    CONSTRAINT fk_admins_user
        FOREIGN KEY (user_id)
        REFERENCES users (user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- =========================================================
-- 6. COURSES
-- =========================================================
CREATE TABLE courses (
    course_id BIGINT GENERATED ALWAYS AS IDENTITY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    level VARCHAR(50),
    duration INTEGER,
    CONSTRAINT pk_courses
        PRIMARY KEY (course_id),
    CONSTRAINT ck_courses_title
        CHECK (length(trim(title)) > 0),
    CONSTRAINT ck_courses_duration
        CHECK (
            duration IS NULL
            OR duration > 0
        )
);

-- =========================================================
-- 7. TEACHER_COURSES
-- =========================================================
CREATE TABLE teacher_courses (
    teacher_course_id BIGINT GENERATED ALWAYS AS IDENTITY,
    teacher_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    assigned_at TIMESTAMPTZ NOT NULL
        DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN NOT NULL
        DEFAULT TRUE,
    CONSTRAINT pk_teacher_courses
        PRIMARY KEY (teacher_course_id),
    CONSTRAINT uq_teacher_courses_teacher_course
        UNIQUE (teacher_id, course_id),
    CONSTRAINT fk_teacher_courses_teacher
        FOREIGN KEY (teacher_id)
        REFERENCES teachers (teacher_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_teacher_courses_course
        FOREIGN KEY (course_id)
        REFERENCES courses (course_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- =========================================================
-- 8. ENROLLMENTS
-- =========================================================
CREATE TABLE enrollments (
    enrollment_id BIGINT GENERATED ALWAYS AS IDENTITY,
    student_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL
        DEFAULT 'Pending',
    enrolled_at TIMESTAMPTZ NOT NULL
        DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_enrollments
        PRIMARY KEY (enrollment_id),
    CONSTRAINT uq_enrollments_student_course
        UNIQUE (student_id, course_id),
    CONSTRAINT fk_enrollments_student
        FOREIGN KEY (student_id)
        REFERENCES students (student_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_enrollments_course
        FOREIGN KEY (course_id)
        REFERENCES courses (course_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT ck_enrollments_status
        CHECK (
            status IN (
                'Pending',
                'Active',
                'Completed',
                'Cancelled'
            )
        )
);

-- =========================================================
-- 9. CONTENTS
-- =========================================================
CREATE TABLE contents (
    content_id BIGINT GENERATED ALWAYS AS IDENTITY,
    course_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content_type VARCHAR(20) NOT NULL,
    youtube_link TEXT,
    file_url TEXT,
    CONSTRAINT pk_contents
        PRIMARY KEY (content_id),
    CONSTRAINT fk_contents_course
        FOREIGN KEY (course_id)
        REFERENCES courses (course_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT ck_contents_title
        CHECK (length(trim(title)) > 0),
    CONSTRAINT ck_contents_type
        CHECK (
            content_type IN (
                'Video',
                'PDF',
                'YouTube',
                'Notes'
            )
        ),
    CONSTRAINT ck_contents_source
        CHECK (
            youtube_link IS NOT NULL
            OR file_url IS NOT NULL
        )
);

-- =========================================================
-- 10. PRACTICE_TESTS
-- =========================================================
CREATE TABLE practice_tests (
    test_id BIGINT GENERATED ALWAYS AS IDENTITY,
    course_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(20) NOT NULL,
    duration INTEGER,
    total_marks INTEGER,
    CONSTRAINT pk_practice_tests
        PRIMARY KEY (test_id),
    CONSTRAINT fk_practice_tests_course
        FOREIGN KEY (course_id)
        REFERENCES courses (course_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT ck_practice_tests_title
        CHECK (length(trim(title)) > 0),
    CONSTRAINT ck_practice_tests_category
        CHECK (
            category IN (
                'Academic',
                'General'
            )
        ),
    CONSTRAINT ck_practice_tests_duration
        CHECK (
            duration IS NULL
            OR duration > 0
        ),
    CONSTRAINT ck_practice_tests_total_marks
        CHECK (
            total_marks IS NULL
            OR total_marks > 0
        )
);

-- =========================================================
-- 11. QUESTIONS
-- =========================================================
CREATE TABLE questions (
    question_id BIGINT GENERATED ALWAYS AS IDENTITY,
    test_id BIGINT NOT NULL,
    question_text TEXT NOT NULL,
    skill VARCHAR(20) NOT NULL,
    marks INTEGER NOT NULL
        DEFAULT 1,
    CONSTRAINT pk_questions
        PRIMARY KEY (question_id),
    CONSTRAINT fk_questions_practice_test
        FOREIGN KEY (test_id)
        REFERENCES practice_tests (test_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT ck_questions_text
        CHECK (length(trim(question_text)) > 0),
    CONSTRAINT ck_questions_skill
        CHECK (
            skill IN (
                'Listening',
                'Reading',
                'Writing',
                'Speaking'
            )
        ),
    CONSTRAINT ck_questions_marks
        CHECK (marks > 0)
);

-- =========================================================
-- 12. ANSWER_OPTIONS
-- =========================================================
CREATE TABLE answer_options (
    option_id BIGINT GENERATED ALWAYS AS IDENTITY,
    question_id BIGINT NOT NULL,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL
        DEFAULT FALSE,
    CONSTRAINT pk_answer_options
        PRIMARY KEY (option_id),
    CONSTRAINT fk_answer_options_question
        FOREIGN KEY (question_id)
        REFERENCES questions (question_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT ck_answer_options_text
        CHECK (length(trim(option_text)) > 0)
);

-- =========================================================
-- 13. TEST_ATTEMPTS
-- =========================================================
CREATE TABLE test_attempts (
    attempt_id BIGINT GENERATED ALWAYS AS IDENTITY,
    student_id BIGINT NOT NULL,
    test_id BIGINT NOT NULL,
    start_time TIMESTAMPTZ NOT NULL
        DEFAULT CURRENT_TIMESTAMP,
    submit_time TIMESTAMPTZ,
    score NUMERIC(5,2),
    band_score NUMERIC(2,1),
    CONSTRAINT pk_test_attempts
        PRIMARY KEY (attempt_id),
    CONSTRAINT fk_test_attempts_student
        FOREIGN KEY (student_id)
        REFERENCES students (student_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_test_attempts_practice_test
        FOREIGN KEY (test_id)
        REFERENCES practice_tests (test_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT ck_test_attempts_score
        CHECK (
            score IS NULL
            OR score >= 0
        ),
    CONSTRAINT ck_test_attempts_band_score
        CHECK (
            band_score IS NULL
            OR band_score BETWEEN 0.0 AND 9.0
        ),
    CONSTRAINT ck_test_attempts_time
        CHECK (
            submit_time IS NULL
            OR submit_time >= start_time
        )
);

-- =========================================================
-- 14. TEST_RESULTS
-- =========================================================
CREATE TABLE test_results (
    result_id BIGINT GENERATED ALWAYS AS IDENTITY,
    attempt_id BIGINT NOT NULL,
    overall_band NUMERIC(2,1),
    listening NUMERIC(2,1),
    reading NUMERIC(2,1),
    writing NUMERIC(2,1),
    speaking NUMERIC(2,1),
    feedback TEXT,
    CONSTRAINT pk_test_results
        PRIMARY KEY (result_id),
    CONSTRAINT uq_test_results_attempt_id
        UNIQUE (attempt_id),
    CONSTRAINT fk_test_results_test_attempt
        FOREIGN KEY (attempt_id)
        REFERENCES test_attempts (attempt_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT ck_test_results_overall_band
        CHECK (
            overall_band IS NULL
            OR overall_band BETWEEN 0.0 AND 9.0
        ),
    CONSTRAINT ck_test_results_listening
        CHECK (
            listening IS NULL
            OR listening BETWEEN 0.0 AND 9.0
        ),
    CONSTRAINT ck_test_results_reading
        CHECK (
            reading IS NULL
            OR reading BETWEEN 0.0 AND 9.0
        ),
    CONSTRAINT ck_test_results_writing
        CHECK (
            writing IS NULL
            OR writing BETWEEN 0.0 AND 9.0
        ),
    CONSTRAINT ck_test_results_speaking
        CHECK (
            speaking IS NULL
            OR speaking BETWEEN 0.0 AND 9.0
        )
);

-- =========================================================
-- 15. LIVE_CLASSES
-- =========================================================
CREATE TABLE live_classes (
    class_id BIGINT GENERATED ALWAYS AS IDENTITY,
    teacher_course_id BIGINT NOT NULL,
    meeting_link TEXT NOT NULL,
    class_date TIMESTAMPTZ NOT NULL,
    CONSTRAINT pk_live_classes
        PRIMARY KEY (class_id),
    CONSTRAINT fk_live_classes_teacher_course
        FOREIGN KEY (teacher_course_id)
        REFERENCES teacher_courses (teacher_course_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT ck_live_classes_meeting_link
        CHECK (length(trim(meeting_link)) > 0)
);

-- =========================================================
-- 16. SUPPORT_TICKETS
-- =========================================================
CREATE TABLE support_tickets (
    ticket_id BIGINT GENERATED ALWAYS AS IDENTITY,
    student_id BIGINT NOT NULL,
    admin_id BIGINT,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) NOT NULL
        DEFAULT 'Open',
    created_at TIMESTAMPTZ NOT NULL
        DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_support_tickets
        PRIMARY KEY (ticket_id),
    CONSTRAINT fk_support_tickets_student
        FOREIGN KEY (student_id)
        REFERENCES students (student_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_support_tickets_admin
        FOREIGN KEY (admin_id)
        REFERENCES admins (admin_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL,
    CONSTRAINT ck_support_tickets_subject
        CHECK (length(trim(subject)) > 0),
    CONSTRAINT ck_support_tickets_message
        CHECK (length(trim(message)) > 0),
    CONSTRAINT ck_support_tickets_status
        CHECK (
            status IN (
                'Open',
                'In Progress',
                'Resolved'
            )
        )
);

-- =========================================================
-- 17. ANNOUNCEMENTS
-- =========================================================
CREATE TABLE announcements (
    announcement_id BIGINT GENERATED ALWAYS AS IDENTITY,
    admin_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL
        DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_announcements
        PRIMARY KEY (announcement_id),
    CONSTRAINT fk_announcements_admin
        FOREIGN KEY (admin_id)
        REFERENCES admins (admin_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT ck_announcements_title
        CHECK (length(trim(title)) > 0),
    CONSTRAINT ck_announcements_message
        CHECK (length(trim(message)) > 0)
);

-- =========================================================
-- 18. ADMIN_LOGS
-- =========================================================
CREATE TABLE admin_logs (
    log_id BIGINT GENERATED ALWAYS AS IDENTITY,
    admin_id BIGINT NOT NULL,
    action VARCHAR(255) NOT NULL,
    logged_at TIMESTAMPTZ NOT NULL
        DEFAULT CURRENT_TIMESTAMP,
    details TEXT,
    CONSTRAINT pk_admin_logs
        PRIMARY KEY (log_id),
    CONSTRAINT fk_admin_logs_admin
        FOREIGN KEY (admin_id)
        REFERENCES admins (admin_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT ck_admin_logs_action
        CHECK (length(trim(action)) > 0)
);
