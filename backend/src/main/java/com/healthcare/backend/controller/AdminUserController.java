package com.healthcare.backend.controller;

import com.healthcare.backend.dto.MessageResponse;
import com.healthcare.backend.dto.UserStatusRequest;
import com.healthcare.backend.dto.UserSummaryResponse;
import com.healthcare.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    private final UserService userService;

    public AdminUserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<UserSummaryResponse>> getAllPatients() {
        return ResponseEntity.ok(userService.getAllPatients());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<MessageResponse> updateUserStatus(@PathVariable Long id,
                                                            @Valid @RequestBody UserStatusRequest request) {
        return ResponseEntity.ok(userService.updateUserStatus(id, request));
    }
}