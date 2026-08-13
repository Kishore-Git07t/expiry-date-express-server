# Walkthrough - Implementing Auth APIs (Login & Register)

Implemented authentication REST APIs (`POST /auth/register` and `POST /auth/login`), User collection schema in MongoDB, Controller-Service-DAO layer separation, request validation, JWT token/cookie authentication, and Swagger OpenAPI documentation at `/api-docs`.

## Changes Made

### 1. Database Configuration & Models
- **[`src/config/db.js`](file:///c:/Users/Happy/expiry-date-manager/expiry-date-express-server/src/config/db.js)**: Configured MongoDB connection function `connectDB` using Mongoose.
- **[`src/models/User.js`](file:///c:/Users/Happy/expiry-date-manager/expiry-date-express-server/src/models/User.js)**: Created Mongoose `User` schema containing `name`, `email`, `password`, and `timestamps`.

### 2. DAO, Services, and Validators
- **[`src/dao/userDao.js`](file:///c:/Users/Happy/expiry-date-manager/expiry-date-express-server/src/dao/userDao.js)**: Database access methods (`findByEmail`, `createUser`, `findById`).
- **[`src/services/authService.js`](file:///c:/Users/Happy/expiry-date-manager/expiry-date-express-server/src/services/authService.js)**: Business logic for registration and login (password hashing with `bcrypt`, JWT token generation).
- **[`src/utils/validators.js`](file:///c:/Users/Happy/expiry-date-manager/expiry-date-express-server/src/utils/validators.js)**: Request validators using `express-validator`.

### 3. Controllers & Routes
- **[`src/controllers/authController.js`](file:///c:/Users/Happy/expiry-date-manager/expiry-date-express-server/src/controllers/authController.js)**: Controller handlers setting `jwtToken` HTTP cookie and returning JSON responses.
- **[`src/routes/authRoutes.js`](file:///c:/Users/Happy/expiry-date-manager/expiry-date-express-server/src/routes/authRoutes.js)**: Express router for `POST /auth/register` and `POST /auth/login` with Swagger annotations.

### 4. Swagger API Documentation & Server Integration
- **[`src/config/swagger.js`](file:///c:/Users/Happy/expiry-date-manager/expiry-date-express-server/src/config/swagger.js)**: Configured Swagger OpenAPI 3.0 specs at `/api-docs`.
- **[`server.js`](file:///c:/Users/Happy/expiry-date-manager/expiry-date-express-server/server.js)**: Mounted DB connection, Swagger UI, and auth routes.

---

## Verification Results

### 1. Swagger UI Test
- Endpoint `GET http://localhost:5001/api-docs/` -> **HTTP 200 OK**.

### 2. Input Validation Test
- `POST http://localhost:5001/auth/register` with empty body -> **HTTP 400 Bad Request** with validation error messages (`Name is required`, `Please provide a valid email address`, `Password must be at least 6 characters long`).

### 3. Auth Endpoints Verification
- `POST /auth/register` & `POST /auth/login` paths mounted correctly under `/auth`.
