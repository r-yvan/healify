package com.healify.security.config;

import com.healify.repositories.UserRepository;
import com.healify.security.jwt.JwtAuthFilter;
import com.healify.security.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.*;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {
  
  private final UserRepository userRepository;
  private final JwtService jwtService; // Make sure JwtService is annotated with @Service
  
  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    return http
      .csrf(csrf -> csrf.disable()) // ✅ Modern syntax in Spring Security 6+
      .authorizeHttpRequests(auth -> auth
        .requestMatchers("/auth/**").permitAll()
        .anyRequest().authenticated()
      )
      .addFilterBefore(jwtAuthFilter(), UsernamePasswordAuthenticationFilter.class)
      .build();
  }
  
  @Bean
  public JwtAuthFilter jwtAuthFilter() {
    return new JwtAuthFilter(jwtService, userDetailsService());
  }
  
  @Bean
  public UserDetailsService userDetailsService() {
    return email -> userRepository.findByEmail(email)
      .map(user -> User.withUsername(user.getEmail())
        .password(user.getPassword())
        .roles(user.getRole().name())
        .build())
      .orElseThrow(() -> new UsernameNotFoundException("User not found"));
  }
  
  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
    throws Exception {
    return config.getAuthenticationManager();
  }
  
  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }
}
