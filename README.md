# Sanora Health: Healthcare Management System

A full-stack, role-based healthcare management web application. Patients can book appointments and access their medical records, while administrators manage doctors, approvals, patients and records.

## Features

**Patient portal**
- Register, sign in and manage a personal profile
- Browse doctors, search by name or specialization, and book appointments
- Track appointment status (Pending, Approved, Completed, Rejected, Cancelled) and cancel when needed
- View medical records and download attached reports securely

**Admin portal**
- Separate admin login with a live dashboard (pending approvals, doctors, patients, records)
- Approve, reject or complete appointments with notes to the patient
- Add, edit, activate and deactivate doctors
- Block and unblock patient accounts
- Add medical records with file upload (PDF, PNG, JPG)

## Tech stack

| Layer | Technology |
|---|---|
| Backend | Java 17, Spring Boot 4, Spring Security, Spring Data JPA (Hibernate), Bean Validation |
| Authentication | JWT (jjwt), BCrypt password hashing, role-based access (PATIENT, ADMIN) |
| Database | MySQL 8 |
| Frontend | React (Vite), React Router, Axios, Bootstrap 5 grid with a custom design system |
| Tools | Maven, Postman, VS Code |

## Architecture

Monolithic Spring Boot application with a layered design, exposing a REST API to a separate React single-page app.

```
React (Vite)  --JSON over HTTP + JWT-->  Controller -> Service -> Repository -> MySQL
```

Backend packages: `controller`, `service`, `repository`, `entity`, `dto`, `security`, `config`, `exception`.

## Database

Four tables: `users`, `doctors`, `appointments` and `medical_records`. Appointments link a patient and a doctor (foreign keys), and each medical record links to one appointment.

## Security highlights

- Passwords stored with BCrypt, never in plain text
- Stateless JWT authentication with a custom filter
- Role-based URL rules: `/api/admin/**` for admins, `/api/patient/**` for patients
- Ownership checks (a patient can only read or cancel their own data)
- Blocked users are rejected immediately, even with an old token
- Input validation with clean JSON error responses (400, 401, 403, 404)
- Safe file upload: type and size limits, random stored file names, path checks

## REST API (21 endpoints)

| # | Method | Endpoint | Access |
|---|---|---|---|
| 1 | POST | /api/auth/register | Public |
| 2 | POST | /api/auth/login | Public |
| 3 | GET | /api/patient/profile | Patient |
| 4 | PUT | /api/patient/profile | Patient |
| 5 | POST | /api/patient/appointments | Patient |
| 6 | GET | /api/patient/appointments | Patient |
| 7 | PUT | /api/patient/appointments/{id}/cancel | Patient |
| 8 | GET | /api/patient/records | Patient |
| 9 | GET | /api/patient/records/{id}/download | Patient |
| 10 | GET | /api/doctors (optional ?specialization=) | Logged in |
| 11 | GET | /api/doctors/{id} | Logged in |
| 12 | POST | /api/admin/doctors | Admin |
| 13 | PUT | /api/admin/doctors/{id} | Admin |
| 14 | PUT | /api/admin/doctors/{id}/status | Admin |
| 15 | GET | /api/admin/doctors | Admin |
| 16 | GET | /api/admin/appointments (optional ?status=) | Admin |
| 17 | PUT | /api/admin/appointments/{id}/status | Admin |
| 18 | GET | /api/admin/records (optional ?patientId=) | Admin |
| 19 | POST | /api/admin/records (multipart/form-data) | Admin |
| 20 | GET | /api/admin/users | Admin |
| 21 | PUT | /api/admin/users/{id}/status | Admin |

## Getting started

**Prerequisites:** JDK 17, Node.js 20.19 or newer, MySQL 8.

1. Create the database:
```sql
   CREATE DATABASE healthcare_db;
```
2. Copy `backend/src/main/resources/application.properties.example` to `application.properties` and fill in your MySQL password, a JWT secret (32+ characters) and the admin credentials.
3. Run the backend (tables are created automatically, and the admin account is created on first start):
```
   cd backend
   ./mvnw spring-boot:run
```
   On Windows use `.\mvnw.cmd spring-boot:run`.
4. Run the frontend:
```
   cd frontend
   npm install
   npm run dev
```
5. Open http://localhost:5173 and sign in with the admin account, or register as a patient.

## Design

The UI follows a small custom design system (teal palette, Plus Jakarta Sans, rounded cards, subtle hover states) with loading, empty and error states on every screen, responsive layouts and keyboard accessibility.

## Future improvements

- Admin download endpoint for medical record files
- Pagination and sorting for large tables
- Email notifications for appointment decisions
- Unit and integration tests, and Docker setup
- Database migrations with Flyway