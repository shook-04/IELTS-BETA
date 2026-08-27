package com.ieltsbeta.backend.pattern.facade;

import com.ieltsbeta.backend.dto.TestResultDto;
import com.ieltsbeta.backend.dto.TestSubmissionDto;
import com.ieltsbeta.backend.entity.AnswerOption;
import com.ieltsbeta.backend.entity.PracticeTest;
import com.ieltsbeta.backend.entity.Question;
import com.ieltsbeta.backend.entity.Student;
import com.ieltsbeta.backend.entity.TestAttempt;
import com.ieltsbeta.backend.entity.TestResult;
import com.ieltsbeta.backend.exception.InvalidSubmissionException;
import com.ieltsbeta.backend.exception.TestNotFoundException;
import com.ieltsbeta.backend.pattern.adapter.ExternalScoreAdapter;
import com.ieltsbeta.backend.pattern.factory.ScoringStrategyFactory;
import com.ieltsbeta.backend.pattern.observer.TestResultObserver;
import com.ieltsbeta.backend.pattern.strategy.ScoreResult;
import com.ieltsbeta.backend.pattern.strategy.ScoringStrategy;
import com.ieltsbeta.backend.repository.AnswerOptionRepository;
import com.ieltsbeta.backend.repository.PracticeTestRepository;
import com.ieltsbeta.backend.repository.QuestionRepository;
import com.ieltsbeta.backend.repository.StudentRepository;
import com.ieltsbeta.backend.repository.TestAttemptRepository;
import com.ieltsbeta.backend.repository.TestResultRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * PATTERN 3 — FACADE.
 * <p>
 * Single entry point for submitting a test. Coordinates: retrieve test,
 * validate answers, calculate score (Strategy via Factory), convert to a
 * band score (Adapter), create + save the TestAttempt, create + save the
 * TestResult, notify observers, and return the result. The controller stays
 * thin and only calls {@link #submitTest(Long, Long, TestSubmissionDto)}.
 */
@Service
public class TestSubmissionFacade {

    private final PracticeTestRepository practiceTestRepository;
    private final QuestionRepository questionRepository;
    private final AnswerOptionRepository answerOptionRepository;
    private final StudentRepository studentRepository;
    private final TestAttemptRepository testAttemptRepository;
    private final TestResultRepository testResultRepository;
    private final ScoringStrategyFactory scoringStrategyFactory;
    private final ExternalScoreAdapter externalScoreAdapter;
    private final List<TestResultObserver> observers;

    public TestSubmissionFacade(
            PracticeTestRepository practiceTestRepository,
            QuestionRepository questionRepository,
            AnswerOptionRepository answerOptionRepository,
            StudentRepository studentRepository,
            TestAttemptRepository testAttemptRepository,
            TestResultRepository testResultRepository,
            ScoringStrategyFactory scoringStrategyFactory,
            ExternalScoreAdapter externalScoreAdapter,
            List<TestResultObserver> observers
    ) {
        this.practiceTestRepository = practiceTestRepository;
        this.questionRepository = questionRepository;
        this.answerOptionRepository = answerOptionRepository;
        this.studentRepository = studentRepository;
        this.testAttemptRepository = testAttemptRepository;
        this.testResultRepository = testResultRepository;
        this.scoringStrategyFactory = scoringStrategyFactory;
        this.externalScoreAdapter = externalScoreAdapter;
        this.observers = observers;
    }

    @Transactional
    public TestResultDto submitTest(Long studentId, Long testId, TestSubmissionDto submission) {

        // 1. Retrieve test
        PracticeTest test = practiceTestRepository.findById(testId)
                .orElseThrow(() -> new TestNotFoundException("Practice test not found: " + testId));

        List<Question> questions = questionRepository.findByTestTestId(testId);
        if (questions.isEmpty()) {
            throw new TestNotFoundException("Practice test has no questions: " + testId);
        }

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new InvalidSubmissionException("Authenticated student not found: " + studentId));

        Map<Long, List<AnswerOption>> optionsByQuestion = answerOptionRepository
                .findByQuestionQuestionIdIn(questions.stream().map(Question::getQuestionId).toList())
                .stream()
                .collect(Collectors.groupingBy(o -> o.getQuestion().getQuestionId()));

        // 2. Validate answers
        Map<Long, Long> selectedOptionIds = validateAndBuildAnswerMap(questions, optionsByQuestion, submission);

        // 3. Calculate score (Strategy, selected via Factory)
        ScoringStrategy strategy = scoringStrategyFactory.getStrategy(test.getCategory());
        ScoreResult scoreResult = strategy.calculateScore(test, questions, optionsByQuestion, selectedOptionIds);

        // Convert to a band score via the Adapter — the single authoritative
        // place a band score is produced.
        BigDecimal bandScore = externalScoreAdapter.toBandScore(scoreResult);

        // 4-5. Create + save TestAttempt
        OffsetDateTime now = OffsetDateTime.now();
        TestAttempt attempt = new TestAttempt();
        attempt.setStudent(student);
        attempt.setTest(test);
        attempt.setStartTime(now);
        attempt.setSubmitTime(now);
        attempt.setScore(scoreResult.getMarksObtained());
        attempt.setBandScore(bandScore);
        attempt = testAttemptRepository.save(attempt);

        // 6-7. Create + save TestResult
        TestResult result = new TestResult();
        result.setAttempt(attempt);
        result.setOverallBand(bandScore);
        result.setFeedback(buildFeedback(scoreResult));
        result = testResultRepository.save(result);

        // 8. Notify observers
        for (TestResultObserver observer : observers) {
            observer.onResultGenerated(result, attempt);
        }

        // 9. Return result
        return toDto(attempt, result, scoreResult, test);
    }

    private Map<Long, Long> validateAndBuildAnswerMap(
            List<Question> questions,
            Map<Long, List<AnswerOption>> optionsByQuestion,
            TestSubmissionDto submission
    ) {
        if (submission == null || submission.getAnswers() == null || submission.getAnswers().isEmpty()) {
            throw new InvalidSubmissionException("Submission must include at least one answer");
        }

        Map<Long, Question> questionsById = questions.stream()
                .collect(Collectors.toMap(Question::getQuestionId, q -> q));

        Map<Long, Long> selected = new HashMap<>();

        submission.getAnswers().forEach(answer -> {
            if (answer.getQuestionId() == null || answer.getOptionId() == null) {
                throw new InvalidSubmissionException("Each answer must include questionId and optionId");
            }

            Question question = questionsById.get(answer.getQuestionId());
            if (question == null) {
                throw new InvalidSubmissionException(
                        "Question " + answer.getQuestionId() + " does not belong to this test");
            }

            List<AnswerOption> options = optionsByQuestion.get(answer.getQuestionId());
            boolean optionBelongsToQuestion = options != null && options.stream()
                    .anyMatch(o -> o.getOptionId().equals(answer.getOptionId()));

            if (!optionBelongsToQuestion) {
                throw new InvalidSubmissionException(
                        "Option " + answer.getOptionId() + " does not belong to question " + answer.getQuestionId());
            }

            selected.put(answer.getQuestionId(), answer.getOptionId());
        });

        return selected;
    }

    private String buildFeedback(ScoreResult scoreResult) {
        return "You answered " + scoreResult.getCorrectCount() + " out of "
                + scoreResult.getTotalQuestions() + " questions correctly.";
    }

    private TestResultDto toDto(TestAttempt attempt, TestResult result, ScoreResult scoreResult, PracticeTest test) {
        return new TestResultDto(
                attempt.getAttemptId(),
                test.getTestId(),
                test.getTitle(),
                scoreResult.getMarksObtained(),
                scoreResult.getTotalMarks().intValue(),
                result.getOverallBand(),
                result.getFeedback(),
                attempt.getSubmitTime()
        );
    }
}