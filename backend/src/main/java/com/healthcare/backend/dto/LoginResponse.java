package com.healthcare.backend.dto;

public record LoginResponse(
        String token,
        String role,
        String fullName
) {
}