
package com.ieltsbeta.backend.controller;

import com.ieltsbeta.backend.dto.TestDetailsDto;
import com.ieltsbeta.backend.dto.TestResultDto;
import com.ieltsbeta.backend.dto.TestSubmissionDto;
import com.ieltsbeta.backend.dto.TestSummaryDto;
import com.ieltsbeta.backend.entity.Student;
import com.ieltsbeta.backend.entity.User;
import com.ieltsbeta.backend.exception.InvalidSubmissionException;
import com.ieltsbeta.backend.pattern.facade.TestSubmissionFacade;
import com.ieltsbeta.backend.service.PracticeTestService;
import com.ieltsbeta.backend.service.StudentService;
import com.ieltsbeta.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Thin controller: every request either delegates straight to
 * {@link PracticeTestService} for reads or to {@link TestSubmissionFacade}
 * (Pattern 3) for the submission workflow. The authenticated student is
 * always resolved from the session here — never trusted from the request
 * body — mirroring the pattern already used in {@code AuthController}.
 */
@RestController
@RequestMapping("/api/tests")
public class TestController {

    private final PracticeTestService practiceTestService;
    private final TestSubmissionFacade testSubmissionFacade;
    private final UserService userService;
    private final StudentService studentService;

    public TestController(
            PracticeTestService practiceTestService,
            TestSubmissionFacade testSubmissionFacade,
            UserService userService,
            StudentService studentService
    ) {
        this.practiceTestService = practiceTestService;
        this.testSubmissionFacade = testSubmissionFacade;
        this.userService = userService;
        this.studentService = studentService;
    }

    @GetMapping
    public ResponseEntity<List<TestSummaryDto>> listTests() {
        return ResponseEntity.ok(practiceTestService.listTests());
    }

    @GetMapping("/{testId}")
    public ResponseEntity<TestDetailsDto> getTest(@PathVariable Long testId) {
        return ResponseEntity.ok(practiceTestService.getTestDetails(testId));
    }

    @PostMapping("/{testId}/submit")
    public ResponseEntity<TestResultDto> submitTest(
            @PathVariable Long testId,
            @RequestBody TestSubmissionDto submission
    ) {
        Long studentId = resolveAuthenticatedStudentId();
        TestResultDto result = testSubmissionFacade.submitTest(studentId, testId, submission);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/results")
    public ResponseEntity<List<TestResultDto>> getResults() {
        Long studentId = resolveAuthenticatedStudentId();
        return ResponseEntity.ok(practiceTestService.getResultsForStudent(studentId));
    }

    /**
     * Resolves the authenticated student's studentId from the session —
     * never from the request body. SecurityConfig requires an authenticated
     * Student for every /api/tests/** route, so by the time we reach here
     * Spring Security has already populated the SecurityContext.
     */
    private Long resolveAuthenticatedStudentId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        User user = userService.getUserByEmail(email)
                .orElseThrow(() -> new InvalidSubmissionException(
                        "Authenticated session references a user that no longer exists"));

        Student student = studentService.getStudentByUserId(user.getUserId())
                .orElseThrow(() -> new InvalidSubmissionException(
                        "Authenticated user is not a student"));

        return student.getStudentId();
    }
}