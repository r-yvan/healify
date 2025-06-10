package com.healify.security.auth;

import com.healify.entities.User.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
  private String name;
  private String email;
  private String password;
  private Role role;
  private String specialization;
  private String location;
}
