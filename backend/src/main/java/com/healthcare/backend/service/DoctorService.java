package com.healthcare.backend.service;

import com.healthcare.backend.dto.AdminDoctorResponse;
import com.healthcare.backend.dto.DoctorRequest;
import com.healthcare.backend.dto.DoctorResponse;
import com.healthcare.backend.dto.DoctorStatusRequest;
import com.healthcare.backend.dto.MessageResponse;
import com.healthcare.backend.entity.Doctor;
import com.healthcare.backend.entity.DoctorStatus;
import com.healthcare.backend.exception.BadRequestException;
import com.healthcare.backend.exception.ResourceNotFoundException;
import com.healthcare.backend.repository.DoctorRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;

    public DoctorService(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    public List<DoctorResponse> getActiveDoctors(String specialization) {
        List<Doctor> doctors;

        if (specialization == null || specialization.isBlank()) {
            doctors = doctorRepository.findByStatus(DoctorStatus.ACTIVE);
        } else {
            doctors = doctorRepository.findByStatusAndSpecializationIgnoreCase(
                    DoctorStatus.ACTIVE, specialization.trim());
        }

        return doctors.stream().map(this::toDoctorResponse).toList();
    }

    public DoctorResponse getActiveDoctorById(Long id) {
        Doctor doctor = findById(id);

        if (doctor.getStatus() != DoctorStatus.ACTIVE) {
            throw new ResourceNotFoundException("Doctor not found");
        }

        return toDoctorResponse(doctor);
    }

    public List<AdminDoctorResponse> getAllDoctors() {
        return doctorRepository.findAll().stream().map(this::toAdminResponse).toList();
    }

    public MessageResponse addDoctor(DoctorRequest request) {
        String email = request.email().trim().toLowerCase();

        if (doctorRepository.existsByEmail(email)) {
            throw new BadRequestException("A doctor with this email already exists");
        }

        Doctor doctor = new Doctor();
        copyFields(doctor, request, email);
        doctor.setStatus(DoctorStatus.ACTIVE);

        doctorRepository.save(doctor);

        return new MessageResponse("Doctor added successfully");
    }

    public MessageResponse updateDoctor(Long id, DoctorRequest request) {
        Doctor doctor = findById(id);
        String email = request.email().trim().toLowerCase();

        if (!doctor.getEmail().equalsIgnoreCase(email) && doctorRepository.existsByEmail(email)) {
            throw new BadRequestException("A doctor with this email already exists");
        }

        copyFields(doctor, request, email);

        doctorRepository.save(doctor);

        return new MessageResponse("Doctor updated successfully");
    }

    public MessageResponse updateStatus(Long id, DoctorStatusRequest request) {
        Doctor doctor = findById(id);
        doctor.setStatus(request.status());
        doctorRepository.save(doctor);

        return new MessageResponse("Doctor status changed to " + request.status());
    }

    private Doctor findById(Long id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));
    }

    private void copyFields(Doctor doctor, DoctorRequest request, String email) {
        doctor.setFullName(request.fullName().trim());
        doctor.setEmail(email);
        doctor.setPhone(request.phone());
        doctor.setSpecialization(request.specialization().trim());
        doctor.setQualification(request.qualification());
        doctor.setExperienceYears(request.experienceYears());
        doctor.setConsultationFee(request.consultationFee());
    }

    private DoctorResponse toDoctorResponse(Doctor doctor) {
        return new DoctorResponse(
                doctor.getId(),
                doctor.getFullName(),
                doctor.getSpecialization(),
                doctor.getQualification(),
                doctor.getExperienceYears(),
                doctor.getConsultationFee()
        );
    }

    private AdminDoctorResponse toAdminResponse(Doctor doctor) {
        return new AdminDoctorResponse(
                doctor.getId(),
                doctor.getFullName(),
                doctor.getEmail(),
                doctor.getPhone(),
                doctor.getSpecialization(),
                doctor.getQualification(),
                doctor.getExperienceYears(),
                doctor.getConsultationFee(),
                doctor.getStatus().name()
        );
    }
}