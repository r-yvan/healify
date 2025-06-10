package com.healify.services.impl;

import com.healify.dtos.AppointmentRequestDTO;
import com.healify.dtos.AppointmentResponseDTO;
import com.healify.entities.Appointment;
import com.healify.entities.User;
import com.healify.repositories.AppointmentRepository;
import com.healify.repositories.UserRepository;
import com.healify.services.AppointmentService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {
  private final UserRepository userRepository;
  private final AppointmentRepository appointmentRepository;
  
  @Override
  @Transactional
  public AppointmentResponseDTO bookAppointment(AppointmentRequestDTO dto, String patientEmail) {
    User patient = userRepository.findByEmail(patientEmail).orElseThrow();
    User doctor = userRepository.findById(dto.getDoctorId()).orElseThrow();
    
    Appointment appointment = Appointment.builder()
      .doctor(doctor)
      .patient(patient)
      .appointmentTime(dto.getAppointmentTime())
      .location(dto.getLocation())
      .status(Appointment.Status.PENDING)
      .build();
    
    appointmentRepository.save(appointment);
    return mapToDTO(appointment);
  }
  
  @Override
  public List<AppointmentResponseDTO> getAppointmentsForDoctor(String doctorEmail) {
    User doctor = userRepository.findByEmail(doctorEmail).orElseThrow();
    return appointmentRepository.findByDoctor(doctor)
      .stream().map(this::mapToDTO).collect(Collectors.toList());
  }
  
  @Override
  @Transactional
  public void respondToAppointment(Long appointmentId, boolean accept, String doctorEmail) {
    Appointment appointment = appointmentRepository.findById(appointmentId).orElseThrow(() -> new RuntimeException("Appointment not found."));
    User doctor = userRepository.findByEmail(doctorEmail).orElseThrow();
    
    if (!appointment.getDoctor().getId().equals(doctor.getId()))
      throw new RuntimeException("Not authorized.");
    
    appointment.setStatus(accept ? Appointment.Status.ACCEPTED : Appointment.Status.REJECTED);
    appointmentRepository.save(appointment);
  }
  
  private AppointmentResponseDTO mapToDTO(Appointment appt) {
    return new AppointmentResponseDTO(
      appt.getId(),
      appt.getDoctor().getName(),
      appt.getPatient().getName(),
      appt.getAppointmentTime(),
      appt.getLocation(),
      appt.getStatus()
    );
  }
}
