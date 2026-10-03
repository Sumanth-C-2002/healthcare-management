package com.healthcare.backend.service;

import com.healthcare.backend.dto.AdminAppointmentResponse;
import com.healthcare.backend.dto.AppointmentResponse;
import com.healthcare.backend.dto.AppointmentStatusRequest;
import com.healthcare.backend.dto.BookAppointmentRequest;
import com.healthcare.backend.dto.MessageResponse;
import com.healthcare.backend.entity.Appointment;
import com.healthcare.backend.entity.AppointmentStatus;
import com.healthcare.backend.entity.Doctor;
import com.healthcare.backend.entity.DoctorStatus;
import com.healthcare.backend.entity.User;
import com.healthcare.backend.exception.BadRequestException;
import com.healthcare.backend.exception.ForbiddenException;
import com.healthcare.backend.exception.ResourceNotFoundException;
import com.healthcare.backend.repository.AppointmentRepository;
import com.healthcare.backend.repository.DoctorRepository;
import com.healthcare.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AppointmentService {

    private static final List<AppointmentStatus> BLOCKING_STATUSES =
            List.of(AppointmentStatus.PENDING, AppointmentStatus.APPROVED);

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;

    public AppointmentService(AppointmentRepository appointmentRepository,
                              UserRepository userRepository,
                              DoctorRepository doctorRepository) {
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
    }

    // ---------- Patient side ----------

    @Transactional
    public AppointmentResponse bookAppointment(String email, BookAppointmentRequest request) {
        User patient = findUserByEmail(email);

        Doctor doctor = doctorRepository.findById(request.doctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        if (doctor.getStatus() != DoctorStatus.ACTIVE) {
            throw new BadRequestException("This doctor is not available right now");
        }

        LocalDateTime requested = LocalDateTime.of(request.appointmentDate(), request.appointmentTime());
        if (requested.isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Appointment date and time must be in the future");
        }

        boolean slotTaken = appointmentRepository
                .existsByDoctorIdAndAppointmentDateAndAppointmentTimeAndStatusIn(
                        doctor.getId(),
                        request.appointmentDate(),
                        request.appointmentTime(),
                        BLOCKING_STATUSES);

        if (slotTaken) {
            throw new BadRequestException("This time slot is already booked for the doctor");
        }

        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setAppointmentDate(request.appointmentDate());
        appointment.setAppointmentTime(request.appointmentTime());
        appointment.setReason(request.reason().trim());
        appointment.setStatus(AppointmentStatus.PENDING);

        Appointment saved = appointmentRepository.save(appointment);

        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponse> getMyAppointments(String email) {
        User patient = findUserByEmail(email);

        return appointmentRepository.findByPatientIdOrderByCreatedAtDesc(patient.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public MessageResponse cancelAppointment(String email, Long appointmentId) {
        User patient = findUserByEmail(email);
        Appointment appointment = findAppointmentById(appointmentId);

        if (!appointment.getPatient().getId().equals(patient.getId())) {
            throw new ForbiddenException("You cannot cancel this appointment");
        }

        AppointmentStatus current = appointment.getStatus();
        if (current != AppointmentStatus.PENDING && current != AppointmentStatus.APPROVED) {
            throw new BadRequestException("Only pending or approved appointments can be cancelled");
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointmentRepository.save(appointment);

        return new MessageResponse("Appointment cancelled successfully");
    }

    // ---------- Admin side ----------

    @Transactional(readOnly = true)
    public List<AdminAppointmentResponse> getAllAppointments(AppointmentStatus status) {
        List<Appointment> appointments;

        if (status == null) {
            appointments = appointmentRepository.findAllByOrderByCreatedAtDesc();
        } else {
            appointments = appointmentRepository.findByStatusOrderByCreatedAtDesc(status);
        }

        return appointments.stream().map(this::toAdminResponse).toList();
    }

    @Transactional
    public MessageResponse updateAppointmentStatus(Long appointmentId, AppointmentStatusRequest request) {
        Appointment appointment = findAppointmentById(appointmentId);

        AppointmentStatus current = appointment.getStatus();
        AppointmentStatus next = request.status();

        boolean allowed =
                (current == AppointmentStatus.PENDING
                        && (next == AppointmentStatus.APPROVED || next == AppointmentStatus.REJECTED))
                || (current == AppointmentStatus.APPROVED && next == AppointmentStatus.COMPLETED);

        if (!allowed) {
            throw new BadRequestException("Cannot change status from " + current + " to " + next);
        }

        appointment.setStatus(next);
        appointment.setAdminRemarks(request.adminRemarks());
        appointmentRepository.save(appointment);

        return new MessageResponse("Appointment status changed to " + next);
    }

    // ---------- Helpers ----------

    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private Appointment findAppointmentById(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));
    }

    private AppointmentResponse toResponse(Appointment appointment) {
        return new AppointmentResponse(
                appointment.getId(),
                appointment.getDoctor().getFullName(),
                appointment.getDoctor().getSpecialization(),
                appointment.getAppointmentDate(),
                appointment.getAppointmentTime(),
                appointment.getReason(),
                appointment.getStatus().name(),
                appointment.getAdminRemarks()
        );
    }

    private AdminAppointmentResponse toAdminResponse(Appointment appointment) {
        return new AdminAppointmentResponse(
                appointment.getId(),
                appointment.getPatient().getId(),
                appointment.getPatient().getFullName(),
                appointment.getDoctor().getFullName(),
                appointment.getDoctor().getSpecialization(),
                appointment.getAppointmentDate(),
                appointment.getAppointmentTime(),
                appointment.getReason(),
                appointment.getStatus().name(),
                appointment.getAdminRemarks()
        );
    }
}