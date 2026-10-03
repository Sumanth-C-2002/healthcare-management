package com.healthcare.backend.service;

import com.healthcare.backend.dto.MessageResponse;
import com.healthcare.backend.dto.ProfileResponse;
import com.healthcare.backend.dto.UpdateProfileRequest;
import com.healthcare.backend.dto.UserStatusRequest;
import com.healthcare.backend.dto.UserSummaryResponse;
import com.healthcare.backend.entity.Role;
import com.healthcare.backend.entity.User;
import com.healthcare.backend.exception.BadRequestException;
import com.healthcare.backend.exception.ResourceNotFoundException;
import com.healthcare.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public ProfileResponse getProfile(String email) {
        User user = findByEmail(email);
        return toProfileResponse(user);
    }

    public MessageResponse updateProfile(String email, UpdateProfileRequest request) {
        User user = findByEmail(email);

        user.setFullName(request.fullName().trim());
        user.setPhone(request.phone());
        user.setGender(request.gender());
        user.setDateOfBirth(request.dateOfBirth());
        user.setAddress(request.address());

        userRepository.save(user);

        return new MessageResponse("Profile updated successfully");
    }

    public List<UserSummaryResponse> getAllPatients() {
        return userRepository.findByRole(Role.PATIENT).stream()
                .map(user -> new UserSummaryResponse(
                        user.getId(),
                        user.getFullName(),
                        user.getEmail(),
                        user.getPhone(),
                        user.getStatus().name()))
                .toList();
    }

    public MessageResponse updateUserStatus(Long id, UserStatusRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getRole() == Role.ADMIN) {
            throw new BadRequestException("Admin accounts cannot be blocked");
        }

        user.setStatus(request.status());
        userRepository.save(user);

        return new MessageResponse("User status changed to " + request.status());
    }

    private User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private ProfileResponse toProfileResponse(User user) {
        return new ProfileResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getGender(),
                user.getDateOfBirth(),
                user.getAddress()
        );
    }
}