package com.ieltsbeta.backend.repository;

import com.ieltsbeta.backend.entity.TestAttempt;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TestAttemptRepository extends JpaRepository<TestAttempt, Long> {

    List<TestAttempt> findByStudentStudentIdOrderByStartTimeDesc(Long studentId);
}