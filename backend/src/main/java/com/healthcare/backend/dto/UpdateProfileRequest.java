package com.healthcare.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record UpdateProfileRequest(

        @NotBlank(message = "Full name is required")
        @Size(max = 100, message = "Full name must be at most 100 characters")
        String fullName,

        @Pattern(regexp = "^[0-9]{10}$", message = "Phone must be 10 digits")
        String phone,

        String gender,

        @Past(message = "Date of birth must be in the past")
        LocalDate dateOfBirth,

        String address
) {
}