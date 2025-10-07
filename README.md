# 🚖 Ride Booking API

## 🎯 Project Overview

A secure, scalable, and role-based backend API for a **ride booking platform** (like Uber, Pathao) built using **Express.js**, **Typescript** and **MongoDB (Mongoose)**.

This API allows:
- 🧍 Riders to request and manage rides
- 🚗 Drivers to accept and complete rides
- 👨‍💼 Admins to manage the platform and user base

---

## 📦 Tech Stack

- Node.js + Express
- MongoDB + Mongoos
- Typescript
- JWT for Authentication
- Bcrypt for Password Hashing
- Role-Based Access Control

---

## ⚙️ Setup Instructions

1. Clone the repo:
   ```bash
   git clone <your-repo-url>
   cd ride-booking-backend
````

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `.env` file:

   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_ACCESS_SECRET=your_jwt_secret
   JWT_ACCESS_EXPIRES=
   BCRYPT_SALT_ROUND=
   ```

4. Run the app:

   ```bash
   npm run dev
   ```

---

## 🔐 Authentication Endpoints

| Method | Endpoint                 | Description         |
| ------ | ------------------------ | ------------------- |
| `POST` | `/api/v1/user/register`  | Register a new user |
| `GET`  | `/api/v1/user/all-users` | Fetch all users     |

---

## 👥 User Management (Admin)

> 🔐 Requires `admin` role & JWT token in `Authorization` header

| Method  | Endpoint                   | Description      |
| ------- | -------------------------- | ---------------- |
| `PATCH` | `/api/v1/user/approve/:id` | Approve a driver |
| `PATCH` | `/api/v1/user/suspend/:id` | Suspend a driver |
| `PATCH` | `/api/v1/user/block/:id`   | Block a user     |
| `PATCH` | `/api/v1/user/unblock/:id` | Unblock a user   |

---

## 🚘 Ride Endpoints

> 🔐 Requires JWT token. Accessible based on role.

### 🧍 Rider Endpoints

| Method  | Endpoint                      | Description            |
| ------- | ----------------------------- | ---------------------- |
| `POST`  | `/api/v1/ride/ride-request`   | Request a ride         |
| `PATCH` | `/api/v1/ride/cancel/:rideId` | Cancel a ride          |
| `GET`   | `/api/v1/ride/rider-history`  | Get rider ride history |

### 🚗 Driver Endpoints

| Method  | Endpoint                                  | Description                                                 |
| ------- | ----------------------------------------- | ----------------------------------------------------------- |
| `POST`  | `/api/v1/ride/accept-ride/:rideId`        | Accept a ride                                               |
| `PATCH` | `/api/v1/ride/update-ride-status/:rideId` | Update ride status (`picked_up`, `in_transit`, `completed`) |
| `GET`   | `/api/v1/ride/driver-history`             | Get driver ride history                                     |
| `GET`   | `/api/v1/ride/available-rides`            | View available ride requests                                |

### 👨‍💼 Admin Ride Endpoints

| Method | Endpoint                 | Description                 |
| ------ | ------------------------ | --------------------------- |
| `GET`  | `/api/v1/ride/all-rides` | View all rides (admin only) |

---

## 🧑‍✈️ Driver Profile & Status

> 🔐 Requires `driver` role

| Method  | Endpoint                      | Description                   |
| ------- | ----------------------------- | ----------------------------- |
| `PATCH` | `/api/v1/driver/availability` | Toggle driver online/offline  |
| `GET`   | `/api/v1/driver/earnings`     | View driver earnings          |
| `GET`   | `/api/v1/driver/profile`      | View driver profile           |
| `GET`   | `/api/v1/driver/all`          | View all drivers (admin only) |

---

## 📁 Suggested Folder Structure

```
src/
├── modules/
│   ├── auth/
│   ├── user/
│   ├── driver/
│   ├── ride/
├── middlewares/
├── config/
├── utils/
├── app.ts
```

---

## ✅ Functional Requirements

* ✅ JWT-based login with roles: `admin`, `rider`, `driver`
* ✅ Riders:

  * Request a ride
  * Cancel ride
  * View ride history
* ✅ Drivers:

  * Accept/Reject rides
  * Update ride status
  * View earnings
  * Toggle availability
* ✅ Admins:

  * Approve/suspend/block users
  * View all rides and users

---

## 📮 Status Codes

* `200 OK` – Successful GET, PATCH, or PUT
* `201 Created` – Resource created (e.g. user, ride)
* `400 Bad Request` – Invalid input
* `401 Unauthorized` – JWT missing or invalid
* `403 Forbidden` – Role not allowed
* `404 Not Found` – Resource not found

---

## 📬 API Testing

You can test all endpoints via:

🔗 **Postman Collection Link**
[Click to open collection](https://elias-3354528.postman.co/workspace/Elias's-Workspace~531fb3b6-7012-44f2-83b3-65dde3ddd942/collection/46589224-2d53f41f-227c-4a5f-bcdc-4f7d5c90c6b1?action=share&source=collection_link&creator=46589224)


## 🧠 Optional Enhancements

* 🚀 Driver ratings & feedback
* 💰 Fare estimation algorithm


---

## 🙌 Contributing

Feel free to open issues or submit pull requests!

---
