package com.healify.services;

import com.healify.dtos.AppointmentRequestDTO;
import com.healify.dtos.AppointmentResponseDTO;

import java.util.List;

public interface AppointmentService {
  AppointmentResponseDTO bookAppointment(AppointmentRequestDTO dto, String patientEmail);
  List<AppointmentResponseDTO> getAppointmentsForDoctor(String doctorEmail);
  void respondToAppointment(Long appointmentId, boolean accept, String doctorEmail);
}
