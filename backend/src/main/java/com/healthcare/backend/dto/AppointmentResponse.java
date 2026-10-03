package com.healthcare.backend.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public record AppointmentResponse(
        Long id,
        String doctorName,
        String specialization,
        LocalDate appointmentDate,
        LocalTime appointmentTime,
        String reason,
        String status,
        String adminRemarks
) {
}