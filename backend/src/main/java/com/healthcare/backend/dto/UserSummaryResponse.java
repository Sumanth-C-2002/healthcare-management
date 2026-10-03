package com.healthcare.backend.dto;

public record UserSummaryResponse(
        Long id,
        String fullName,
        String email,
        String phone,
        String status
) {
}