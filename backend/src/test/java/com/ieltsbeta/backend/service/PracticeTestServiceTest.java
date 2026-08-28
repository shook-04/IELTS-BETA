package com.ieltsbeta.backend.service;

import com.ieltsbeta.backend.dto.TestDetailsDto;
import com.ieltsbeta.backend.dto.TestResultDto;
import com.ieltsbeta.backend.dto.TestSummaryDto;
import com.ieltsbeta.backend.entity.AnswerOption;
import com.ieltsbeta.backend.entity.PracticeTest;
import com.ieltsbeta.backend.entity.Question;
import com.ieltsbeta.backend.entity.Student;
import com.ieltsbeta.backend.entity.TestAttempt;
import com.ieltsbeta.backend.entity.TestResult;
import com.ieltsbeta.backend.exception.TestNotFoundException;
import com.ieltsbeta.backend.repository.AnswerOptionRepository;
import com.ieltsbeta.backend.repository.PracticeTestRepository;
import com.ieltsbeta.backend.repository.QuestionRepository;
import com.ieltsbeta.backend.repository.TestAttemptRepository;
import com.ieltsbeta.backend.repository.TestResultRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PracticeTestServiceTest {

    @Mock private PracticeTestRepository practiceTestRepository;
    @Mock private QuestionRepository questionRepository;
    @Mock private AnswerOptionRepository answerOptionRepository;
    @Mock private TestAttemptRepository testAttemptRepository;
    @Mock private TestResultRepository testResultRepository;

    private PracticeTestService service;

    private static final Long TEST_ID = 1L;
    private static final Long STUDENT_ID = 5L;

    @BeforeEach
    void setUp() {
        service = new PracticeTestService(
                practiceTestRepository, questionRepository, answerOptionRepository,
                testAttemptRepository, testResultRepository
        );
    }

    private PracticeTest practiceTest() {
        PracticeTest test = new PracticeTest();
        test.setTestId(TEST_ID);
        test.setTitle("Academic Reading Test 1");
        test.setCategory("Academic");
        test.setDuration(60);
        test.setTotalMarks(10);
        return test;
    }

    // ----- listTests() -----

    @Test
    void listTests_mapsEachTestToSummaryDtoWithQuestionCount() {
        PracticeTest test = practiceTest();
        when(practiceTestRepository.findAll()).thenReturn(List.of(test));
        when(questionRepository.countByTestTestId(TEST_ID)).thenReturn(3);

        List<TestSummaryDto> result = service.listTests();

        assertEquals(1, result.size());
        TestSummaryDto dto = result.get(0);
        assertEquals(TEST_ID, dto.getTestId());
        assertEquals("Academic Reading Test 1", dto.getTitle());
        assertEquals("Academic", dto.getCategory());
        assertEquals(60, dto.getDuration());
        assertEquals(10, dto.getTotalMarks());
        assertEquals(3, dto.getQuestionCount());
    }

    @Test
    void listTests_noTests_returnsEmptyList() {
        when(practiceTestRepository.findAll()).thenReturn(List.of());

        assertTrue(service.listTests().isEmpty());
    }

    // ----- getTestDetails() -----

    @Test
    void getTestDetails_testNotFound_throwsTestNotFoundException() {
        when(practiceTestRepository.findById(TEST_ID)).thenReturn(Optional.empty());

        assertThrows(TestNotFoundException.class, () -> service.getTestDetails(TEST_ID));
    }

    @Test
    void getTestDetails_neverExposesIsCorrectFlagOnOptions() {
        PracticeTest test = practiceTest();
        Question question = new Question();
        question.setQuestionId(10L);
        question.setQuestionText("What is 2+2?");
        question.setSkill("Reading");
        question.setMarks(2);

        AnswerOption correct = new AnswerOption();
        correct.setOptionId(100L);
        correct.setQuestion(question);
        correct.setOptionText("4");
        correct.setCorrect(true);

        AnswerOption wrong = new AnswerOption();
        wrong.setOptionId(101L);
        wrong.setQuestion(question);
        wrong.setOptionText("5");
        wrong.setCorrect(false);

        when(practiceTestRepository.findById(TEST_ID)).thenReturn(Optional.of(test));
        when(questionRepository.findByTestTestId(TEST_ID)).thenReturn(List.of(question));
        when(answerOptionRepository.findByQuestionQuestionIdIn(anyList()))
                .thenReturn(List.of(correct, wrong));

        TestDetailsDto dto = service.getTestDetails(TEST_ID);

        assertEquals(TEST_ID, dto.getTestId());
        assertEquals(1, dto.getQuestions().size());
        assertEquals(2, dto.getQuestions().get(0).getOptions().size());
        // AnswerOptionDto only has optionId/optionText — the correctness
        // flag is a business rule that must never leak to the client.
        assertEquals("4", dto.getQuestions().get(0).getOptions().get(0).getOptionText());
    }

    @Test
    void getTestDetails_questionWithNoOptions_returnsEmptyOptionsList() {
        PracticeTest test = practiceTest();
        Question question = new Question();
        question.setQuestionId(10L);
        question.setMarks(2);

        when(practiceTestRepository.findById(TEST_ID)).thenReturn(Optional.of(test));
        when(questionRepository.findByTestTestId(TEST_ID)).thenReturn(List.of(question));
        when(answerOptionRepository.findByQuestionQuestionIdIn(anyList())).thenReturn(List.of());

        TestDetailsDto dto = service.getTestDetails(TEST_ID);

        assertTrue(dto.getQuestions().get(0).getOptions().isEmpty());
    }

    // ----- getResultsForStudent() -----

    @Test
    void getResultsForStudent_noAttempts_returnsEmptyList() {
        when(testAttemptRepository.findByStudentStudentIdOrderByStartTimeDesc(STUDENT_ID))
                .thenReturn(List.of());

        assertTrue(service.getResultsForStudent(STUDENT_ID).isEmpty());
    }

    @Test
    void getResultsForStudent_attemptWithoutResult_isFilteredOut() {
        PracticeTest test = practiceTest();
        Student student = new Student();
        student.setStudentId(STUDENT_ID);
        TestAttempt attempt = new TestAttempt();
        attempt.setAttemptId(1L);
        attempt.setStudent(student);
        attempt.setTest(test);
        attempt.setStartTime(OffsetDateTime.now());

        when(testAttemptRepository.findByStudentStudentIdOrderByStartTimeDesc(STUDENT_ID))
                .thenReturn(List.of(attempt));
        when(testResultRepository.findByAttemptAttemptId(1L)).thenReturn(Optional.empty());

        List<TestResultDto> results = service.getResultsForStudent(STUDENT_ID);

        assertTrue(results.isEmpty());
    }

    @Test
    void getResultsForStudent_attemptWithResult_mapsToDtoWithSummedMarks() {
        PracticeTest test = practiceTest();
        Student student = new Student();
        student.setStudentId(STUDENT_ID);
        TestAttempt attempt = new TestAttempt();
        attempt.setAttemptId(1L);
        attempt.setStudent(student);
        attempt.setTest(test);
        attempt.setStartTime(OffsetDateTime.now());
        attempt.setSubmitTime(OffsetDateTime.now());
        attempt.setScore(BigDecimal.valueOf(8));

        TestResult result = new TestResult();
        result.setResultId(1L);
        result.setAttempt(attempt);
        result.setOverallBand(new BigDecimal("7.0"));
        result.setFeedback("Well done");

        Question q1 = new Question();
        q1.setQuestionId(1L);
        q1.setMarks(6);
        Question q2 = new Question();
        q2.setQuestionId(2L);
        q2.setMarks(4);

        when(testAttemptRepository.findByStudentStudentIdOrderByStartTimeDesc(STUDENT_ID))
                .thenReturn(List.of(attempt));
        when(testResultRepository.findByAttemptAttemptId(1L)).thenReturn(Optional.of(result));
        when(questionRepository.countByTestTestId(TEST_ID)).thenReturn(2);
        when(questionRepository.findByTestTestId(TEST_ID)).thenReturn(List.of(q1, q2));

        List<TestResultDto> results = service.getResultsForStudent(STUDENT_ID);

        assertEquals(1, results.size());
        TestResultDto dto = results.get(0);
        assertEquals(1L, dto.getAttemptId());
        assertEquals(TEST_ID, dto.getTestId());
        assertEquals(10, dto.getTotalMarks());
        assertEquals(0, new BigDecimal("7.0").compareTo(dto.getBandScore()));
        assertEquals("Well done", dto.getFeedback());
    }

    @Test
    void getResultsForStudent_testWithNoQuestions_totalMarksIsNull() {
        PracticeTest test = practiceTest();
        Student student = new Student();
        student.setStudentId(STUDENT_ID);
        TestAttempt attempt = new TestAttempt();
        attempt.setAttemptId(1L);
        attempt.setStudent(student);
        attempt.setTest(test);
        attempt.setStartTime(OffsetDateTime.now());

        TestResult result = new TestResult();
        result.setResultId(1L);
        result.setAttempt(attempt);

        when(testAttemptRepository.findByStudentStudentIdOrderByStartTimeDesc(STUDENT_ID))
                .thenReturn(List.of(attempt));
        when(testResultRepository.findByAttemptAttemptId(1L)).thenReturn(Optional.of(result));
        when(questionRepository.countByTestTestId(TEST_ID)).thenReturn(0);

        List<TestResultDto> results = service.getResultsForStudent(STUDENT_ID);

        assertNull(results.get(0).getTotalMarks());
    }
}