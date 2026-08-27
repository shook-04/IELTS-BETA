package com.ieltsbeta.backend.repository;

import com.ieltsbeta.backend.entity.TestResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TestResultRepository extends JpaRepository<TestResult, Long> {

    Optional<TestResult> findByAttemptAttemptId(Long attemptId);
}