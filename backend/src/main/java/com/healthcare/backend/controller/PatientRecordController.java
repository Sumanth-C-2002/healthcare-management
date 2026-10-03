package com.healthcare.backend.controller;

import com.healthcare.backend.dto.FileDownload;
import com.healthcare.backend.dto.MedicalRecordResponse;
import com.healthcare.backend.service.MedicalRecordService;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/patient/records")
public class PatientRecordController {

    private final MedicalRecordService medicalRecordService;

    public PatientRecordController(MedicalRecordService medicalRecordService) {
        this.medicalRecordService = medicalRecordService;
    }

    @GetMapping
    public ResponseEntity<List<MedicalRecordResponse>> getMyRecords(Authentication authentication) {
        return ResponseEntity.ok(medicalRecordService.getMyRecords(authentication.getName()));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadRecordFile(Authentication authentication,
                                                       @PathVariable Long id) {
        FileDownload file = medicalRecordService.downloadMyRecordFile(authentication.getName(), id);

        ContentDisposition disposition = ContentDisposition.attachment()
                .filename(file.fileName())
                .build();

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(file.contentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, disposition.toString())
                .body(file.resource());
    }
}