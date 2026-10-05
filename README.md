# Sanora Health – Healthcare Management System

A full-stack healthcare management application designed to manage patients, doctors, appointments, and medical records through secure, role-based access.

The application provides separate **Patient** and **Admin** portals with JWT-based authentication and a RESTful Spring Boot backend connected to a React frontend.

## Live Application

**Live URL:** https://healthcare-frontend-q9t8.onrender.com

## Features

### Patient Portal

* Register and securely log in
* Manage personal profile
* Browse and search doctors by name or specialization
* Book and cancel appointments
* Track appointment status
* View medical records
* Download medical reports securely

### Admin Portal

* Secure admin login and dashboard
* View patients, doctors, appointments, and medical records
* Approve, reject, and complete appointments with notes
* Add, update, activate, and deactivate doctors
* Block and unblock patient accounts
* Add medical records with file attachments

## Technology Stack

| Layer            | Technologies                                |
| ---------------- | ------------------------------------------- |
| Backend          | Java 17, Spring Boot, Spring Security       |
| Persistence      | Spring Data JPA, Hibernate                  |
| Authentication   | JWT, BCrypt                                 |
| Database         | MySQL                                       |
| Frontend         | React, Vite, React Router, Axios, Bootstrap |
| Build Tool       | Maven                                       |
| Version Control  | Git, GitHub                                 |
| Containerization | Docker                                      |

## Architecture

The application follows a layered backend architecture with a separate React frontend.

```text
React Frontend
      |
      | REST API + JWT
      v
Spring Boot Backend
      |
      v
Controller → Service → Repository
      |
      v
     MySQL
```

### Backend Structure

The backend is organized into separate layers for maintainability:

```text
controller
service
repository
entity
dto
security
config
exception
```

## Security

Security is implemented using Spring Security and JWT authentication.

Key security features include:

* Stateless JWT-based authentication
* BCrypt password hashing
* Role-based authorization for `PATIENT` and `ADMIN`
* Protected admin and patient API endpoints
* Patient ownership checks for personal data
* Blocked users prevented from accessing the application
* Request validation and centralized exception handling
* Secure file upload with file type and size restrictions
* Randomized file names and path validation

## Database

The application uses MySQL with Spring Data JPA and Hibernate.

The main entities are:

* Users
* Doctors
* Appointments
* Medical Records

Appointments maintain relationships between patients and doctors, while medical records are associated with appointments.

## REST API

The backend exposes RESTful APIs for authentication, patient operations, doctor management, appointments, users, and medical records.

### Main API Groups

| API Group         | Purpose                           | Access              |
| ----------------- | --------------------------------- | ------------------- |
| `/api/auth/**`    | Registration and login            | Public              |
| `/api/patient/**` | Profile, appointments and records | Patient             |
| `/api/doctors/**` | Doctor information                | Authenticated users |
| `/api/admin/**`   | Administration and management     | Admin               |

The application currently provides **21 REST API endpoints** covering the main application workflows.

## Getting Started

### Prerequisites

* JDK 17
* Node.js 20.19+
* MySQL 8
* Maven

### 1. Clone the repository

```bash
git clone https://github.com/Sumanth-C-2002/healthcare-management.git
cd healthcare-management
```

### 2. Create the database

```sql
CREATE DATABASE healthcare_db;
```

### 3. Configure the backend

Configure the database connection, JWT secret, and admin credentials in:

```text
backend/src/main/resources/application.properties
```

### 4. Run the backend

From the `backend` directory:

```bash
mvn spring-boot:run
```

On Windows:

```cmd
mvnw.cmd spring-boot:run
```

### 5. Run the frontend

From the `frontend` directory:

```bash
npm install
npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```

## Deployment

The application is deployed using:

* **Frontend:** Render
* **Backend:** Render with Docker
* **Database:** Aiven MySQL

The production frontend communicates with the deployed Spring Boot REST API through HTTPS.

## Project Highlights

* Role-based healthcare management workflow
* Secure JWT authentication and authorization
* RESTful backend architecture
* CRUD operations using Spring Data JPA
* Centralized exception handling
* React frontend integrated with Spring Boot APIs
* Dockerized backend deployment
* MySQL database integration
* Responsive and user-friendly interface

## Future Improvements

* Pagination and sorting for large datasets
* Email notifications for appointment updates
* Automated unit and integration testing
* Database migration management using Flyway
* Additional reporting and analytics features
