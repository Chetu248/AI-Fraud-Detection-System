# AI Insurance Fraud Detection --- Documentation

## 1. What is this project?

**AI Insurance Fraud Detection** is an end-to-end insurance claim
management and fraud-analysis platform.

The system is designed around a simple business problem:

> Insurance companies receive many claims. Some claims are legitimate,
> while others may contain suspicious patterns, inconsistent
> information, or supporting evidence that deserves investigation. The
> platform centralizes claim processing and provides the foundation for
> automated fraud-risk analysis.

The application is organized into several major parts:

-   **Frontend** --- user interface for customers, investigators,
    insurance staff, and administrators.
-   **Spring Boot Backend** --- the main application and business API.
-   **PostgreSQL Database** --- persistent storage for users, vehicles,
    policies, claims, documents, investigations, notifications, and
    audit information.
-   **Kafka** --- asynchronous event transport for claim-submission
    workflows.
-   **AI Service** --- Python/FastAPI service intended to provide
    machine-learning fraud scoring.
-   **Document Storage** --- local file storage in the current backend
    implementation, with the storage abstraction designed so it can
    later be moved to object storage.
-   **Security Layer** --- JWT authentication, BCrypt password hashing,
    and role information carried in JWTs.

The backend repository snapshot used to prepare this documentation
contains the implemented REST modules, PostgreSQL/JPA persistence, JWT
security, Kafka producer/consumer flow, document upload/storage,
investigation management, notifications, dashboard/analytics/admin
summaries, and audit logs.

The AI service is kept as a separate Python service so that
machine-learning code does not have to be embedded inside the Java
application.

------------------------------------------------------------------------

## 2. Repository structure

The intended project structure is:

``` text
AI-Insurance-Fraud-Detection/
│
├── backend/
│   ├── src/main/java/com/example/backend/
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   ├── entity/
│   │   ├── dto/
│   │   ├── mapper/
│   │   ├── enums/
│   │   ├── event/
│   │   ├── exception/
│   │   ├── validation/
│   │   └── security/
│   └── src/main/resources/
│
├── frontend/
│
├── ai-service/
│
├── database/
│
└── docs/
```

The exact frontend and AI-service implementation can evolve
independently because the backend exposes a stable REST/event boundary.

------------------------------------------------------------------------

## 3. Core business flow

At a high level:

``` text
User
  |
  v
Frontend
  |
  | HTTP/REST + JWT
  v
Spring Boot Backend
  |
  +--> Authentication / Authorization
  |
  +--> User Profile
  |
  +--> Vehicle
  |
  +--> Insurance Policy
  |
  +--> Claim
  |      |
  |      +--> Documents
  |      |
  |      +--> ClaimSubmittedEvent
  |                 |
  |                 v
  |              Kafka
  |                 |
  |                 v
  |          Claim Event Consumer
  |                 |
  |                 v
  |             AI Service
  |                 |
  |                 v
  |       Fraud Risk / Analysis
  |
  +--> Investigation
  |
  +--> Notifications
  |
  +--> Dashboard / Analytics
  |
  +--> Audit Logs
  |
  v
PostgreSQL
```

The important architectural principle is that **claim management and AI
inference are separate responsibilities**.

------------------------------------------------------------------------

## 4. Main actors

  -----------------------------------------------------------------------
  Role                                Responsibility
  ----------------------------------- -----------------------------------
  CUSTOMER                            Registers, logs in, manages
                                      profile/vehicles/policies, submits
                                      claims and supporting documents.

  INVESTIGATOR                        Reviews suspicious claims and
                                      manages investigation information.

  INSURANCE_AGENT                     Represents operational insurance
                                      staff and can participate in
                                      claim/policy workflows according to
                                      the application's authorization
                                      rules.

  ADMIN                               Platform administration, high-level
                                      summaries, analytics and audit
                                      visibility.
  -----------------------------------------------------------------------

The backend defines these roles as:

``` text
ADMIN
INVESTIGATOR
INSURANCE_AGENT
CUSTOMER
```

------------------------------------------------------------------------

## 5. Main modules

1.  Authentication
2.  User Profile
3.  Vehicle Management
4.  Insurance Policy Management
5.  Claim Management
6.  Document Management
7.  Investigation Management
8.  Notification Management
9.  Dashboard
10. Analytics
11. Administration
12. Audit Logging
13. Kafka Event Processing
14. AI Fraud Detection boundary

Each module is explained in `modules.md`.

------------------------------------------------------------------------

## 6. Technology stack

### Backend

-   Java 21
-   Spring Boot 4.1.0
-   Spring Web MVC
-   Spring Data JPA
-   Hibernate
-   Spring Security
-   OAuth2 Resource Server / JWT
-   Bean Validation
-   Apache Kafka
-   PostgreSQL
-   Lombok
-   Maven

### AI service

-   Python
-   FastAPI
-   XGBoost classifier (with a scikit-learn Random Forest fallback)
-   SHAP explanations when available
-   Synthetic-data training pipeline and optional OCR endpoint

### Frontend

The frontend uses Next.js, React, TypeScript, Axios, Zustand, and
Tailwind CSS to provide role-oriented pages and consume the backend REST
APIs.

### Infrastructure

-   PostgreSQL/Neon-compatible database
-   Kafka broker
-   Local filesystem for the current document-storage implementation
-   Docker/AWS can be introduced as deployment infrastructure without
    changing the core business architecture.

------------------------------------------------------------------------

## 7. Important implementation note

The backend currently publishes a `ClaimSubmittedEvent` to Kafka and
consumes it with a Spring Kafka listener.

The backend Kafka consumer passes the received event to the Java
event-processing service. The integrated workflow currently:

``` text
1. Receives claim amount/date and available policy/history features in the event
2. Calls the FastAPI /predict endpoint
3. Receives a risk tier, score, model version, and explanation
4. Saves the result in the Investigation findings and updates its status
```

The optional Python Kafka consumer is disabled by default; when enabled,
it logs a placeholder analysis using defaults and does not persist the
result. The normal integration path is the Java backend consumer.

The current model was trained on synthetic data, and the analysis is
stored as Investigation text rather than in a dedicated fraud-analysis
table. This is a working prototype flow, not a validated production
fraud-detection system.

------------------------------------------------------------------------


## 9. Quick start

The normal development order is:

``` text
PostgreSQL
   ↓
Kafka
   ↓
Spring Boot backend
   ↓
AI service
   ↓
Frontend
```

The exact commands and environment setup are documented in
`setup_and_run.md`.

------------------------------------------------------------------------

## 10. Security warning

Never commit:

-   database passwords
-   JWT secrets
-   API keys
-   cloud credentials
-   private certificates
-   production tokens

Use environment variables or a secret manager.

The repository snapshot used for analysis contained database/JWT
configuration values in application configuration. Those values are
intentionally **not reproduced in this documentation**.

------------------------------------------------------------------------

## 11. Design philosophy

The project follows these principles:

-   Thin controllers
-   Business logic in services
-   Persistence through repositories
-   DTOs instead of exposing entities directly
-   Mappers between DTOs and entities
-   Validation at API boundaries
-   Centralized exception handling
-   Stateless JWT authentication
-   Asynchronous claim events through Kafka
-   Separate AI service
-   Auditability through audit logs
-   Clear separation between deterministic business logic and ML
    inference
