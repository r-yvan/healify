package com.healify.entities;

import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
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
  
  private String specialization;
  private String location;
}
