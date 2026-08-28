package com.ieltsbeta.backend.pattern.facade;

import com.ieltsbeta.backend.dto.SubmitAnswerDto;
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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

/**
 * PATTERN 3 — FACADE.
 * <p>
 * Every repository and collaborator is mocked so this test verifies only
 * {@link TestSubmissionFacade}'s own orchestration logic: validation,
 * delegating to Strategy (via Factory) and Adapter, persistence calls, and
 * Observer notification — never a real database.
 */
@ExtendWith(MockitoExtension.class)
class TestSubmissionFacadeTest {

    @Mock private PracticeTestRepository practiceTestRepository;
    @Mock private QuestionRepository questionRepository;
    @Mock private AnswerOptionRepository answerOptionRepository;
    @Mock private StudentRepository studentRepository;
    @Mock private TestAttemptRepository testAttemptRepository;
    @Mock private TestResultRepository testResultRepository;
    @Mock private ScoringStrategyFactory scoringStrategyFactory;
    @Mock private ExternalScoreAdapter externalScoreAdapter;
    @Mock private ScoringStrategy scoringStrategy;
    @Mock private TestResultObserver observerOne;
    @Mock private TestResultObserver observerTwo;

    private TestSubmissionFacade facade;

    private static final Long STUDENT_ID = 1L;
    private static final Long TEST_ID = 2L;

    @BeforeEach
    void setUp() {
        facade = new TestSubmissionFacade(
                practiceTestRepository,
                questionRepository,
                answerOptionRepository,
                studentRepository,
                testAttemptRepository,
                testResultRepository,
                scoringStrategyFactory,
                externalScoreAdapter,
                List.of(observerOne, observerTwo)
        );
    }

    private PracticeTest practiceTest() {
        PracticeTest test = new PracticeTest();
        test.setTestId(TEST_ID);
        test.setTitle("Academic Reading Test 1");
        test.setCategory("Academic");
        return test;
    }

