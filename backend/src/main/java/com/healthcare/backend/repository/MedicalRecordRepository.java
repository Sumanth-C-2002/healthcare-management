package com.healthcare.backend.repository;

import com.healthcare.backend.entity.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {

    List<MedicalRecord> findByPatientIdOrderByRecordDateDesc(Long patientId);

    List<MedicalRecord> findAllByOrderByRecordDateDesc();

    Optional<MedicalRecord> findByIdAndPatientId(Long id, Long patientId);

    boolean existsByAppointmentId(Long appointmentId);
}