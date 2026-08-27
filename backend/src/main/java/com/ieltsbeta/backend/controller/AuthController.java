package com.ieltsbeta.backend.controller;

import com.ieltsbeta.backend.dto.LoginRequest;
import com.ieltsbeta.backend.dto.LoginResponse;
import com.ieltsbeta.backend.dto.MeResponse;
import com.ieltsbeta.backend.dto.RegistrationRequest;
import com.ieltsbeta.backend.dto.RegistrationResponse;
import com.ieltsbeta.backend.entity.Student;
import com.ieltsbeta.backend.entity.User;
import com.ieltsbeta.backend.service.AuthService;
import com.ieltsbeta.backend.service.StudentService;
import com.ieltsbeta.backend.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;
    private final StudentService studentService;

    public AuthController(
            AuthService authService,
            UserService userService,
            StudentService studentService
    ) {
        this.authService = authService;
        this.userService = userService;
        this.studentService = studentService;
    }

    @PostMapping("/register")
    public ResponseEntity<RegistrationResponse> register(
            @RequestBody RegistrationRequest request
    ) {

        User user = authService.register(request);

        RegistrationResponse response = new RegistrationResponse(
                "Registration successful",
                user.getUserId(),
                user.getEmail(),
                user.getRole()
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest request,
            HttpServletRequest httpRequest
    ) {

        User user = authService.login(request, httpRequest);

        LoginResponse response = new LoginResponse(
                "Login successful",
                user.getUserId(),
                user.getEmail(),
                user.getRole()
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<MeResponse> me() {

        // SecurityConfig requires authentication for this endpoint, so if we
        // get here Spring Security has already loaded the SecurityContext
        // from the session cookie and populated an authenticated principal.
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        User user = userService.getUserByEmail(email)
                .orElseThrow(() -> new IllegalStateException(
                        "Authenticated session references a user that no longer exists"));

        BigDecimal targetBand = null;
        BigDecimal currentBand = null;
        Integer daysActive = null;

        if ("Student".equals(user.getRole())) {
            Optional<Student> student = studentService.getStudentByUserId(user.getUserId());
            if (student.isPresent()) {
                targetBand = student.get().getTargetBand();
                currentBand = student.get().getCurrentBand();
                daysActive = student.get().getDaysActive();
            }
        }

        MeResponse response = new MeResponse(
                user.getUserId(),
                user.getEmail(),
                user.getRole(),
                user.getPerson().getFirstName(),
                user.getPerson().getLastName(),
                targetBand,
                currentBand,
                daysActive
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpServletRequest httpRequest) {

        HttpSession session = httpRequest.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        SecurityContextHolder.clearContext();

        return ResponseEntity.ok(Map.of("message", "Logout successful"));
    }
}