package com.healthcare.backend.controller;

import com.healthcare.backend.dto.AdminDoctorResponse;
import com.healthcare.backend.dto.DoctorRequest;
import com.healthcare.backend.dto.DoctorStatusRequest;
import com.healthcare.backend.dto.MessageResponse;
import com.healthcare.backend.service.DoctorService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/doctors")
public class AdminDoctorController {

    private final DoctorService doctorService;

    public AdminDoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @GetMapping
    public ResponseEntity<List<AdminDoctorResponse>> getAllDoctors() {
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    @PostMapping
    public ResponseEntity<MessageResponse> addDoctor(@Valid @RequestBody DoctorRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(doctorService.addDoctor(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MessageResponse> updateDoctor(@PathVariable Long id,
                                                        @Valid @RequestBody DoctorRequest request) {
        return ResponseEntity.ok(doctorService.updateDoctor(id, request));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<MessageResponse> updateStatus(@PathVariable Long id,
                                                        @Valid @RequestBody DoctorStatusRequest request) {
        return ResponseEntity.ok(doctorService.updateStatus(id, request));
    }
}