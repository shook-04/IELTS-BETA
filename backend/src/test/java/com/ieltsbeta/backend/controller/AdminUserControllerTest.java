package com.ieltsbeta.backend.controller;

import com.ieltsbeta.backend.dto.AdminUserDto;
import com.ieltsbeta.backend.exception.AdminSelfActionException;
import com.ieltsbeta.backend.exception.GlobalExceptionHandler;
import com.ieltsbeta.backend.exception.UserNotFoundException;
import com.ieltsbeta.backend.service.AdminUserService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.OffsetDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Standalone MockMvc tests for {@link AdminUserController}. As with
 * {@code AuthControllerTest} and {@code TestControllerTest}, standaloneSetup
 * means no Spring context, security filter chain, or database is involved —
 * only the real controller wired to a mocked {@link AdminUserService}.
 * {@link GlobalExceptionHandler} is registered as controller advice so error
 * responses match production behavior.
 * <p>
 * IMPORTANT: because the real {@code SecurityFilterChain} (and therefore the
 * {@code hasRole("ADMIN")} rule that now guards /api/admin/**) is never
 * exercised by standaloneSetup, these tests do NOT verify that a Student,
 * Teacher, or unauthenticated request is actually rejected before reaching
 * the controller. That gap is called out separately for the project owner —
 * see the Increment 4 write-up.
 */
@ExtendWith(MockitoExtension.class)
class AdminUserControllerTest {

    @Mock private AdminUserService adminUserService;

    private MockMvc mockMvc;

    private static final Long USER_ID = 5L;

    @BeforeEach
    void setUp() {
        AdminUserController controller = new AdminUserController(adminUserService);
        mockMvc = MockMvcBuilders.standaloneSetup(controller)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    private void authenticateAsAdmin(String email) {
        Authentication authentication = new UsernamePasswordAuthenticationToken(email, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    private AdminUserDto sampleDto(Long userId, String status) {
        return new AdminUserDto(
                userId, "Ada", "Lovelace", "ada@example.com", "Student", status,
                OffsetDateTime.now(), null, null, null);
    }

    @Test
    void listUsers_returnsOkWithUserList() throws Exception {
        when(adminUserService.getAllUsers()).thenReturn(List.of(sampleDto(USER_ID, "Active")));

        mockMvc.perform(get("/api/admin/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].userId").value(USER_ID))
                .andExpect(jsonPath("$[0].status").value("Active"));
    }

    @Test
    void suspendUser_success_returnsOkWithUpdatedStatus() throws Exception {
        authenticateAsAdmin("admin@example.com");
        when(adminUserService.suspendUser(USER_ID, "admin@example.com"))
                .thenReturn(sampleDto(USER_ID, "Suspended"));

        mockMvc.perform(put("/api/admin/users/{id}/suspend", USER_ID))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("Suspended"));

        verify(adminUserService).suspendUser(USER_ID, "admin@example.com");
    }

    @Test
    void suspendUser_takesAdminEmailFromSecurityContext_notFromRequest() throws Exception {
        authenticateAsAdmin("real-admin@example.com");
        when(adminUserService.suspendUser(eq(USER_ID), anyString()))
                .thenReturn(sampleDto(USER_ID, "Suspended"));

        mockMvc.perform(put("/api/admin/users/{id}/suspend", USER_ID))
                .andExpect(status().isOk());

        ArgumentCaptor<String> emailCaptor = ArgumentCaptor.forClass(String.class);
        verify(adminUserService).suspendUser(eq(USER_ID), emailCaptor.capture());
        assertEquals("real-admin@example.com", emailCaptor.getValue());
    }

    @Test
    void suspendUser_userNotFound_returnsNotFound() throws Exception {
        authenticateAsAdmin("admin@example.com");
        when(adminUserService.suspendUser(USER_ID, "admin@example.com"))
                .thenThrow(new UserNotFoundException("No user found with ID: " + USER_ID));

        mockMvc.perform(put("/api/admin/users/{id}/suspend", USER_ID))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("No user found with ID: " + USER_ID));
    }

    @Test
    void suspendUser_adminSelfAction_returnsBadRequest() throws Exception {
        authenticateAsAdmin("admin@example.com");
        when(adminUserService.suspendUser(USER_ID, "admin@example.com"))
                .thenThrow(new AdminSelfActionException("Admins cannot suspend their own account"));

        mockMvc.perform(put("/api/admin/users/{id}/suspend", USER_ID))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Admins cannot suspend their own account"));
    }

    @Test
    void deleteUser_success_returnsNoContent() throws Exception {
        authenticateAsAdmin("admin@example.com");

        mockMvc.perform(delete("/api/admin/users/{id}", USER_ID))
                .andExpect(status().isNoContent());

        verify(adminUserService).deleteUser(USER_ID, "admin@example.com");
    }

    @Test
    void deleteUser_userNotFound_returnsNotFound() throws Exception {
        authenticateAsAdmin("admin@example.com");
        doThrow(new UserNotFoundException("No user found with ID: " + USER_ID))
                .when(adminUserService).deleteUser(USER_ID, "admin@example.com");

        mockMvc.perform(delete("/api/admin/users/{id}", USER_ID))
                .andExpect(status().isNotFound());
    }

    @Test
    void deleteUser_adminSelfAction_returnsBadRequest() throws Exception {
        authenticateAsAdmin("admin@example.com");
        doThrow(new AdminSelfActionException("Admins cannot delete their own account"))
                .when(adminUserService).deleteUser(USER_ID, "admin@example.com");

        mockMvc.perform(delete("/api/admin/users/{id}", USER_ID))
                .andExpect(status().isBadRequest());
    }
}