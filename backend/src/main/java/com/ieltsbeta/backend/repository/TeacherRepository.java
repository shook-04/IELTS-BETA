package com.ieltsbeta.backend.repository;

import com.ieltsbeta.backend.entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TeacherRepository extends JpaRepository<Teacher, Long> {

    Optional<Teacher> findByUserUserId(Long userId);
}