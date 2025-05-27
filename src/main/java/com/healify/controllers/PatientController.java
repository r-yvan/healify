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
  public List<User> getDoctors(@RequestParam String specialization,
                               @RequestParam String location) {
    return userRepository.findByRoleAndSpecializationContainingIgnoreCaseAndLocationContainingIgnoreCase(
      User.Role.DOCTOR, specialization, location);
  }
  
  @PostMapping("/appointments")
  public AppointmentResponseDTO bookAppointment(@RequestBody AppointmentRequestDTO dto,
                                                @RequestParam String patientEmail) {
    return appointmentService.bookAppointment(dto, patientEmail);
  }
}
