package com.healify.dtos;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentRequestDTO {
  private Long doctorId;
  private LocalDateTime appointmentTime;
  private String location;
}
