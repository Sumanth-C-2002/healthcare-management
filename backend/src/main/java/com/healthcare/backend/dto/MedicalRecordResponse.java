package com.healthcare.backend.dto;

import java.time.LocalDate;

public record MedicalRecordResponse(
        Long id,
        String doctorName,
        LocalDate recordDate,
        String diagnosis,
        String prescription,
        String fileName
) {
}