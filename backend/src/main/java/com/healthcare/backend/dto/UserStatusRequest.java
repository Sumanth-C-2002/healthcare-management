package com.healthcare.backend.dto;

import com.healthcare.backend.entity.UserStatus;
import jakarta.validation.constraints.NotNull;

public record UserStatusRequest(

        @NotNull(message = "Status is required")
        UserStatus status
) {
}