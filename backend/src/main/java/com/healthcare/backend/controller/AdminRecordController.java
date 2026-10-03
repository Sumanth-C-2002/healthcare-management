package com.healthcare.backend.controller;

import com.healthcare.backend.dto.AdminMedicalRecordResponse;
import com.healthcare.backend.dto.MessageResponse;
import com.healthcare.backend.service.MedicalRecordService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/admin/records")
public class AdminRecordController {

    private final MedicalRecordService medicalRecordService;

    public AdminRecordController(MedicalRecordService medicalRecordService) {
        this.medicalRecordService = medicalRecordService;
    }

    @GetMapping
    public ResponseEntity<List<AdminMedicalRecordResponse>> getAllRecords(
            @RequestParam(required = false) Long patientId) {
        return ResponseEntity.ok(medicalRecordService.getAllRecords(patientId));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MessageResponse> addRecord(
            @RequestParam("appointmentId") Long appointmentId,
            @RequestParam("diagnosis") String diagnosis,
            @RequestParam(value = "prescription", required = false) String prescription,
            @RequestPart(value = "file", required = false) MultipartFile file) {

        MessageResponse response =
                medicalRecordService.addRecord(appointmentId, diagnosis, prescription, file);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}