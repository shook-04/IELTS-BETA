package com.ieltsbeta.backend.repository;

import com.ieltsbeta.backend.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {

    List<Question> findByTestTestId(Long testId);

    int countByTestTestId(Long testId);
}