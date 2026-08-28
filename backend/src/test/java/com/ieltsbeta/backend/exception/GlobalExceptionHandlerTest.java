package com.ieltsbeta.backend.exception;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Verifies that each exception type currently handled by
 * {@link GlobalExceptionHandler} maps to the correct HTTP status and that
 * the response body carries the exception's message.
 * <p>
 * NOTE: {@code TestNotFoundException}, {@code InvalidSubmissionException},
 * and {@code UnsupportedTestCategoryException} do not currently have a
 * dedicated {@code @ExceptionHandler} in this class — only their existence
 * as exception types is exercised elsewhere (Facade/Service tests). This
 * test intentionally covers only the exceptions the handler actually
 * declares, per the "do not silently change production code" instruction.
 */
class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    void handleDuplicateEmail_returnsConflictWithMessage() {
        DuplicateEmailException ex = new DuplicateEmailException("Email already registered");

        ResponseEntity<Map<String, Object>> response = handler.handleDuplicateEmail(ex);

        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
        assertEquals("Email already registered", response.getBody().get("message"));
        assertEquals(409, response.getBody().get("status"));
        assertNotNull(response.getBody().get("timestamp"));
    }

    @Test
    void handleInvalidRegistration_returnsBadRequestWithMessage() {
        InvalidRegistrationException ex = new InvalidRegistrationException("Invalid role");

        ResponseEntity<Map<String, Object>> response = handler.handleInvalidRegistration(ex);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Invalid role", response.getBody().get("message"));
        assertEquals(400, response.getBody().get("status"));
    }

    @Test
    void handleInvalidCredentials_returnsUnauthorizedWithMessage() {
        InvalidCredentialsException ex = new InvalidCredentialsException("Invalid email or password");

        ResponseEntity<Map<String, Object>> response = handler.handleInvalidCredentials(ex);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("Invalid email or password", response.getBody().get("message"));
        assertEquals(401, response.getBody().get("status"));
    }

    @Test
    void allHandledResponses_includeErrorReasonPhrase() {
        ResponseEntity<Map<String, Object>> response =
                handler.handleDuplicateEmail(new DuplicateEmailException("x"));

        assertTrue(response.getBody().get("error").toString().length() > 0);
    }
}