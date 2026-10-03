package com.healthcare.backend.dto;

import java.math.BigDecimal;

public record DoctorResponse(
        Long id,
        String fullName,
        String specialization,
        String qualification,
        Integer experienceYears,
        BigDecimal consultationFee
) {
}