package com.healthcare.backend.dto;

import java.time.LocalDate;

public record ProfileResponse(
        Long id,
        String fullName,
        String email,
        String phone,
        String gender,
        LocalDate dateOfBirth,
        String address
) {
}