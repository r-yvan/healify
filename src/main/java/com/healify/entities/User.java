package com.healify.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
  
  public enum Role {
    PATIENT, DOCTOR
  }
  
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  
  private String name;
  
  @Column(unique = true, nullable = false)
  private String email;
  
  private String password;
  
  @Enumerated(EnumType.STRING)
  private Role role;
  
  // Only applicable for doctors
  private String specialization;
  
  private String location;
}
