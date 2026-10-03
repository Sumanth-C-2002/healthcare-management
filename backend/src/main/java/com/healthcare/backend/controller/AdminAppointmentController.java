package com.healthcare.backend.controller;

import com.healthcare.backend.dto.AdminAppointmentResponse;
import com.healthcare.backend.dto.AppointmentStatusRequest;
import com.healthcare.backend.dto.MessageResponse;
import com.healthcare.backend.entity.AppointmentStatus;
import com.healthcare.backend.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/appointments")
public class AdminAppointmentController {

    private final AppointmentService appointmentService;

    public AdminAppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @GetMapping
    public ResponseEntity<List<AdminAppointmentResponse>> getAllAppointments(
            @RequestParam(required = false) AppointmentStatus status) {
        return ResponseEntity.ok(appointmentService.getAllAppointments(status));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<MessageResponse> updateStatus(@PathVariable Long id,
                                                        @Valid @RequestBody AppointmentStatusRequest request) {
        return ResponseEntity.ok(appointmentService.updateAppointmentStatus(id, request));
    }
}