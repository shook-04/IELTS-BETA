package com.ieltsbeta.backend.service;

import com.ieltsbeta.backend.dto.LoginRequest;
import com.ieltsbeta.backend.dto.RegistrationRequest;
import com.ieltsbeta.backend.entity.Person;
import com.ieltsbeta.backend.entity.User;
import com.ieltsbeta.backend.exception.DuplicateEmailException;
import com.ieltsbeta.backend.exception.InvalidCredentialsException;
import com.ieltsbeta.backend.exception.InvalidRegistrationException;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private PersonService personService;
    @Mock private UserService userService;
    @Mock private StudentService studentService;
    @Mock private TeacherService teacherService;
    @Mock private AdminService adminService;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private AuthenticationManager authenticationManager;

    private AuthService authService;

    @BeforeEach
    void setUp() {
        authService = new AuthService(
                personService, userService, studentService, teacherService, adminService,
                passwordEncoder, authenticationManager
        );
    }

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    private RegistrationRequest validStudentRequest() {
        RegistrationRequest request = new RegistrationRequest();
        request.setRole("Student");
        request.setFirstName("Ada");
        request.setLastName("Lovelace");
        request.setEmail("ada@example.com");
        request.setPhone("12345");
        request.setDateOfBirth("2000-01-01");
        request.setGender("Female");
        request.setPassword("Secret123");
        request.setConfirmPassword("Secret123");
        request.setTargetBand(new BigDecimal("7.5"));
        return request;
    }

    // ----- register(): validation branches -----

    @Test
    void register_invalidRole_throwsInvalidRegistrationException() {
        RegistrationRequest request = validStudentRequest();
        request.setRole("SuperAdmin");

        assertThrows(InvalidRegistrationException.class, () -> authService.register(request));
    }

    @Test
    void register_nullRole_throwsInvalidRegistrationException() {
        RegistrationRequest request = validStudentRequest();
        request.setRole(null);

        assertThrows(InvalidRegistrationException.class, () -> authService.register(request));
    }

    @Test
    void register_duplicateEmail_throwsDuplicateEmailException() {
        RegistrationRequest request = validStudentRequest();
        when(userService.emailExists(request.getEmail())).thenReturn(true);

        assertThrows(DuplicateEmailException.class, () -> authService.register(request));
    }

    @Test
    void register_passwordMismatch_throwsInvalidRegistrationException() {
        RegistrationRequest request = validStudentRequest();
        request.setConfirmPassword("Different123");
        when(userService.emailExists(request.getEmail())).thenReturn(false);

        assertThrows(InvalidRegistrationException.class, () -> authService.register(request));
    }

    @Test
    void register_nullPassword_throwsInvalidRegistrationException() {
        RegistrationRequest request = validStudentRequest();
        request.setPassword(null);
        when(userService.emailExists(request.getEmail())).thenReturn(false);

        assertThrows(InvalidRegistrationException.class, () -> authService.register(request));
    }

    @Test
    void register_studentMissingTargetBand_throwsInvalidRegistrationException() {
        RegistrationRequest request = validStudentRequest();
        request.setTargetBand(null);
        when(userService.emailExists(request.getEmail())).thenReturn(false);

        assertThrows(InvalidRegistrationException.class, () -> authService.register(request));
    }

    @Test
    void register_invalidDateOfBirth_throwsInvalidRegistrationException() {
        RegistrationRequest request = validStudentRequest();
        request.setDateOfBirth("not-a-date");
        when(userService.emailExists(request.getEmail())).thenReturn(false);

        assertThrows(InvalidRegistrationException.class, () -> authService.register(request));
    }

    @Test
    void register_nullDateOfBirth_throwsInvalidRegistrationException() {
        RegistrationRequest request = validStudentRequest();
        request.setDateOfBirth(null);
        when(userService.emailExists(request.getEmail())).thenReturn(false);

        assertThrows(InvalidRegistrationException.class, () -> authService.register(request));
    }

    // ----- register(): happy paths per role -----

    @Test
    void register_validStudent_savesPersonUserAndStudent() {
        RegistrationRequest request = validStudentRequest();
        Person savedPerson = new Person();
        savedPerson.setPersonId(1L);
        User savedUser = new User();
        savedUser.setUserId(2L);
        savedUser.setEmail(request.getEmail());
        savedUser.setRole("Student");

        when(userService.emailExists(request.getEmail())).thenReturn(false);
        when(personService.savePerson(any(Person.class))).thenReturn(savedPerson);
        when(passwordEncoder.encode(request.getPassword())).thenReturn("hashed-password");
        when(userService.saveUser(any(User.class))).thenReturn(savedUser);

        User result = authService.register(request);

        assertEquals(savedUser, result);
        verify(personService).savePerson(any(Person.class));
        verify(userService).saveUser(any(User.class));
        verify(studentService).saveStudent(any());
        verify(teacherService, never()).saveTeacher(any());
        verify(adminService, never()).saveAdmin(any());
    }

    @Test
    void register_validStudent_hashesPasswordBeforeSaving() {
        RegistrationRequest request = validStudentRequest();
        when(userService.emailExists(request.getEmail())).thenReturn(false);
        when(personService.savePerson(any(Person.class))).thenReturn(new Person());
        when(passwordEncoder.encode("Secret123")).thenReturn("hashed-password");
        when(userService.saveUser(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        authService.register(request);

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userService).saveUser(captor.capture());
        assertEquals("hashed-password", captor.getValue().getPasswordHash());
    }

    @Test
    void register_validTeacher_savesTeacherNotStudent() {
        RegistrationRequest request = validStudentRequest();
        request.setRole("Teacher");
        request.setTargetBand(null); // not required for teachers
        request.setSpecialization("Writing");

        when(userService.emailExists(request.getEmail())).thenReturn(false);
        when(personService.savePerson(any(Person.class))).thenReturn(new Person());
        when(passwordEncoder.encode(anyString())).thenReturn("hashed");
        when(userService.saveUser(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        authService.register(request);

        verify(teacherService).saveTeacher(any());
        verify(studentService, never()).saveStudent(any());
        verify(adminService, never()).saveAdmin(any());
    }

    @Test
    void register_validAdmin_savesAdminNotStudent() {
        RegistrationRequest request = validStudentRequest();
        request.setRole("Admin");
        request.setTargetBand(null);

        when(userService.emailExists(request.getEmail())).thenReturn(false);
        when(personService.savePerson(any(Person.class))).thenReturn(new Person());
        when(passwordEncoder.encode(anyString())).thenReturn("hashed");
        when(userService.saveUser(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        authService.register(request);

        verify(adminService).saveAdmin(any());
        verify(studentService, never()).saveStudent(any());
        verify(teacherService, never()).saveTeacher(any());
    }

    // ----- login() -----

    @Test
    void login_badCredentials_throwsInvalidCredentialsException() {
        LoginRequest request = new LoginRequest();
        request.setEmail("ada@example.com");
        request.setPassword("wrong-password");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("bad creds"));

        MockHttpServletRequest httpRequest = new MockHttpServletRequest();

        assertThrows(InvalidCredentialsException.class, () -> authService.login(request, httpRequest));
    }

    @Test
    void login_validCredentials_bindsSecurityContextToSessionAndReturnsUser() {
        LoginRequest request = new LoginRequest();
        request.setEmail("ada@example.com");
        request.setPassword("correct-password");

        Authentication authentication = new UsernamePasswordAuthenticationToken(
                "ada@example.com", null, List.of());
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);

        User existingUser = new User();
        existingUser.setUserId(1L);
        existingUser.setEmail("ada@example.com");
        when(userService.getUserByEmail("ada@example.com")).thenReturn(Optional.of(existingUser));

        MockHttpServletRequest httpRequest = new MockHttpServletRequest();

        User result = authService.login(request, httpRequest);

        assertEquals(existingUser, result);
        assertNotNull(httpRequest.getSession(false));
        assertNotNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    void login_userVanishesAfterAuthentication_throwsInvalidCredentialsException() {
        // Defensive branch: authenticationManager succeeded, but the user
        // lookup by email afterwards comes back empty.
        LoginRequest request = new LoginRequest();
        request.setEmail("ghost@example.com");
        request.setPassword("whatever");

        Authentication authentication = new UsernamePasswordAuthenticationToken(
                "ghost@example.com", null, List.of());
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(userService.getUserByEmail("ghost@example.com")).thenReturn(Optional.empty());

        MockHttpServletRequest httpRequest = new MockHttpServletRequest();

        assertThrows(InvalidCredentialsException.class, () -> authService.login(request, httpRequest));
    }
}