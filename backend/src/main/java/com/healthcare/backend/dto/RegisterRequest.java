package com.healthcare.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record RegisterRequest(

        @NotBlank(message = "Full name is required")
        @Size(max = 100, message = "Full name must be at most 100 characters")
        String fullName,

        @NotBlank(message = "Email is required")
        @Email(message = "Email format is not valid")
        String email,

        @NotBlank(message = "Password is required")
        @Size(min = 6, max = 50, message = "Password must be 6 to 50 characters")
        String password,

        @Pattern(regexp = "^[0-9]{10}$", message = "Phone must be 10 digits")
        String phone,

        String gender,

        @Past(message = "Date of birth must be in the past")
        LocalDate dateOfBirth,

        String address
) {
}