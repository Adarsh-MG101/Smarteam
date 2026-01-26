# Smarteam - RBAC Project Management System

A robust Role-Based Access Control (RBAC) project management system built with Next.js, Node.js, and MongoDB.

## Features

- **Flexible RBAC**: Dynamic roles and permissions management.
- **Tiered Project Visibility**: Control who sees what based on role (Intern/Employee/Admin).
- **Task Engine**: Assign tasks, track status, and perform professional reviews.
- **Analytics Dashboard**: Performance metrics and leaderboards.

## Tech Stack

- **Frontend**: Next.js 15, Tailwind CSS 4, TypeScript
- **Backend**: Node.js, Express, MongoDB (Mongoose), TypeScript
- **Auth**: JWT (JSON Web Tokens), Bcrypt.js

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (Running locally or MongoDB Atlas)

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smarteam_rbac
JWT_SECRET=your_secret_key
```

Seed the database with initial Roles and Permissions:
```bash
npm run seed
```

Start the backend:
```bash
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Access the application at `http://localhost:3000`.

---

## 🔑 Default Roles & Permissions

- **Admin**: Full access. Can create projects, tasks, and review any task.
- **Employee**: Can view INTERN and EMPLOYEE projects. Can create and complete tasks.
- **Intern**: Can only view INTERN projects. Can complete assigned tasks.

## 📅 Implementation Timeline

- **Day 1**: Infrastructure & Data Schema.
- **Day 2**: JWT Auth & RBAC Middleware.
- **Day 3**: Project Scoping & Task Creation.
- **Day 4**: Task Status & Admin Grading.
- **Day 5**: Analytics Dashboards.
