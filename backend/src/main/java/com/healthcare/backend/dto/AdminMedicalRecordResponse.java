package com.healthcare.backend.dto;

import java.time.LocalDate;

public record AdminMedicalRecordResponse(
        Long id,
        Long patientId,
        String patientName,
        String doctorName,
        Long appointmentId,
        LocalDate recordDate,
        String diagnosis,
        String prescription,
        String fileName
) {
}