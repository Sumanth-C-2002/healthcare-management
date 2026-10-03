package com.healthcare.backend.repository;

import com.healthcare.backend.entity.Doctor;
import com.healthcare.backend.entity.DoctorStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    boolean existsByEmail(String email);

    List<Doctor> findByStatus(DoctorStatus status);

    List<Doctor> findByStatusAndSpecializationIgnoreCase(DoctorStatus status, String specialization);
}