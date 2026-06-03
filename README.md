# Library Management System

## Overview

A full-stack Library Management System developed using React, NestJS, Prisma, and PostgreSQL. The application provides secure authentication through JWT and Google OAuth 2.0, role-based access control for administrators and students, comprehensive book inventory management, borrow and return workflows, copy tracking, overdue fine calculation, search and filtering capabilities, and an administrative dashboard with real-time library statistics.

The system is designed to streamline library operations while demonstrating modern full-stack development practices, secure authentication mechanisms, REST API development, database management, and responsive user interface design.

---

## Features

### Authentication & Authorization

* User Registration
* User Login
* JWT Authentication
* Google OAuth 2.0 Login
* Role-Based Access Control (ADMIN / STUDENT)
* Protected Routes

### Book Management

* Add Books
* View Books
* Update Books
* Delete Books
* Search Books
* Pagination
* Sorting

### Borrow Management

* Borrow Books
* Return Books
* Track Borrow History
* Due Date Management
* Available Copy Tracking

### Admin Features

* Manage Books
* Manage Borrow Records
* Dashboard Access

### Student Features

* Browse Books
* Borrow Books
* View Borrowed Books

---

## Tech Stack

### Frontend

* React
* React Router
* Axios
* Tailwind CSS

### Backend

* NestJS
* Passport.js
* JWT
* Google OAuth 2.0

### Database

* PostgreSQL
* Prisma ORM

---

## Project Structure

Frontend:

```bash
frontend/
├── pages/
├── components/
├── services/
└── App.jsx
```

Backend:

```bash
backend/
├── src/
│   ├── auth/
│   ├── books/
│   ├── borrow/
│   ├── users/
│   └── prisma/
```

---

## Installation

### Backend

```bash
cd backend

npm install

npx prisma generate

npx prisma migrate dev

npm run start:dev
```

### Frontend

```bash
cd frontend

npm install

npm run dev
```

---

## Environment Variables

Backend `.env`

```env
DATABASE_URL=

JWT_SECRET=

GOOGLE_CLIENT_ID=

GOOGLE_CLIENT_SECRET=
```

---

## Authentication Flow

### Local Authentication

1. Register User
2. Login
3. Receive JWT Token
4. Access Protected Routes

### Google OAuth 2.0

1. Click Continue with Google
2. Authenticate using Google Account
3. User is automatically created if not already present
4. JWT Token is generated
5. User is redirected to the application

---

## Future Improvements

* Refresh Tokens
* Email Notifications
* Fine Calculation
* Redis Caching
* Advanced Search Filters
* Transaction Management
* Audit Logs

---

## Author

Abse Wahab
