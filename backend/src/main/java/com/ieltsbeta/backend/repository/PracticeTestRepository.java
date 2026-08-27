package com.ieltsbeta.backend.repository;

import com.ieltsbeta.backend.entity.PracticeTest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PracticeTestRepository extends JpaRepository<PracticeTest, Long> {
}