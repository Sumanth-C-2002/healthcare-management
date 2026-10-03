package com.healthcare.backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record DoctorRequest(

        @NotBlank(message = "Full name is required")
        @Size(max = 100, message = "Full name must be at most 100 characters")
        String fullName,

        @NotBlank(message = "Email is required")
        @Email(message = "Email format is not valid")
        String email,

        @Pattern(regexp = "^[0-9]{10}$", message = "Phone must be 10 digits")
        String phone,

        @NotBlank(message = "Specialization is required")
        @Size(max = 100, message = "Specialization must be at most 100 characters")
        String specialization,

        @Size(max = 100, message = "Qualification must be at most 100 characters")
        String qualification,

        @Min(value = 0, message = "Experience cannot be negative")
        @Max(value = 70, message = "Experience is too high")
        Integer experienceYears,

        @NotNull(message = "Consultation fee is required")
        @DecimalMin(value = "0.0", message = "Consultation fee cannot be negative")
        BigDecimal consultationFee
) {
}