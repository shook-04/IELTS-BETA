package com.ieltsbeta.backend.service;

import com.ieltsbeta.backend.dto.LoginRequest;
import com.ieltsbeta.backend.dto.RegistrationRequest;
import com.ieltsbeta.backend.entity.Admin;
import com.ieltsbeta.backend.entity.Person;
import com.ieltsbeta.backend.entity.Student;
import com.ieltsbeta.backend.entity.Teacher;
import com.ieltsbeta.backend.entity.User;
import com.ieltsbeta.backend.exception.DuplicateEmailException;
import com.ieltsbeta.backend.exception.InvalidCredentialsException;
import com.ieltsbeta.backend.exception.InvalidRegistrationException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.format.DateTimeParseException;

@Service
public class AuthService {

    private final PersonService personService;
    private final UserService userService;
    private final StudentService studentService;
    private final TeacherService teacherService;
    private final AdminService adminService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public AuthService(
            PersonService personService,
            UserService userService,
            StudentService studentService,
            TeacherService teacherService,
            AdminService adminService,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager
    ) {
        this.personService = personService;
        this.userService = userService;
        this.studentService = studentService;
        this.teacherService = teacherService;
        this.adminService = adminService;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }

    public User register(RegistrationRequest request) {

        // 1. Validate role
        String role = request.getRole();
        if (role == null ||
                !(role.equals("Student") || role.equals("Teacher") || role.equals("Admin"))) {
            throw new InvalidRegistrationException("Invalid role: must be Student, Teacher, or Admin");
        }

        // 2. Validate email uniqueness
        if (userService.emailExists(request.getEmail())) {
            throw new DuplicateEmailException("Email already registered");
        }

        // 3. Validate password confirmation
        if (request.getPassword() == null ||
                !request.getPassword().equals(request.getConfirmPassword())) {
            throw new InvalidRegistrationException("Password and confirm password do not match");
        }

        // 4. Validate role-specific required fields before writing anything
        if (role.equals("Student") && request.getTargetBand() == null) {
            throw new InvalidRegistrationException("Target IELTS band is required for Student registration");
        }

        // 5. Parse date of birth (required, must be valid ISO date)
        LocalDate dateOfBirth;
        try {
            dateOfBirth = LocalDate.parse(request.getDateOfBirth());
        } catch (DateTimeParseException | NullPointerException e) {
            throw new InvalidRegistrationException("Date of birth is required and must be a valid date");
        }

        // 6. Create and save Person
        Person person = new Person();
        person.setFirstName(request.getFirstName());
        person.setLastName(request.getLastName());
        person.setDateOfBirth(dateOfBirth);
        person.setGender(request.getGender());
        person.setPhone(request.getPhone());

        Person savedPerson = personService.savePerson(person);

        // 7. Create and save User
        User user = new User();
        user.setPerson(savedPerson);
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);
        user.setCreatedAt(OffsetDateTime.now());

        User savedUser = userService.saveUser(user);

        // 8. Create role-specific record
        switch (role) {
            case "Student" -> {
                Student student = new Student();
                student.setUser(savedUser);
                student.setTargetBand(request.getTargetBand());
                student.setDaysActive(0);
                studentService.saveStudent(student);
            }
            case "Teacher" -> {
                Teacher teacher = new Teacher();
                teacher.setUser(savedUser);
                teacher.setSpecialization(request.getSpecialization());
                teacherService.saveTeacher(teacher);
            }
            case "Admin" -> {
                Admin admin = new Admin();
                admin.setUser(savedUser);
                adminService.saveAdmin(admin);
            }
        }

        return savedUser;
    }

    public User login(LoginRequest request, HttpServletRequest httpRequest) {

        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
        } catch (BadCredentialsException e) {
            throw new InvalidCredentialsException("Invalid email or password");
        } catch (DisabledException e) {
            // Thrown by AuthenticationManager when CustomUserDetailsService
            // returns a disabled UserDetails (status != "Active"). Reuses
            // the same generic message as bad credentials, so a suspended
            // account is not distinguishable from a wrong password to the
            // client.
            throw new InvalidCredentialsException("Invalid email or password");
        }

        // Bind the authenticated identity to the HTTP session so the
        // session cookie sent back to the browser represents a logged-in user.
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);

        httpRequest.getSession(true).setAttribute(
                HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
                context
        );

        // authenticationManager already confirmed the email exists (via
        // CustomUserDetailsService), so this lookup will not be empty.
        return userService.getUserByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));
    }
}