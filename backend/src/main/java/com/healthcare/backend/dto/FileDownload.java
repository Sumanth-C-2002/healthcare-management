package com.healthcare.backend.dto;

import org.springframework.core.io.Resource;

public record FileDownload(
        Resource resource,
        String fileName,
        String contentType
) {
}