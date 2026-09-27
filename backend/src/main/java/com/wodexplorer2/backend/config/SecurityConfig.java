package com.wodexplorer2.backend.config;

import com.wodexplorer2.backend.security.JwtAuthenticationFilter;
import com.wodexplorer2.backend.exception.ApiErrorWriter;
import org.springframework.http.HttpMethod;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import com.wodexplorer2.backend.security.OAuth2AuthenticationSuccessHandler;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final ApiErrorWriter apiErrorWriter;
    private final OAuth2AuthenticationSuccessHandler oauth2AuthenticationSuccessHandler;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter,
            ApiErrorWriter apiErrorWriter,
            OAuth2AuthenticationSuccessHandler oauth2AuthenticationSuccessHandler) {

        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.apiErrorWriter = apiErrorWriter;
        this.oauth2AuthenticationSuccessHandler = oauth2AuthenticationSuccessHandler;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        return http
                .csrf(csrf -> csrf.disable())

                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/oauth2/**").permitAll()
                        .requestMatchers("/login/oauth2/**").permitAll()
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/exercises/**",
                                "/api/wods/**",
                                "/api/wod-versions/**",
                                "/api/wod-version-items/**")
                        .permitAll()
                        .anyRequest().authenticated())

                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint((request, response, authException) -> apiErrorWriter.write(
                                request,
                                response,
                                401,
                                "UNAUTHORIZED",
                                "Autenticación requerida"))
                        .accessDeniedHandler((request, response, accessDeniedException) -> apiErrorWriter.write(
                                request,
                                response,
                                403,
                                "FORBIDDEN",
                                "No tienes permisos para realizar esta operación")))

                .oauth2Login(oauth2 -> oauth2
                        .successHandler(oauth2AuthenticationSuccessHandler))

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class)

                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
