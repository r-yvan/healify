package com.healify.dtos;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentRequestDTO {
  private Long doctorId;
  private LocalDateTime appointmentTime;
  private String location;
}
