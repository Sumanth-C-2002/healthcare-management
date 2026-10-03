package com.healthcare.backend.controller;

import com.healthcare.backend.dto.AppointmentResponse;
import com.healthcare.backend.dto.BookAppointmentRequest;
import com.healthcare.backend.dto.MessageResponse;
import com.healthcare.backend.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/patient/appointments")
public class PatientAppointmentController {

    private final AppointmentService appointmentService;

    public PatientAppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping
    public ResponseEntity<AppointmentResponse> bookAppointment(
            Authentication authentication,
            @Valid @RequestBody BookAppointmentRequest request) {
        AppointmentResponse response =
                appointmentService.bookAppointment(authentication.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<AppointmentResponse>> getMyAppointments(Authentication authentication) {
        return ResponseEntity.ok(appointmentService.getMyAppointments(authentication.getName()));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<MessageResponse> cancelAppointment(Authentication authentication,
                                                             @PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.cancelAppointment(authentication.getName(), id));
    }
}