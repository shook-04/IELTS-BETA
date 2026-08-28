package com.ieltsbeta.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ieltsbeta.backend.dto.LoginRequest;
import com.ieltsbeta.backend.dto.RegistrationRequest;
import com.ieltsbeta.backend.entity.Person;
import com.ieltsbeta.backend.entity.Student;
import com.ieltsbeta.backend.entity.User;
import com.ieltsbeta.backend.exception.DuplicateEmailException;
import com.ieltsbeta.backend.exception.GlobalExceptionHandler;
import com.ieltsbeta.backend.exception.InvalidCredentialsException;
import com.ieltsbeta.backend.service.AuthService;
import com.ieltsbeta.backend.service.StudentService;
import com.ieltsbeta.backend.service.UserService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Standalone MockMvc tests for {@link AuthController}. Uses
 * {@code standaloneSetup} (rather than {@code @WebMvcTest}) so the test
 * never needs a Spring context, the security filter chain, or a database —
 * only the real controller wired to mocked services, exactly like a plain
 * unit test. {@link GlobalExceptionHandler} is registered as controller
 * advice so error responses match production behavior.
 */
@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock private AuthService authService;
    @Mock private UserService userService;
    @Mock private StudentService studentService;

    private MockMvc mockMvc;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        AuthController controller = new AuthController(authService, userService, studentService);
        mockMvc = MockMvcBuilders.standaloneSetup(controller)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void register_success_returnsOkWithRegistrationResponse() throws Exception {
        RegistrationRequest request = new RegistrationRequest();
        request.setRole("Student");
        request.setEmail("ada@example.com");

        User savedUser = new User();
        savedUser.setUserId(1L);
        savedUser.setEmail("ada@example.com");
        savedUser.setRole("Student");

        when(authService.register(any(RegistrationRequest.class))).thenReturn(savedUser);

        mockMvc.perform(post("/api/auth/register")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value(1))
                .andExpect(jsonPath("$.email").value("ada@example.com"))
                .andExpect(jsonPath("$.role").value("Student"))
                .andExpect(jsonPath("$.message").value("Registration successful"));
    }

    @Test
    void register_duplicateEmail_returnsConflict() throws Exception {
        RegistrationRequest request = new RegistrationRequest();
        request.setEmail("ada@example.com");

        when(authService.register(any(RegistrationRequest.class)))
                .thenThrow(new DuplicateEmailException("Email already registered"));

        mockMvc.perform(post("/api/auth/register")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("Email already registered"));
    }

    @Test
    void login_success_returnsOkWithLoginResponse() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setEmail("ada@example.com");
        request.setPassword("Secret123");

        User user = new User();
        user.setUserId(1L);
        user.setEmail("ada@example.com");
        user.setRole("Student");

        when(authService.login(any(LoginRequest.class), any())).thenReturn(user);

        mockMvc.perform(post("/api/auth/login")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value(1))
                .andExpect(jsonPath("$.message").value("Login successful"));
    }

    @Test
    void login_invalidCredentials_returnsUnauthorized() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setEmail("ada@example.com");
        request.setPassword("wrong");

        when(authService.login(any(LoginRequest.class), any()))
                .thenThrow(new InvalidCredentialsException("Invalid email or password"));

        mockMvc.perform(post("/api/auth/login")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Invalid email or password"));
    }

    @Test
    void me_authenticatedStudent_includesBandAndDaysActive() throws Exception {
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                "ada@example.com", null, List.of());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = new User();
        user.setUserId(1L);
        user.setEmail("ada@example.com");
        user.setRole("Student");
        Person person = new Person();
        person.setFirstName("Ada");
        person.setLastName("Lovelace");
        user.setPerson(person);

        Student student = new Student();
        student.setTargetBand(new BigDecimal("7.5"));
        student.setCurrentBand(new BigDecimal("6.0"));
        student.setDaysActive(12);

        when(userService.getUserByEmail("ada@example.com")).thenReturn(Optional.of(user));
        when(studentService.getStudentByUserId(1L)).thenReturn(Optional.of(student));

        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("ada@example.com"))
                .andExpect(jsonPath("$.firstName").value("Ada"))
                .andExpect(jsonPath("$.targetBand").value(7.5))
                .andExpect(jsonPath("$.daysActive").value(12));
    }

    @Test
    void me_authenticatedNonStudent_bandFieldsAreNull() throws Exception {
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                "teacher@example.com", null, List.of());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = new User();
        user.setUserId(2L);
        user.setEmail("teacher@example.com");
        user.setRole("Teacher");
        Person person = new Person();
        person.setFirstName("Grace");
        person.setLastName("Hopper");
        user.setPerson(person);

        when(userService.getUserByEmail("teacher@example.com")).thenReturn(Optional.of(user));

        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role").value("Teacher"))
                .andExpect(jsonPath("$.targetBand").doesNotExist());
    }

    @Test
    void logout_noExistingSession_stillReturnsOk() throws Exception {
        mockMvc.perform(post("/api/auth/logout"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Logout successful"));
    }

    @Test
    void logout_clearsSecurityContext() throws Exception {
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                "ada@example.com", null, List.of());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        mockMvc.perform(post("/api/auth/logout").session(new MockHttpSession()))
                .andExpect(status().isOk());

        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }
}