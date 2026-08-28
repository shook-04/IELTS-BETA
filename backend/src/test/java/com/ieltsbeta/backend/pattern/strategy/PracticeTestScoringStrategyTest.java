package com.ieltsbeta.backend.pattern.strategy;

import com.ieltsbeta.backend.entity.AnswerOption;
import com.ieltsbeta.backend.entity.PracticeTest;
import com.ieltsbeta.backend.entity.Question;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;

/**
 * PATTERN 1 — STRATEGY.
 * <p>
 * Verifies {@link PracticeTestScoringStrategy#calculateScore} against real
 * (not mocked) entity graphs, since the strategy is pure business logic
 * with no collaborators to isolate.
 */
class PracticeTestScoringStrategyTest {

    private final PracticeTestScoringStrategy strategy = new PracticeTestScoringStrategy();

    private Question question(long id, int marks) {
        Question q = new Question();
        q.setQuestionId(id);
        q.setMarks(marks);
        q.setQuestionText("Q" + id);
        q.setSkill("Reading");
        return q;
    }

    private AnswerOption option(long id, Question question, boolean correct) {
        AnswerOption o = new AnswerOption();
        o.setOptionId(id);
        o.setQuestion(question);
        o.setOptionText("Option " + id);
        o.setCorrect(correct);
        return o;
    }

    private PracticeTest test() {
        PracticeTest test = new PracticeTest();
        test.setTestId(1L);
        test.setCategory("Academic");
        return test;
    }

    @Test
    void allAnswersCorrect_awardsFullMarks() {
        Question q1 = question(1L, 5);
        Question q2 = question(2L, 3);
        AnswerOption q1Correct = option(10L, q1, true);
        AnswerOption q1Wrong = option(11L, q1, false);
        AnswerOption q2Correct = option(20L, q2, true);

        Map<Long, List<AnswerOption>> optionsByQuestion = Map.of(
                1L, List.of(q1Correct, q1Wrong),
                2L, List.of(q2Correct)
        );
        Map<Long, Long> selected = Map.of(1L, 10L, 2L, 20L);

        ScoreResult result = strategy.calculateScore(test(), List.of(q1, q2), optionsByQuestion, selected);

        assertEquals(2, result.getCorrectCount());
        assertEquals(2, result.getTotalQuestions());
        assertEquals(0, BigDecimal.valueOf(8).compareTo(result.getMarksObtained()));
        assertEquals(0, BigDecimal.valueOf(8).compareTo(result.getTotalMarks()));
    }

    @Test
    void allAnswersWrong_awardsZeroMarks() {
        Question q1 = question(1L, 5);
        AnswerOption correct = option(10L, q1, true);
        AnswerOption wrong = option(11L, q1, false);

        Map<Long, List<AnswerOption>> optionsByQuestion = Map.of(1L, List.of(correct, wrong));
        Map<Long, Long> selected = Map.of(1L, 11L);

        ScoreResult result = strategy.calculateScore(test(), List.of(q1), optionsByQuestion, selected);

        assertEquals(0, result.getCorrectCount());
        assertEquals(0, BigDecimal.ZERO.compareTo(result.getMarksObtained()));
        assertEquals(0, BigDecimal.valueOf(5).compareTo(result.getTotalMarks()));
    }

    @Test
    void partialAnswers_awardsPartialMarks() {
        Question q1 = question(1L, 4);
        Question q2 = question(2L, 6);
        AnswerOption q1Correct = option(10L, q1, true);
        AnswerOption q2Correct = option(20L, q2, true);
        AnswerOption q2Wrong = option(21L, q2, false);

        Map<Long, List<AnswerOption>> optionsByQuestion = Map.of(
                1L, List.of(q1Correct),
                2L, List.of(q2Correct, q2Wrong)
        );
        Map<Long, Long> selected = Map.of(1L, 10L, 2L, 21L);

        ScoreResult result = strategy.calculateScore(test(), List.of(q1, q2), optionsByQuestion, selected);

        assertEquals(1, result.getCorrectCount());
        assertEquals(0, BigDecimal.valueOf(4).compareTo(result.getMarksObtained()));
        assertEquals(0, BigDecimal.valueOf(10).compareTo(result.getTotalMarks()));
    }

