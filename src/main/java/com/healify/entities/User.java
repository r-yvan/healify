package com.healify.entities;

import jakarta.persistence.*;
import lombok.*;

@Data
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
  
  private String specialization;
  private String location;
}
