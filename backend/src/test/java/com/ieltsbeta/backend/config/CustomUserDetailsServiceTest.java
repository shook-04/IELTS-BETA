package com.ieltsbeta.backend.config;

import com.ieltsbeta.backend.entity.User;
import com.ieltsbeta.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CustomUserDetailsServiceTest {

    @Mock
    private UserRepository userRepository;

    private CustomUserDetailsService service;

    @BeforeEach
    void setUp() {
        service = new CustomUserDetailsService(userRepository);
    }

    @Test
    void loadUserByUsername_existingEmail_returnsUserDetailsWithRolePrefixedAuthority() {
        User user = new User();
        user.setEmail("teacher@example.com");
        user.setPasswordHash("hashed-password");
        user.setRole("Teacher");

        when(userRepository.findByEmail("teacher@example.com")).thenReturn(Optional.of(user));

        UserDetails details = service.loadUserByUsername("teacher@example.com");

        assertEquals("teacher@example.com", details.getUsername());
        assertEquals("hashed-password", details.getPassword());
        assertTrue(details.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_TEACHER")));
    }

    @Test
    void loadUserByUsername_roleIsUppercasedInAuthority() {
        User user = new User();
        user.setEmail("student@example.com");
        user.setPasswordHash("hashed");
        user.setRole("Student");

        when(userRepository.findByEmail("student@example.com")).thenReturn(Optional.of(user));

        UserDetails details = service.loadUserByUsername("student@example.com");

        assertTrue(details.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_STUDENT")));
    }

    @Test
    void loadUserByUsername_unknownEmail_throwsUsernameNotFoundException() {
        when(userRepository.findByEmail("ghost@example.com")).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class,
                () -> service.loadUserByUsername("ghost@example.com"));
    }

    @Test
    void loadUserByUsername_activeStatus_returnsEnabledUserDetailsWithRoleAuthority() {
        User user = new User();
        user.setEmail("active@example.com");
        user.setPasswordHash("hashed");
        user.setRole("Student");
        user.setStatus("Active");

        when(userRepository.findByEmail("active@example.com")).thenReturn(Optional.of(user));

        UserDetails details = service.loadUserByUsername("active@example.com");

        assertTrue(details.isEnabled());
        assertTrue(details.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_STUDENT")));
    }

    @Test
    void loadUserByUsername_suspendedStatus_returnsDisabledUserDetailsWithRoleAuthority() {
        User user = new User();
        user.setEmail("suspended@example.com");
        user.setPasswordHash("hashed");
        user.setRole("Student");
        user.setStatus("Suspended");

        when(userRepository.findByEmail("suspended@example.com")).thenReturn(Optional.of(user));

        UserDetails details = service.loadUserByUsername("suspended@example.com");

        assertFalse(details.isEnabled());
        assertTrue(details.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_STUDENT")));
    }
}