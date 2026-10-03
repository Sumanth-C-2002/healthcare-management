package com.healthcare.backend.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.time.LocalTime;

public record BookAppointmentRequest(

        @NotNull(message = "Doctor id is required")
        Long doctorId,

        @NotNull(message = "Appointment date is required")
        @FutureOrPresent(message = "Appointment date cannot be in the past")
        LocalDate appointmentDate,

        @NotNull(message = "Appointment time is required")
        LocalTime appointmentTime,

        @NotBlank(message = "Reason is required")
        @Size(max = 255, message = "Reason must be at most 255 characters")
        String reason
) {
}