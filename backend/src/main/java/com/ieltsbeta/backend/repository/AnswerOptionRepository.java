package com.ieltsbeta.backend.repository;

import com.ieltsbeta.backend.entity.AnswerOption;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AnswerOptionRepository extends JpaRepository<AnswerOption, Long> {

    List<AnswerOption> findByQuestionQuestionId(Long questionId);

    List<AnswerOption> findByQuestionQuestionIdIn(List<Long> questionIds);
}