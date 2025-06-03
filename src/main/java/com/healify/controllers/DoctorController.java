package com.healify.controllers;

import com.healify.dtos.AppointmentResponseDTO;
import com.healify.services.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/doctor")
@RequiredArgsConstructor
public class DoctorController {
  private final AppointmentService appointmentService;
  
  @GetMapping("/appointments")
  public List<AppointmentResponseDTO> getAppointments(@RequestParam String email) {
    return appointmentService.getAppointmentsForDoctor(email);
  }
  
  @PatchMapping("/appointments/{id}/respond")
  public ResponseEntity<Map<String, String>> respondToAppointment(
    @PathVariable Long id,
    @RequestParam boolean accept,
    @RequestParam String doctorEmail
  ) {
    appointmentService.respondToAppointment(id, accept, doctorEmail);
    
    Map<String, String> response = new HashMap<>();
    response.put("message", "Appointment response recorded successfully.");
    return ResponseEntity.ok(response);
  }
}
