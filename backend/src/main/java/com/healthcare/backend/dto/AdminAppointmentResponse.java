package com.healthcare.backend.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public record AdminAppointmentResponse(
        Long id,
        Long patientId,
        String patientName,
        String doctorName,
        String specialization,
        LocalDate appointmentDate,
        LocalTime appointmentTime,
        String reason,
        String status,
        String adminRemarks
) {
}