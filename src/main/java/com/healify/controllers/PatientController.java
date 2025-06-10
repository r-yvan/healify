package com.healify.controllers;

import com.healify.dtos.AppointmentRequestDTO;
import com.healify.dtos.AppointmentResponseDTO;
import com.healify.entities.User;
import com.healify.repositories.UserRepository;
import com.healify.services.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patient")
@RequiredArgsConstructor
public class PatientController {
  private final AppointmentService appointmentService;
  private final UserRepository userRepository;
  
  @GetMapping("/doctors")
  public List<User> getDoctors(
    @RequestParam(required = false) String specialization,
    @RequestParam(required = false) String location
  ) {
    if (specialization != null && !specialization.isEmpty() && location != null && !location.isEmpty()) {
      return userRepository.findByRoleAndSpecializationContainingIgnoreCaseAndLocationContainingIgnoreCase(User.Role.DOCTOR, specialization, location);
    } else if (specialization != null && !specialization.isEmpty()) {
      return userRepository.findByRoleAndSpecializationContainingIgnoreCase(User.Role.DOCTOR, specialization);
    } else if (location != null && !location.isEmpty()) {
      return userRepository.findByRoleAndLocationContainingIgnoreCase(User.Role.DOCTOR, location);
    }
    return userRepository.findByRole(User.Role.DOCTOR);
  }
  
  @PostMapping("/appointments")
  public AppointmentResponseDTO bookAppointment(
    @RequestBody AppointmentRequestDTO dto,
    @RequestParam String patientEmail
  ) {
    return appointmentService.bookAppointment(dto, patientEmail);
  }
}
