package com.ieltsbeta.backend.config;

import com.ieltsbeta.backend.controller.AdminUserController;
import com.ieltsbeta.backend.service.AdminUserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.webmvc.test.autoconfigure.MockMvcBuilderCustomizer;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Verifies the REAL /api/admin/** authorization rule declared in
 * {@link SecurityConfig}, by actually loading Spring Security's filter
 * chain. Unlike {@code AdminUserControllerTest} (which uses
 * {@code standaloneSetup()} and never touches Spring Security at all),
 * this test performs requests through the genuine
 * {@code authorizeHttpRequests(...)} configuration, so a passing/failing
 * result here reflects what Spring Security will actually do in
 * production for these three roles and for an unauthenticated caller.
 * <p>
 * This is a {@code @WebMvcTest} slice, not a {@code @SpringBootTest}: it
 * boots only the web/security layer needed to serve
 * {@link AdminUserController}, with {@link AdminUserService} replaced by a
 * {@code @MockitoBean}. No {@code DataSource}, no JPA repositories, and no
 * connection to Supabase are created anywhere in this test.
 * <p>
 * {@link TestSecurityBeans} below registers the {@code securityFilterChain}
 * bean by calling {@code new SecurityConfig().securityFilterChain(http)}
 * directly -- it is a thin delegating wrapper around the exact, unmodified
 * production method, not a re-implementation of the authorization rule.
 * That is what makes this a genuine test of {@code SecurityConfig} rather
 * than a test of a copy of it. It deliberately does NOT register
 * {@code SecurityConfig.authenticationManager(...)}: that bean requires
 * Spring Security's {@code AuthenticationConfiguration} machinery and
 * (indirectly, in the full application) a {@code UserDetailsService}
 * backed by {@code UserRepository} -- none of which this slice has or
 * needs, since {@code @WithMockUser} places a principal directly into the
 * {@code SecurityContext} without going through real authentication at
 * all. Only authorization (the {@code hasRole("ADMIN")} rule) is under
 * test here.
 */
@WebMvcTest(controllers = AdminUserController.class)
@Import(AdminUserSecurityConfigTest.TestSecurityBeans.class)
class AdminUserSecurityConfigTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AdminUserService adminUserService;

    @TestConfiguration
    @EnableWebSecurity
    static class TestSecurityBeans {

        private final SecurityConfig securityConfig = new SecurityConfig();

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
            return securityConfig.securityFilterChain(http);
        }

        @Bean
        public PasswordEncoder passwordEncoder() {
            return securityConfig.passwordEncoder();
        }

        @Bean
        public MockMvcBuilderCustomizer securityMockMvcBuilderCustomizer() {
            return builder -> builder.apply(SecurityMockMvcConfigurers.springSecurity());
        }
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void adminWithRoleAdmin_isAllowedThroughSecurity() throws Exception {
        when(adminUserService.getAllUsers()).thenReturn(List.of());

        mockMvc.perform(get("/api/admin/users"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "STUDENT")
    void studentWithRoleStudent_receivesForbidden() throws Exception {
        mockMvc.perform(get("/api/admin/users"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "TEACHER")
    void teacherWithRoleTeacher_receivesForbidden() throws Exception {
        mockMvc.perform(get("/api/admin/users"))
                .andExpect(status().isForbidden());
    }

    @Test
    void unauthenticatedRequest_isRejectedByConfiguredSecurityBehavior() throws Exception {
        // No @WithMockUser here: the SecurityContext is empty, exactly like
        // a real request with no session cookie.
        //
        // NOTE ON THE EXACT STATUS CODE: SecurityConfig's chain never calls
        // .httpBasic(...) or .formLogin(...) (this app authenticates
        // manually in AuthService/AuthController, not via a Spring
        // Security-managed login mechanism), so no explicit
        // AuthenticationEntryPoint is registered anywhere. Spring
        // Security's documented behavior in that situation is to fall back
        // to Http403ForbiddenEntryPoint, which would make this 403 rather
        // than 401 -- but I have not executed this test myself (no Maven
        // Central access in this sandbox), so I'm not willing to assert an
        // exact code I can't confirm. is4xxClientError() is the honest,
        // safe assertion: it proves the request is rejected either way.
        // Please tell me the exact status you observe when you run
        // `mvn clean test`, and I'll tighten this to isForbidden() or
        // isUnauthorized() accordingly.
        mockMvc.perform(get("/api/admin/users"))
                .andExpect(status().is4xxClientError());
    }
}