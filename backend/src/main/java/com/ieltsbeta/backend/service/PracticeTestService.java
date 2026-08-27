package com.ieltsbeta.backend.service;

import com.ieltsbeta.backend.dto.AnswerOptionDto;
import com.ieltsbeta.backend.dto.QuestionDto;
import com.ieltsbeta.backend.dto.TestDetailsDto;
import com.ieltsbeta.backend.dto.TestResultDto;
import com.ieltsbeta.backend.dto.TestSummaryDto;
import com.ieltsbeta.backend.entity.AnswerOption;
import com.ieltsbeta.backend.entity.PracticeTest;
import com.ieltsbeta.backend.entity.Question;
import com.ieltsbeta.backend.entity.TestAttempt;
import com.ieltsbeta.backend.exception.TestNotFoundException;
import com.ieltsbeta.backend.repository.AnswerOptionRepository;
import com.ieltsbeta.backend.repository.PracticeTestRepository;
import com.ieltsbeta.backend.repository.QuestionRepository;
import com.ieltsbeta.backend.repository.TestAttemptRepository;
import com.ieltsbeta.backend.repository.TestResultRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class PracticeTestService {

    private final PracticeTestRepository practiceTestRepository;
    private final QuestionRepository questionRepository;
    private final AnswerOptionRepository answerOptionRepository;
    private final TestAttemptRepository testAttemptRepository;
    private final TestResultRepository testResultRepository;

    public PracticeTestService(
            PracticeTestRepository practiceTestRepository,
            QuestionRepository questionRepository,
            AnswerOptionRepository answerOptionRepository,
            TestAttemptRepository testAttemptRepository,
            TestResultRepository testResultRepository
    ) {
        this.practiceTestRepository = practiceTestRepository;
        this.questionRepository = questionRepository;
        this.answerOptionRepository = answerOptionRepository;
        this.testAttemptRepository = testAttemptRepository;
        this.testResultRepository = testResultRepository;
    }

    public List<TestSummaryDto> listTests() {
        return practiceTestRepository.findAll().stream()
                .map(test -> new TestSummaryDto(
                        test.getTestId(),
                        test.getTitle(),
                        test.getCategory(),
                        test.getDuration(),
                        test.getTotalMarks(),
                        questionRepository.countByTestTestId(test.getTestId())
                ))
                .toList();
    }

    public TestDetailsDto getTestDetails(Long testId) {
        PracticeTest test = practiceTestRepository.findById(testId)
                .orElseThrow(() -> new TestNotFoundException("Practice test not found: " + testId));

        List<Question> questions = questionRepository.findByTestTestId(testId);

        Map<Long, List<AnswerOption>> optionsByQuestion = answerOptionRepository
                .findByQuestionQuestionIdIn(questions.stream().map(Question::getQuestionId).toList())
                .stream()
                .collect(Collectors.groupingBy(o -> o.getQuestion().getQuestionId()));

        List<QuestionDto> questionDtos = questions.stream()
                .map(q -> new QuestionDto(
                        q.getQuestionId(),
                        q.getQuestionText(),
                        q.getSkill(),
                        q.getMarks(),
                        optionsByQuestion.getOrDefault(q.getQuestionId(), List.of()).stream()
                                .map(o -> new AnswerOptionDto(o.getOptionId(), o.getOptionText()))
                                .toList()
                ))
                .toList();

        return new TestDetailsDto(test.getTestId(), test.getTitle(), test.getCategory(), test.getDuration(), questionDtos);
    }

    public List<TestResultDto> getResultsForStudent(Long studentId) {
        List<TestAttempt> attempts = testAttemptRepository.findByStudentStudentIdOrderByStartTimeDesc(studentId);

        return attempts.stream()
                .map(attempt -> testResultRepository.findByAttemptAttemptId(attempt.getAttemptId())
                        .map(result -> new TestResultDto(
                                attempt.getAttemptId(),
                                attempt.getTest().getTestId(),
                                attempt.getTest().getTitle(),
                                attempt.getScore(),
                                questionRepository.countByTestTestId(attempt.getTest().getTestId()) == 0
                                        ? null
                                        : sumMarks(attempt.getTest().getTestId()),
                                result.getOverallBand(),
                                result.getFeedback(),
                                attempt.getSubmitTime()
                        ))
                        .orElse(null))
                .filter(dto -> dto != null)
                .toList();
    }

    private Integer sumMarks(Long testId) {
        return questionRepository.findByTestTestId(testId).stream()
                .mapToInt(q -> q.getMarks() == null ? 0 : q.getMarks())
                .sum();
    }
}