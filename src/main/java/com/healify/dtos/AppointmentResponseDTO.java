package com.healify.dtos;

import com.healify.entities.Appointment.Status;
import lombok.*;

import java.time.LocalDateTime;

@Data
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
