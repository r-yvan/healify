package com.healify.controllers;

import com.healify.dtos.AppointmentResponseDTO;
import com.healify.services.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
  public void respondAppointment(@PathVariable Long id, @RequestParam boolean accept,
                                 @RequestParam String doctorEmail) {
    appointmentService.respondToAppointment(id, accept, doctorEmail);
  }
}
