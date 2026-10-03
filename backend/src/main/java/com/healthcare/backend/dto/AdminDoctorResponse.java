package com.healthcare.backend.dto;

import java.math.BigDecimal;

public record AdminDoctorResponse(
        Long id,
        String fullName,
        String email,
        String phone,
        String specialization,
        String qualification,
        Integer experienceYears,
        BigDecimal consultationFee,
        String status
) {
}