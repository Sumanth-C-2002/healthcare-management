package com.healthcare.backend.service;

import com.healthcare.backend.dto.LoginRequest;
import com.healthcare.backend.dto.LoginResponse;
import com.healthcare.backend.dto.MessageResponse;
import com.healthcare.backend.dto.RegisterRequest;
import com.healthcare.backend.entity.Role;
import com.healthcare.backend.entity.User;
import com.healthcare.backend.entity.UserStatus;
import com.healthcare.backend.exception.BadRequestException;
import com.healthcare.backend.exception.ForbiddenException;
import com.healthcare.backend.exception.UnauthorizedException;
import com.healthcare.backend.repository.UserRepository;
import com.healthcare.backend.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public MessageResponse register(RegisterRequest request) {
        String email = request.email().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("Email is already registered");
        }

        User user = new User();
        user.setFullName(request.fullName().trim());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setPhone(request.phone());
        user.setGender(request.gender());
        user.setDateOfBirth(request.dateOfBirth());
        user.setAddress(request.address());
        user.setRole(Role.PATIENT);
        user.setStatus(UserStatus.ACTIVE);

        userRepository.save(user);

        return new MessageResponse("Registration successful");
    }

    public LoginResponse login(LoginRequest request) {
        String email = request.email().trim().toLowerCase();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        if (user.getStatus() == UserStatus.BLOCKED) {
            throw new ForbiddenException("Your account is blocked. Please contact the admin");
        }

        String token = jwtUtil.generateToken(user);

        return new LoginResponse(token, user.getRole().name(), user.getFullName());
    }
}