    private Question question(long id, int marks) {
        Question q = new Question();
        q.setQuestionId(id);
        q.setMarks(marks);
        q.setQuestionText("Question " + id);
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

    private TestSubmissionDto submissionWith(Long questionId, Long optionId) {
        SubmitAnswerDto answer = new SubmitAnswerDto();
        answer.setQuestionId(questionId);
        answer.setOptionId(optionId);
        TestSubmissionDto dto = new TestSubmissionDto();
        dto.setAnswers(List.of(answer));
        return dto;
    }

    @Test
    void testNotFound_throwsTestNotFoundException_andStopsBeforeOtherLookups() {
        when(practiceTestRepository.findById(TEST_ID)).thenReturn(Optional.empty());

        assertThrows(TestNotFoundException.class,
                () -> facade.submitTest(STUDENT_ID, TEST_ID, submissionWith(1L, 10L)));

        verifyNoInteractions(studentRepository, scoringStrategyFactory, externalScoreAdapter,
                testAttemptRepository, testResultRepository, observerOne, observerTwo);
    }

    @Test
    void testWithNoQuestions_throwsTestNotFoundException() {
        when(practiceTestRepository.findById(TEST_ID)).thenReturn(Optional.of(practiceTest()));
        when(questionRepository.findByTestTestId(TEST_ID)).thenReturn(List.of());

        assertThrows(TestNotFoundException.class,
                () -> facade.submitTest(STUDENT_ID, TEST_ID, submissionWith(1L, 10L)));

        verifyNoInteractions(studentRepository, testAttemptRepository, testResultRepository);
    }

    @Test
    void studentNotFound_throwsInvalidSubmissionException() {
        Question q1 = question(1L, 5);
        when(practiceTestRepository.findById(TEST_ID)).thenReturn(Optional.of(practiceTest()));
        when(questionRepository.findByTestTestId(TEST_ID)).thenReturn(List.of(q1));
        when(studentRepository.findById(STUDENT_ID)).thenReturn(Optional.empty());

        assertThrows(InvalidSubmissionException.class,
                () -> facade.submitTest(STUDENT_ID, TEST_ID, submissionWith(1L, 10L)));

        verifyNoInteractions(testAttemptRepository, testResultRepository, observerOne, observerTwo);
    }

    @Test
    void emptySubmission_throwsInvalidSubmissionException() {
        Question q1 = question(1L, 5);
        Student student = new Student();
        student.setStudentId(STUDENT_ID);

        when(practiceTestRepository.findById(TEST_ID)).thenReturn(Optional.of(practiceTest()));
        when(questionRepository.findByTestTestId(TEST_ID)).thenReturn(List.of(q1));
        when(studentRepository.findById(STUDENT_ID)).thenReturn(Optional.of(student));
        when(answerOptionRepository.findByQuestionQuestionIdIn(anyList())).thenReturn(List.of());

        TestSubmissionDto empty = new TestSubmissionDto();
        empty.setAnswers(List.of());

        assertThrows(InvalidSubmissionException.class,
                () -> facade.submitTest(STUDENT_ID, TEST_ID, empty));
    }

    @Test
    void answerReferencingUnknownQuestion_throwsInvalidSubmissionException() {
        Question q1 = question(1L, 5);
        Student student = new Student();
        student.setStudentId(STUDENT_ID);

        when(practiceTestRepository.findById(TEST_ID)).thenReturn(Optional.of(practiceTest()));
        when(questionRepository.findByTestTestId(TEST_ID)).thenReturn(List.of(q1));
        when(studentRepository.findById(STUDENT_ID)).thenReturn(Optional.of(student));
        when(answerOptionRepository.findByQuestionQuestionIdIn(anyList())).thenReturn(List.of());

        // questionId 999 does not belong to this test's question list.
        assertThrows(InvalidSubmissionException.class,
                () -> facade.submitTest(STUDENT_ID, TEST_ID, submissionWith(999L, 10L)));
    }

    @Test
    void answerReferencingOptionNotBelongingToQuestion_throwsInvalidSubmissionException() {
        Question q1 = question(1L, 5);
        AnswerOption unrelatedOption = option(50L, question(2L, 5), true);
        Student student = new Student();
        student.setStudentId(STUDENT_ID);

        when(practiceTestRepository.findById(TEST_ID)).thenReturn(Optional.of(practiceTest()));
        when(questionRepository.findByTestTestId(TEST_ID)).thenReturn(List.of(q1));
        when(studentRepository.findById(STUDENT_ID)).thenReturn(Optional.of(student));
        when(answerOptionRepository.findByQuestionQuestionIdIn(anyList())).thenReturn(List.of(unrelatedOption));

        assertThrows(InvalidSubmissionException.class,
                () -> facade.submitTest(STUDENT_ID, TEST_ID, submissionWith(1L, 50L)));
    }

    @Test
    void happyPath_ordersScoringPersistenceAndObserverNotificationCorrectly() {
        Question q1 = question(1L, 5);
        AnswerOption correctOption = option(10L, q1, true);
        Student student = new Student();
        student.setStudentId(STUDENT_ID);
        PracticeTest test = practiceTest();

        ScoreResult scoreResult = new ScoreResult(1, 1, BigDecimal.valueOf(5), BigDecimal.valueOf(5));
        BigDecimal bandScore = new BigDecimal("9.0");

        when(practiceTestRepository.findById(TEST_ID)).thenReturn(Optional.of(test));
        when(questionRepository.findByTestTestId(TEST_ID)).thenReturn(List.of(q1));
        when(studentRepository.findById(STUDENT_ID)).thenReturn(Optional.of(student));
        when(answerOptionRepository.findByQuestionQuestionIdIn(anyList())).thenReturn(List.of(correctOption));
        when(scoringStrategyFactory.getStrategy("Academic")).thenReturn(scoringStrategy);
        when(scoringStrategy.calculateScore(eq(test), anyList(), any(), any())).thenReturn(scoreResult);
        when(externalScoreAdapter.toBandScore(scoreResult)).thenReturn(bandScore);

        // save() echoes back what it was given, but with generated ids set,
        // like a real JPA repository would.
        when(testAttemptRepository.save(any(TestAttempt.class))).thenAnswer(invocation -> {
            TestAttempt attempt = invocation.getArgument(0);
            attempt.setAttemptId(100L);
            return attempt;
        });
        when(testResultRepository.save(any(TestResult.class))).thenAnswer(invocation -> {
            TestResult result = invocation.getArgument(0);
            result.setResultId(200L);
            return result;
        });

        TestResultDto dto = facade.submitTest(STUDENT_ID, TEST_ID, submissionWith(1L, 10L));

        // --- Persistence: TestAttempt saved with correct data ---
        ArgumentCaptor<TestAttempt> attemptCaptor = ArgumentCaptor.forClass(TestAttempt.class);
        verify(testAttemptRepository).save(attemptCaptor.capture());
        TestAttempt savedAttempt = attemptCaptor.getValue();
        assertEquals(student, savedAttempt.getStudent());
        assertEquals(test, savedAttempt.getTest());
        assertEquals(0, bandScore.compareTo(savedAttempt.getBandScore()));
        assertEquals(0, BigDecimal.valueOf(5).compareTo(savedAttempt.getScore()));

        // --- Persistence: TestResult saved with correct band + feedback ---
        ArgumentCaptor<TestResult> resultCaptor = ArgumentCaptor.forClass(TestResult.class);
        verify(testResultRepository).save(resultCaptor.capture());
        TestResult savedResult = resultCaptor.getValue();
        assertEquals(0, bandScore.compareTo(savedResult.getOverallBand()));
        assertEquals(100L, savedResult.getAttempt().getAttemptId());
        assertEquals("You answered 1 out of 1 questions correctly.", savedResult.getFeedback());

        // --- Observer notification: every observer notified exactly once,
        //     with the exact saved attempt/result ---
        verify(observerOne, times(1)).onResultGenerated(savedResult, savedAttempt);
        verify(observerTwo, times(1)).onResultGenerated(savedResult, savedAttempt);

        // --- Returned DTO reflects the coordinated workflow output ---
        assertEquals(100L, dto.getAttemptId());
        assertEquals(TEST_ID, dto.getTestId());
        assertEquals("Academic Reading Test 1", dto.getTestTitle());
        assertEquals(0, BigDecimal.valueOf(5).compareTo(dto.getScore()));
        assertEquals(5, dto.getTotalMarks());
        assertEquals(0, bandScore.compareTo(dto.getBandScore()));
    }

    @Test
    void whenValidationFails_scoringAndPersistenceNeverHappen() {
        Question q1 = question(1L, 5);
        Student student = new Student();
        student.setStudentId(STUDENT_ID);

        when(practiceTestRepository.findById(TEST_ID)).thenReturn(Optional.of(practiceTest()));
        when(questionRepository.findByTestTestId(TEST_ID)).thenReturn(List.of(q1));
        when(studentRepository.findById(STUDENT_ID)).thenReturn(Optional.of(student));
        when(answerOptionRepository.findByQuestionQuestionIdIn(anyList())).thenReturn(List.of());

        assertThrows(InvalidSubmissionException.class,
                () -> facade.submitTest(STUDENT_ID, TEST_ID, submissionWith(999L, 10L)));

        verifyNoInteractions(scoringStrategyFactory, externalScoreAdapter, testAttemptRepository,
                testResultRepository, observerOne, observerTwo);
    }

    @Test
    void facadeWithNoObservers_stillSucceeds() {
        // Confirms the observer list is genuinely optional/iterated safely
        // (List.of() from Spring when no TestResultObserver beans exist).
        TestSubmissionFacade facadeNoObservers = new TestSubmissionFacade(
                practiceTestRepository, questionRepository, answerOptionRepository, studentRepository,
                testAttemptRepository, testResultRepository, scoringStrategyFactory, externalScoreAdapter,
                List.of()
        );

        Question q1 = question(1L, 5);
        AnswerOption correctOption = option(10L, q1, true);
        Student student = new Student();
        student.setStudentId(STUDENT_ID);
        PracticeTest test = practiceTest();
        ScoreResult scoreResult = new ScoreResult(1, 1, BigDecimal.valueOf(5), BigDecimal.valueOf(5));

        when(practiceTestRepository.findById(TEST_ID)).thenReturn(Optional.of(test));
        when(questionRepository.findByTestTestId(TEST_ID)).thenReturn(List.of(q1));
        when(studentRepository.findById(STUDENT_ID)).thenReturn(Optional.of(student));
        when(answerOptionRepository.findByQuestionQuestionIdIn(anyList())).thenReturn(List.of(correctOption));
        when(scoringStrategyFactory.getStrategy("Academic")).thenReturn(scoringStrategy);
        when(scoringStrategy.calculateScore(eq(test), anyList(), any(), any())).thenReturn(scoreResult);
        when(externalScoreAdapter.toBandScore(scoreResult)).thenReturn(new BigDecimal("9.0"));
        when(testAttemptRepository.save(any(TestAttempt.class))).thenAnswer(inv -> inv.getArgument(0));
        when(testResultRepository.save(any(TestResult.class))).thenAnswer(inv -> inv.getArgument(0));

        TestResultDto dto = facadeNoObservers.submitTest(STUDENT_ID, TEST_ID, submissionWith(1L, 10L));

        assertEquals(TEST_ID, dto.getTestId());
    }
}