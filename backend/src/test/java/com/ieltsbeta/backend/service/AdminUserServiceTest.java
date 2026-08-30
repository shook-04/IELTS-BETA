package com.ieltsbeta.backend.service;

import com.ieltsbeta.backend.dto.AdminUserDto;
import com.ieltsbeta.backend.entity.Person;
import com.ieltsbeta.backend.entity.Student;
import com.ieltsbeta.backend.entity.User;
import com.ieltsbeta.backend.exception.AdminSelfActionException;
import com.ieltsbeta.backend.exception.UserNotFoundException;
import com.ieltsbeta.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.lang.reflect.Field;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AdminUserServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private StudentService studentService;

    private AdminUserService adminUserService;

    @BeforeEach
    void setUp() {
        adminUserService = new AdminUserService(userRepository, studentService);
    }

    private User buildUser(Long id, String email, String role, String status) {
        User user = new User();
        user.setUserId(id);
        user.setEmail(email);
        user.setRole(role);
        user.setStatus(status);
        user.setCreatedAt(OffsetDateTime.now());
        user.setPasswordHash("irrelevant-hash-" + id);

        Person person = new Person();
        person.setFirstName("First" + id);
        person.setLastName("Last" + id);
        user.setPerson(person);

        return user;
    }

    // ----- getAllUsers() -----

    @Test
    void getAllUsers_studentUser_populatesTargetBandCurrentBandAndDaysActive() {
        User student = buildUser(1L, "student@example.com", "Student", "Active");
        when(userRepository.findAll()).thenReturn(List.of(student));

        Student studentEntity = new Student();
        studentEntity.setTargetBand(new BigDecimal("7.5"));
        studentEntity.setCurrentBand(new BigDecimal("6.0"));
        studentEntity.setDaysActive(20);
        when(studentService.getStudentByUserId(1L)).thenReturn(Optional.of(studentEntity));

        List<AdminUserDto> result = adminUserService.getAllUsers();

        assertEquals(1, result.size());
        AdminUserDto dto = result.get(0);
        assertEquals(new BigDecimal("7.5"), dto.getTargetBand());
        assertEquals(new BigDecimal("6.0"), dto.getCurrentBand());
        assertEquals(20, dto.getDaysActive());
    }

    @Test
    void getAllUsers_nonStudentUser_leavesStudentSpecificFieldsNull() {
        User teacher = buildUser(2L, "teacher@example.com", "Teacher", "Active");
        when(userRepository.findAll()).thenReturn(List.of(teacher));

        AdminUserDto dto = adminUserService.getAllUsers().get(0);

        assertNull(dto.getTargetBand());
        assertNull(dto.getCurrentBand());
        assertNull(dto.getDaysActive());
        verify(studentService, never()).getStudentByUserId(any());
    }

    @Test
    void getAllUsers_studentWithNoStudentRecordYet_leavesFieldsNullInsteadOfThrowing() {
        User student = buildUser(11L, "orphan@example.com", "Student", "Active");
        when(userRepository.findAll()).thenReturn(List.of(student));
        when(studentService.getStudentByUserId(11L)).thenReturn(Optional.empty());

        AdminUserDto dto = adminUserService.getAllUsers().get(0);

        assertNull(dto.getTargetBand());
        assertNull(dto.getDaysActive());
    }

    @Test
    void getAllUsers_mapsCoreFieldsForEveryUser() {
        User user = buildUser(4L, "person@example.com", "Teacher", "Suspended");
        when(userRepository.findAll()).thenReturn(List.of(user));

        AdminUserDto dto = adminUserService.getAllUsers().get(0);

        assertEquals(4L, dto.getUserId());
        assertEquals("First4", dto.getFirstName());
        assertEquals("Last4", dto.getLastName());
        assertEquals("person@example.com", dto.getEmail());
        assertEquals("Teacher", dto.getRole());
        assertEquals("Suspended", dto.getStatus());
        assertNotNull(dto.getCreatedAt());
    }

    @Test
    void getAllUsers_doesNotExposePasswordHash() {
        // AdminUserDto structurally has no passwordHash field/getter at all,
        // so there is nothing for getAllUsers() to ever leak. This test
        // documents that guarantee rather than re-testing the mapping.
        boolean hasPasswordField = Arrays.stream(AdminUserDto.class.getDeclaredFields())
                .map(Field::getName)
                .anyMatch(name -> name.toLowerCase().contains("password"));

        assertFalse(hasPasswordField);
    }

    // ----- suspendUser() -----

    @Test
    void suspendUser_activeUser_setsStatusToSuspendedAndSaves() {
        User target = buildUser(5L, "target@example.com", "Student", "Active");
        User admin = buildUser(99L, "admin@example.com", "Admin", "Active");

        when(userRepository.findById(5L)).thenReturn(Optional.of(target));
        when(userRepository.findByEmail("admin@example.com")).thenReturn(Optional.of(admin));
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        AdminUserDto result = adminUserService.suspendUser(5L, "admin@example.com");

        assertEquals("Suspended", result.getStatus());

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());
        assertEquals("Suspended", captor.getValue().getStatus());
    }

    @Test
    void suspendUser_alreadySuspended_isIdempotentAndDoesNotSaveAgain() {
        User target = buildUser(6L, "target@example.com", "Student", "Suspended");
        User admin = buildUser(99L, "admin@example.com", "Admin", "Active");

        when(userRepository.findById(6L)).thenReturn(Optional.of(target));
        when(userRepository.findByEmail("admin@example.com")).thenReturn(Optional.of(admin));

        AdminUserDto result = adminUserService.suspendUser(6L, "admin@example.com");

        assertEquals("Suspended", result.getStatus());
        verify(userRepository, never()).save(any());
    }

    @Test
    void suspendUser_userNotFound_throwsUserNotFoundException() {
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class,
                () -> adminUserService.suspendUser(999L, "admin@example.com"));

        verify(userRepository, never()).save(any());
    }

    @Test
    void suspendUser_adminTargetsSelf_throwsAdminSelfActionExceptionAndDoesNotSave() {
        User admin = buildUser(7L, "admin@example.com", "Admin", "Active");

        when(userRepository.findById(7L)).thenReturn(Optional.of(admin));
        when(userRepository.findByEmail("admin@example.com")).thenReturn(Optional.of(admin));

        assertThrows(AdminSelfActionException.class,
                () -> adminUserService.suspendUser(7L, "admin@example.com"));

        verify(userRepository, never()).save(any());
    }

    // ----- deleteUser() -----

    @Test
    void deleteUser_existingUser_callsDeleteById() {
        User target = buildUser(8L, "target@example.com", "Student", "Active");
        User admin = buildUser(99L, "admin@example.com", "Admin", "Active");

        when(userRepository.findById(8L)).thenReturn(Optional.of(target));
        when(userRepository.findByEmail("admin@example.com")).thenReturn(Optional.of(admin));

        adminUserService.deleteUser(8L, "admin@example.com");

        verify(userRepository).deleteById(8L);
    }

    @Test
    void deleteUser_userNotFound_throwsUserNotFoundExceptionAndNeverDeletes() {
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class,
                () -> adminUserService.deleteUser(999L, "admin@example.com"));

        verify(userRepository, never()).deleteById(any());
    }

    @Test
    void deleteUser_adminTargetsSelf_throwsAdminSelfActionExceptionAndNeverDeletes() {
        User admin = buildUser(9L, "admin@example.com", "Admin", "Active");

        when(userRepository.findById(9L)).thenReturn(Optional.of(admin));
        when(userRepository.findByEmail("admin@example.com")).thenReturn(Optional.of(admin));

        assertThrows(AdminSelfActionException.class,
                () -> adminUserService.deleteUser(9L, "admin@example.com"));

        verify(userRepository, never()).deleteById(any());
    }

    @Test
    void deleteUser_reliesOnCascadeOnly_neverQueriesStudentService() {
        User target = buildUser(10L, "target@example.com", "Student", "Active");
        User admin = buildUser(99L, "admin@example.com", "Admin", "Active");

        when(userRepository.findById(10L)).thenReturn(Optional.of(target));
        when(userRepository.findByEmail("admin@example.com")).thenReturn(Optional.of(admin));

        adminUserService.deleteUser(10L, "admin@example.com");

        // AdminUserService only depends on UserRepository and StudentService
        // (for listing). It has no reference to StudentRepository,
        // TeacherRepository, PersonRepository, etc., so deletion cannot
        // manually cascade -- it relies entirely on the database's existing
        // ON DELETE CASCADE relationships. This test documents that no
        // student-specific lookup happens as part of delete.
        verify(studentService, never()).getStudentByUserId(any());
        verify(userRepository).deleteById(10L);
    }
}