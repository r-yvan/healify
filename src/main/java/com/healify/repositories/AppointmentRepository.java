package com.healify.repositories;

import com.healify.entities.Appointment;
import com.healify.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
  List<Appointment> findByDoctor(User doctor);
  List<Appointment> findByPatient(User patient);
}
