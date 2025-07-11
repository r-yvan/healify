package com.healify.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "appointments")
public class Appointment {
  public enum Status {
    PENDING, ACCEPTED, REJECTED
  }
  
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  
  @ManyToOne
  @JoinColumn(name = "patient_id", nullable = false)
  private User patient;
  
  @ManyToOne
  @JoinColumn(name = "doctor_id", nullable = false)
  private User doctor;
  
  private LocalDateTime appointmentTime;
  
  private String location;
  
  @Enumerated(EnumType.STRING)
  private Status status;
}
