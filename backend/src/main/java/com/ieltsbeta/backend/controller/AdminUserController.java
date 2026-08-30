package com.ieltsbeta.backend.controller;

import com.ieltsbeta.backend.dto.AdminUserDto;
import com.ieltsbeta.backend.service.AdminUserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Thin controller: every request delegates straight to
 * {@link AdminUserService}. SecurityConfig restricts every
 * /api/admin/** route to ROLE_ADMIN, and the acting admin's identity is
 * always resolved from the session here — never trusted from the request
 * body or path — mirroring the pattern already used in
 * {@code AuthController} and {@code TestController}.
 */
@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    private final AdminUserService adminUserService;

    public AdminUserController(AdminUserService adminUserService) {
        this.adminUserService = adminUserService;
    }

    @GetMapping
    public ResponseEntity<List<AdminUserDto>> listUsers() {
        return ResponseEntity.ok(adminUserService.getAllUsers());
    }

    @PutMapping("/{id}/suspend")
    public ResponseEntity<AdminUserDto> suspendUser(@PathVariable Long id) {
        AdminUserDto updated = adminUserService.suspendUser(id, resolveAuthenticatedAdminEmail());
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        adminUserService.deleteUser(id, resolveAuthenticatedAdminEmail());
        return ResponseEntity.noContent().build();
    }

    /**
     * Resolves the authenticated admin's email from the session — never
     * from the request body or path. SecurityConfig requires ROLE_ADMIN for
     * every /api/admin/** route, so by the time we reach here Spring
     * Security has already populated the SecurityContext with the admin's
     * identity.
     */
    private String resolveAuthenticatedAdminEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }
}