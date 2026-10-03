package com.healthcare.backend.service;

import com.healthcare.backend.dto.AdminMedicalRecordResponse;
import com.healthcare.backend.dto.FileDownload;
import com.healthcare.backend.dto.MedicalRecordResponse;
import com.healthcare.backend.dto.MessageResponse;
import com.healthcare.backend.entity.Appointment;
import com.healthcare.backend.entity.AppointmentStatus;
import com.healthcare.backend.entity.MedicalRecord;
import com.healthcare.backend.entity.User;
import com.healthcare.backend.exception.BadRequestException;
import com.healthcare.backend.exception.ForbiddenException;
import com.healthcare.backend.exception.ResourceNotFoundException;
import com.healthcare.backend.repository.AppointmentRepository;
import com.healthcare.backend.repository.MedicalRecordRepository;
import com.healthcare.backend.repository.UserRepository;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class MedicalRecordService {

    private final MedicalRecordRepository medicalRecordRepository;
    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    public MedicalRecordService(MedicalRecordRepository medicalRecordRepository,
                                AppointmentRepository appointmentRepository,
                                UserRepository userRepository,
                                FileStorageService fileStorageService) {
        this.medicalRecordRepository = medicalRecordRepository;
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
    }

    // ---------- Patient side ----------

    @Transactional(readOnly = true)
    public List<MedicalRecordResponse> getMyRecords(String email) {
        User patient = findUserByEmail(email);

        return medicalRecordRepository.findByPatientIdOrderByRecordDateDesc(patient.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public FileDownload downloadMyRecordFile(String email, Long recordId) {
        User patient = findUserByEmail(email);

        MedicalRecord record = medicalRecordRepository.findById(recordId)
                .orElseThrow(() -> new ResourceNotFoundException("Medical record not found"));

        if (!record.getPatient().getId().equals(patient.getId())) {
            throw new ForbiddenException("You cannot access this medical record");
        }

        if (record.getFilePath() == null) {
            throw new ResourceNotFoundException("No file is attached to this record");
        }

        Resource resource = fileStorageService.load(record.getFilePath());
        String fileName = record.getFileName() != null ? record.getFileName() : record.getFilePath();
        String contentType = fileStorageService.getContentType(fileName);

        return new FileDownload(resource, fileName, contentType);
    }

    // ---------- Admin side ----------

    @Transactional(readOnly = true)
    public List<AdminMedicalRecordResponse> getAllRecords(Long patientId) {
        List<MedicalRecord> records;

        if (patientId == null) {
            records = medicalRecordRepository.findAllByOrderByRecordDateDesc();
        } else {
            records = medicalRecordRepository.findByPatientIdOrderByRecordDateDesc(patientId);
        }

        return records.stream().map(this::toAdminResponse).toList();
    }

    @Transactional
    public MessageResponse addRecord(Long appointmentId,
                                     String diagnosis,
                                     String prescription,
                                     MultipartFile file) {

        if (diagnosis == null || diagnosis.isBlank()) {
            throw new BadRequestException("Diagnosis is required");
        }
        if (diagnosis.length() > 255) {
            throw new BadRequestException("Diagnosis must be at most 255 characters");
        }

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        AppointmentStatus status = appointment.getStatus();
        if (status != AppointmentStatus.APPROVED && status != AppointmentStatus.COMPLETED) {
            throw new BadRequestException(
                    "Records can be added only for approved or completed appointments");
        }

        if (medicalRecordRepository.existsByAppointmentId(appointmentId)) {
            throw new BadRequestException("A record already exists for this appointment");
        }

        MedicalRecord record = new MedicalRecord();
        record.setPatient(appointment.getPatient());
        record.setDoctor(appointment.getDoctor());
        record.setAppointment(appointment);
        record.setDiagnosis(diagnosis.trim());
        record.setPrescription(prescription);
        record.setRecordDate(appointment.getAppointmentDate());

        if (file != null && !file.isEmpty()) {
            FileStorageService.StoredFile stored = fileStorageService.store(file);
            record.setFileName(stored.originalName());
            record.setFilePath(stored.storedName());
        }

        medicalRecordRepository.save(record);

        return new MessageResponse("Medical record added successfully");
    }

    // ---------- Helpers ----------

    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private MedicalRecordResponse toResponse(MedicalRecord record) {
        return new MedicalRecordResponse(
                record.getId(),
                record.getDoctor().getFullName(),
                record.getRecordDate(),
                record.getDiagnosis(),
                record.getPrescription(),
                record.getFileName()
        );
    }

    private AdminMedicalRecordResponse toAdminResponse(MedicalRecord record) {
        return new AdminMedicalRecordResponse(
                record.getId(),
                record.getPatient().getId(),
                record.getPatient().getFullName(),
                record.getDoctor().getFullName(),
                record.getAppointment().getId(),
                record.getRecordDate(),
                record.getDiagnosis(),
                record.getPrescription(),
                record.getFileName()
        );
    }
}