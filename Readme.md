# 📘 TaskBoard Pro – API Documentation

A powerful collaborative task management API built with **Node.js**, **Express**, and **MongoDB** using **Firebase Authentication**.

---

## 🔐 Authentication (`/api/auth`)

| Method | Endpoint          | Description                      |
| ------ | ----------------- | -------------------------------- |
| `POST` | `/api/auth/login` | Authenticate a user via Firebase |
| `GET`  | `/api/auth/me`    | Get authenticated user info      |

---

## 📁 Project Management (`/api/project`)

| Method   | Endpoint           | Description                     |
| -------- | ------------------ | ------------------------------- |
| `POST`   | `/api/project`     | Create a new project            |
| `GET`    | `/api/project`     | Fetch all projects for the user |
| `GET`    | `/api/project/:id` | Fetch a single project by ID    |
| `PUT`    | `/api/project/:id` | Update a project                |
| `DELETE` | `/api/project/:id` | Delete a project                |

---

## ✅ Task Management (`/api/tasks`)

| Method   | Endpoint                | Description                      |
| -------- | ----------------------- | -------------------------------- |
| `POST`   | `/api/tasks`            | Create a new task                |
| `GET`    | `/api/tasks/:projectId` | Get tasks for a specific project |
| `PUT`    | `/api/tasks/:id`        | Update a task                    |
| `DELETE` | `/api/tasks/:id`        | Delete a task                    |

---

## ⚙️ Workflow Automation (`/api/automation`)

| Method   | Endpoint                     | Description                        |
| -------- | ---------------------------- | ---------------------------------- |
| `POST`   | `/api/automation`            | Create an automation rule          |
| `GET`    | `/api/automation/:projectId` | Get automation rules for a project |
| `DELETE` | `/api/automation/:id`        | Delete an automation rule          |

---

> ✅ **Note:** All routes are protected using Firebase Auth middleware. Send a valid Firebase ID token in the `Authorization: Bearer <token>` header.
