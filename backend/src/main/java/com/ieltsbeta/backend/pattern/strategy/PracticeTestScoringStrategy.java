package com.ieltsbeta.backend.pattern.strategy;

import com.ieltsbeta.backend.entity.AnswerOption;
import com.ieltsbeta.backend.entity.PracticeTest;
import com.ieltsbeta.backend.entity.Question;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * Scores a multiple-choice practice test: for each question, a correct
 * selected answer earns that question's marks; anything else (wrong answer,
 * unanswered question) earns zero. Total marks come from the sum of the
 * questions' own {@code marks} values, since that always matches the actual
 * test content even if {@code practice_tests.total_marks} is left NULL.
 */
@Component
public class PracticeTestScoringStrategy implements ScoringStrategy {

    @Override
    public ScoreResult calculateScore(
            PracticeTest test,
            List<Question> questions,
            Map<Long, List<AnswerOption>> optionsByQuestion,
            Map<Long, Long> selectedOptionIds
    ) {
        int correctCount = 0;
        int marksObtained = 0;
        int totalMarks = 0;

        for (Question question : questions) {
            int marks = question.getMarks() == null ? 0 : question.getMarks();
            totalMarks += marks;

            Long selectedOptionId = selectedOptionIds.get(question.getQuestionId());
            if (selectedOptionId == null) {
                continue;
            }

            List<AnswerOption> options = optionsByQuestion.get(question.getQuestionId());
            if (options == null) {
                continue;
            }

            boolean isCorrect = options.stream()
                    .anyMatch(o -> o.getOptionId().equals(selectedOptionId) && o.isCorrect());

            if (isCorrect) {
                correctCount++;
                marksObtained += marks;
            }
        }

        return new ScoreResult(
                correctCount,
                questions.size(),
                BigDecimal.valueOf(marksObtained),
                BigDecimal.valueOf(totalMarks)
        );
    }
}