package com.healify.security.auth;

import com.healify.entities.User;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
  private String token;
  private User user;
}
