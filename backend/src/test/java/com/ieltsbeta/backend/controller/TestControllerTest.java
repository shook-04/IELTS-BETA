package com.ieltsbeta.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ieltsbeta.backend.dto.SubmitAnswerDto;
import com.ieltsbeta.backend.dto.TestResultDto;
import com.ieltsbeta.backend.dto.TestSubmissionDto;
import com.ieltsbeta.backend.dto.TestSummaryDto;
import com.ieltsbeta.backend.entity.Student;
import com.ieltsbeta.backend.entity.User;
import com.ieltsbeta.backend.pattern.facade.TestSubmissionFacade;
import com.ieltsbeta.backend.service.PracticeTestService;
import com.ieltsbeta.backend.service.StudentService;
import com.ieltsbeta.backend.service.UserService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Standalone MockMvc tests for {@link TestController}, using the actual
 * endpoints found in the controller (no invented routes). No Spring context,
 * security filter chain, or database is involved — only the real controller
 * wired to mocked {@link PracticeTestService} / {@link TestSubmissionFacade}
 * collaborators.
 */
@ExtendWith(MockitoExtension.class)
class TestControllerTest {

    @Mock private PracticeTestService practiceTestService;
    @Mock private TestSubmissionFacade testSubmissionFacade;
    @Mock private UserService userService;
    @Mock private StudentService studentService;

    private MockMvc mockMvc;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final Long STUDENT_ID = 1L;
    private static final Long USER_ID = 9L;
    private static final Long TEST_ID = 2L;

    @BeforeEach
    void setUp() {
        TestController controller = new TestController(
                practiceTestService, testSubmissionFacade, userService, studentService);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    private void authenticateAsStudent(String email) {
        Authentication authentication = new UsernamePasswordAuthenticationToken(email, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = new User();
        user.setUserId(USER_ID);
        user.setEmail(email);
        user.setRole("Student");

        Student student = new Student();
        student.setStudentId(STUDENT_ID);

        when(userService.getUserByEmail(email)).thenReturn(Optional.of(user));
        when(studentService.getStudentByUserId(USER_ID)).thenReturn(Optional.of(student));
    }

    @Test
    void listTests_returnsOkWithSummaries() throws Exception {
        TestSummaryDto summary = new TestSummaryDto(TEST_ID, "Academic Test 1", "Academic", 60, 10, 5);
        when(practiceTestService.listTests()).thenReturn(List.of(summary));

        mockMvc.perform(get("/api/tests"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].testId").value(TEST_ID))
                .andExpect(jsonPath("$[0].title").value("Academic Test 1"))
                .andExpect(jsonPath("$[0].questionCount").value(5));
    }

    @Test
    void submitTest_authenticatedStudent_delegatesToFacadeWithResolvedStudentId() throws Exception {
        authenticateAsStudent("ada@example.com");

        SubmitAnswerDto answer = new SubmitAnswerDto();
        answer.setQuestionId(1L);
        answer.setOptionId(10L);
        TestSubmissionDto submission = new TestSubmissionDto();
        submission.setAnswers(List.of(answer));

        TestResultDto resultDto = new TestResultDto(
                100L, TEST_ID, "Academic Test 1", BigDecimal.valueOf(8), 10,
                new BigDecimal("7.0"), "Well done", OffsetDateTime.now());

        when(testSubmissionFacade.submitTest(eq(STUDENT_ID), eq(TEST_ID), any(TestSubmissionDto.class)))
                .thenReturn(resultDto);

        mockMvc.perform(post("/api/tests/{testId}/submit", TEST_ID)
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(submission)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.attemptId").value(100))
                .andExpect(jsonPath("$.bandScore").value(7.0))
                .andExpect(jsonPath("$.feedback").value("Well done"));
    }

    @Test
    void submitTest_unauthenticatedUserNotFound_propagatesInvalidSubmissionException() throws Exception {
        Authentication authentication = new UsernamePasswordAuthenticationToken("ghost@example.com", null, List.of());
        SecurityContextHolder.getContext().setAuthentication(authentication);
        when(userService.getUserByEmail("ghost@example.com")).thenReturn(Optional.empty());

        SubmitAnswerDto answer = new SubmitAnswerDto();
        answer.setQuestionId(1L);
        answer.setOptionId(10L);
        TestSubmissionDto submission = new TestSubmissionDto();
        submission.setAnswers(List.of(answer));

        // GlobalExceptionHandler has no handler for InvalidSubmissionException,
        // so — matching current production behavior — it propagates rather
        // than being translated into a clean JSON error response.
        assertThrows(Exception.class, () -> mockMvc.perform(post("/api/tests/{testId}/submit", TEST_ID)
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(submission))));
    }

    @Test
    void submitTest_authenticatedUserIsNotAStudent_propagatesInvalidSubmissionException() throws Exception {
        Authentication authentication = new UsernamePasswordAuthenticationToken("teacher@example.com", null, List.of());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        User teacherUser = new User();
        teacherUser.setUserId(USER_ID);
        teacherUser.setEmail("teacher@example.com");
        teacherUser.setRole("Teacher");

        when(userService.getUserByEmail("teacher@example.com")).thenReturn(Optional.of(teacherUser));
        when(studentService.getStudentByUserId(USER_ID)).thenReturn(Optional.empty());

        SubmitAnswerDto answer = new SubmitAnswerDto();
        answer.setQuestionId(1L);
        answer.setOptionId(10L);
        TestSubmissionDto submission = new TestSubmissionDto();
        submission.setAnswers(List.of(answer));

        assertThrows(Exception.class, () -> mockMvc.perform(post("/api/tests/{testId}/submit", TEST_ID)
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(submission))));
    }

    @Test
    void getResults_authenticatedStudent_returnsOkWithResults() throws Exception {
        authenticateAsStudent("ada@example.com");

        TestResultDto resultDto = new TestResultDto(
                100L, TEST_ID, "Academic Test 1", BigDecimal.valueOf(8), 10,
                new BigDecimal("7.0"), "Well done", OffsetDateTime.now());

        when(practiceTestService.getResultsForStudent(STUDENT_ID)).thenReturn(List.of(resultDto));

        mockMvc.perform(get("/api/tests/results"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].attemptId").value(100))
                .andExpect(jsonPath("$[0].testTitle").value("Academic Test 1"));
    }

    @Test
    void getTest_testNotFound_propagatesTestNotFoundException() throws Exception {
        when(practiceTestService.getTestDetails(TEST_ID))
                .thenThrow(new com.ieltsbeta.backend.exception.TestNotFoundException("not found"));

        // Same current-behavior note as above: TestNotFoundException has no
        // dedicated handler in GlobalExceptionHandler.
        assertThrows(Exception.class, () -> mockMvc.perform(get("/api/tests/{testId}", TEST_ID)));
    }
}