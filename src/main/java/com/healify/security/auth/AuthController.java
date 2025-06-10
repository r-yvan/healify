package com.healify.security.auth;

import com.healify.entities.User;
import com.healify.repositories.UserRepository;
import com.healify.security.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final AuthenticationManager authenticationManager;
  
  @PostMapping("/register")
  public AuthResponse register(@RequestBody RegisterRequest request) {
    User user = User.builder().name(request.getName()).email(request.getEmail()).password(passwordEncoder.encode(request.getPassword())).role(request.getRole()).specialization(request.getSpecialization()).location(request.getLocation()).build();
    System.out.println("user : " + user.getEmail());
    userRepository.save(user);
    String token = jwtService.generateToken(user.getEmail());
    return new AuthResponse(token, user);
  }
  
  @PostMapping("/login")
  public AuthResponse login(@RequestBody AuthRequest request) {
    System.out.println("login called");
    authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
    User user = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new UsernameNotFoundException("User not found"));
    String token = jwtService.generateToken(request.getEmail());
    return new AuthResponse(token, user);
  }
}
