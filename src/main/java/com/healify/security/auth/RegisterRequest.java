// RegisterRequest.java
package com.healify.security.auth;

import com.healify.entities.User.Role;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class RegisterRequest {
  private String name;
  private String email;
  private String password;
  private Role role;  // PATIENT or DOCTOR
  private String specialization;
  private String location;
}
