package com.healthcare.backend.repository;

import com.healthcare.backend.entity.Appointment;
import com.healthcare.backend.entity.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collection;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByPatientIdOrderByCreatedAtDesc(Long patientId);

    List<Appointment> findByStatusOrderByCreatedAtDesc(AppointmentStatus status);

    List<Appointment> findAllByOrderByCreatedAtDesc();

    boolean existsByDoctorIdAndAppointmentDateAndAppointmentTimeAndStatusIn(
            Long doctorId,
            LocalDate appointmentDate,
            LocalTime appointmentTime,
            Collection<AppointmentStatus> statuses);
}