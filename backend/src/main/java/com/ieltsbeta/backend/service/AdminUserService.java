package com.ieltsbeta.backend.service;

import com.ieltsbeta.backend.dto.AdminUserDto;
import com.ieltsbeta.backend.entity.Student;
import com.ieltsbeta.backend.entity.User;
import com.ieltsbeta.backend.exception.AdminSelfActionException;
import com.ieltsbeta.backend.exception.UserNotFoundException;
import com.ieltsbeta.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class AdminUserService {

    private static final String STATUS_SUSPENDED = "Suspended";

    private final UserRepository userRepository;
    private final StudentService studentService;

    public AdminUserService(UserRepository userRepository, StudentService studentService) {
        this.userRepository = userRepository;
        this.studentService = studentService;
    }

    /**
     * Returns every user in the system as an {@link AdminUserDto}, for the
     * Admin User Management list.
     */
    public List<AdminUserDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::toDto)
                .toList();
    }

    /**
     * Suspends the user identified by {@code userId}.
     * <p>
     * {@code actingAdminEmail} is the email of the currently authenticated
     * admin, resolved by the controller from the Spring Security session
     * (the same pattern {@code AuthController.me()} already uses) — never a
     * client-supplied ID. This is what makes the self-suspend check safe
     * against a malicious/incorrect ID sent from the frontend.
     */
    public AdminUserDto suspendUser(Long userId, String actingAdminEmail) {
        User target = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("No user found with ID: " + userId));

        User actingAdmin = resolveActingAdmin(actingAdminEmail);

        if (target.getUserId().equals(actingAdmin.getUserId())) {
            throw new AdminSelfActionException("Admins cannot suspend their own account");
        }

        if (!STATUS_SUSPENDED.equals(target.getStatus())) {
            target.setStatus(STATUS_SUSPENDED);
            target = userRepository.save(target);
        }
        // Already suspended: treated as a no-op, so suspending twice is
        // harmless and returns the current (already-suspended) state.

        return toDto(target);
    }

    /**
     * Permanently deletes the user identified by {@code userId}.
     * <p>
     * Relies entirely on the database's existing {@code ON DELETE CASCADE}
     * relationships (students/teachers/admins -> users -> person, and
     * everything beneath them) — no dependent rows are deleted manually
     * here.
     * <p>
     * {@code actingAdminEmail} is resolved the same way as in
     * {@link #suspendUser(Long, String)}.
     */
    public void deleteUser(Long userId, String actingAdminEmail) {
        User target = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("No user found with ID: " + userId));

        User actingAdmin = resolveActingAdmin(actingAdminEmail);

        if (target.getUserId().equals(actingAdmin.getUserId())) {
            throw new AdminSelfActionException("Admins cannot delete their own account");
        }

        userRepository.deleteById(userId);
    }

    private User resolveActingAdmin(String actingAdminEmail) {
        return userRepository.findByEmail(actingAdminEmail)
                .orElseThrow(() -> new IllegalStateException(
                        "Authenticated session references a user that no longer exists"));
    }

    private AdminUserDto toDto(User user) {

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

        return new AdminUserDto(
                user.getUserId(),
                user.getPerson().getFirstName(),
                user.getPerson().getLastName(),
                user.getEmail(),
                user.getRole(),
                user.getStatus(),
                user.getCreatedAt(),
                targetBand,
                currentBand,
                daysActive
        );
    }
}