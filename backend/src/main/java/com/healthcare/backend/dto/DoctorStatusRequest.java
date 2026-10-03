package com.healthcare.backend.dto;

import com.healthcare.backend.entity.DoctorStatus;
import jakarta.validation.constraints.NotNull;

public record DoctorStatusRequest(

        @NotNull(message = "Status is required")
        DoctorStatus status
) {
}