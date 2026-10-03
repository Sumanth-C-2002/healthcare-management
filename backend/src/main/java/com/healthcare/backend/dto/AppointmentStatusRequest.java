package com.healthcare.backend.dto;

import com.healthcare.backend.entity.AppointmentStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AppointmentStatusRequest(

        @NotNull(message = "Status is required")
        AppointmentStatus status,

        @Size(max = 255, message = "Remarks must be at most 255 characters")
        String adminRemarks
) {
}