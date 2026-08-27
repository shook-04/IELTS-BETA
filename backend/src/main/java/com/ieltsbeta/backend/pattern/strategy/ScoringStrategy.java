package com.ieltsbeta.backend.pattern.strategy;

import com.ieltsbeta.backend.entity.AnswerOption;
import com.ieltsbeta.backend.entity.PracticeTest;
import com.ieltsbeta.backend.entity.Question;

import java.util.List;
import java.util.Map;

/**
 * PATTERN 1 — STRATEGY.
 * <p>
 * Encapsulates how a submitted set of answers is turned into a raw
 * marks-based {@link ScoreResult}. Which implementation runs is decided by
 * {@link com.ieltsbeta.backend.pattern.factory.ScoringStrategyFactory}
 * (Pattern 2), keeping this decision out of the controller/facade.
 */
public interface ScoringStrategy {

    /**
     * @param test               the practice test being scored
     * @param questions          all questions belonging to the test
     * @param optionsByQuestion  each question's answer options, keyed by questionId
     * @param selectedOptionIds  the student's selected option, keyed by questionId
     */
    ScoreResult calculateScore(
            PracticeTest test,
            List<Question> questions,
            Map<Long, List<AnswerOption>> optionsByQuestion,
            Map<Long, Long> selectedOptionIds
    );
}