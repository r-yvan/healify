// AuthRequest.java
package com.healify.security.auth;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class AuthRequest {
  private String email;
  private String password;
}