    @Test
    void unansweredQuestion_countsTowardsTotalButNotObtained() {
        Question q1 = question(1L, 5);
        Question q2 = question(2L, 5);
        AnswerOption q1Correct = option(10L, q1, true);

        Map<Long, List<AnswerOption>> optionsByQuestion = Map.of(1L, List.of(q1Correct));
        // q2 deliberately absent from selectedOptionIds — student skipped it.
        Map<Long, Long> selected = new HashMap<>();
        selected.put(1L, 10L);

        ScoreResult result = strategy.calculateScore(test(), List.of(q1, q2), optionsByQuestion, selected);

        assertEquals(1, result.getCorrectCount());
        assertEquals(2, result.getTotalQuestions());
        assertEquals(0, BigDecimal.valueOf(5).compareTo(result.getMarksObtained()));
        assertEquals(0, BigDecimal.valueOf(10).compareTo(result.getTotalMarks()));
    }

    @Test
    void nullMarks_treatedAsZero() {
        Question q1 = question(1L, 5);
        Question q2 = new Question();
        q2.setQuestionId(2L);
        q2.setMarks(null);

        AnswerOption q1Correct = option(10L, q1, true);

        Map<Long, List<AnswerOption>> optionsByQuestion = Map.of(1L, List.of(q1Correct));
        Map<Long, Long> selected = Map.of(1L, 10L);

        ScoreResult result = strategy.calculateScore(test(), List.of(q1, q2), optionsByQuestion, selected);

        assertEquals(0, BigDecimal.valueOf(5).compareTo(result.getTotalMarks()));
        assertEquals(0, BigDecimal.valueOf(5).compareTo(result.getMarksObtained()));
    }

    @Test
    void selectedOptionNotBelongingToQuestion_isTreatedAsIncorrect() {
        Question q1 = question(1L, 5);
        // An option that exists in the system but isn't wired into this
        // question's optionsByQuestion map — simulates a mismatched/foreign
        // option id being selected.
        AnswerOption foreignOption = option(999L, q1, true);

        Map<Long, List<AnswerOption>> optionsByQuestion = Map.of(1L, List.of());
        Map<Long, Long> selected = Map.of(1L, foreignOption.getOptionId());

        ScoreResult result = strategy.calculateScore(test(), List.of(q1), optionsByQuestion, selected);

        assertEquals(0, result.getCorrectCount());
        assertEquals(0, BigDecimal.ZERO.compareTo(result.getMarksObtained()));
    }

    @Test
    void noQuestions_returnsZeroZeroResult() {
        ScoreResult result = strategy.calculateScore(test(), List.of(), Map.of(), Map.of());

        assertEquals(0, result.getCorrectCount());
        assertEquals(0, result.getTotalQuestions());
        assertEquals(0, BigDecimal.ZERO.compareTo(result.getMarksObtained()));
        assertEquals(0, BigDecimal.ZERO.compareTo(result.getTotalMarks()));
    }

    @Test
    void questionMissingFromOptionsMap_isSkippedGracefully() {
        Question q1 = question(1L, 5);
        // optionsByQuestion has no entry at all for question 1 (defensive
        // null-map branch in the strategy).
        Map<Long, List<AnswerOption>> optionsByQuestion = new HashMap<>();
        Map<Long, Long> selected = Map.of(1L, 10L);

        ScoreResult result = strategy.calculateScore(test(), List.of(q1), optionsByQuestion, selected);

        assertEquals(0, result.getCorrectCount());
        assertEquals(0, BigDecimal.ZERO.compareTo(result.getMarksObtained()));
        assertEquals(0, BigDecimal.valueOf(5).compareTo(result.getTotalMarks()));
    }
}