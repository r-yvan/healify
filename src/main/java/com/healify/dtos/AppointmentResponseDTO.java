package com.healify.dtos;

import com.healify.entities.Appointment.Status;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentResponseDTO {
  private Long id;
  private String doctorName;
  private String patientName;
  private LocalDateTime appointmentTime;
  private String location;
  private Status status;
}
