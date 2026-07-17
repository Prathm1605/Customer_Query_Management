# Customer Query Management Portal

A robust, enterprise-grade Customer Query Management System designed for streamlined issue tracking. This system bridges the gap between customer self-service and administrative triage, utilizing a **Role-Based Access Control (RBAC)** architecture to ensure data security and operational efficiency.

---

## 📌 Project Links

* **Live Demo:** http://3.109.214.192/
* **GitHub Repository:** https://github.com/Prathm1605/Customer_Query_Management

---

## 🚀 Architectural Highlights

* **Dynamic Role Engine:** A single, high-performance dashboard that conditionally renders interfaces for **Admins** and **Customers** using unified state management (JWT-based RBAC).
* **Modal-First Design:** Streamlined ticket creation via intuitive, reusable UI components that minimize context-switching for the end-user.
* **Backend-Driven Security:** API endpoints strictly isolate data; Customers can only access their own tickets, while Admins possess full system visibility.
* **Containerized Deployment:** Fully dockerized client and server environments deployed on **AWS EC2**, ensuring parity between local development and production.
* **Data Integrity:** Implemented a soft-delete strategy via Mongoose middleware to maintain historical audit trails without cluttering active dashboards.

---

## 🛠️ Technology Stack

* **Frontend:** React.js (Vite), Tailwind CSS
* **Backend:** Node.js, Express.js
* **Database:** MongoDB Atlas, Mongoose ODM
* **Authentication:** JSON Web Tokens (JWT), bcrypt
* **DevOps & Deployment:** Docker, Docker Compose, AWS EC2, Vercel

---

## 📋 Role-Based Feature Matrix

| Capability | Customer | Admin |
| --- | --- | --- |
| View System Dashboard | ✅ | ✅ |
| Submit New Tickets | ✅ | ✅ |
| View Own Tickets | ✅ | ❌ |
| View All System Tickets | ❌ | ✅ |
| Update Status/Priority | ❌ | ✅ |
| Soft Delete Records | ❌ | ✅ |

---

## 🗄️ Database Architecture (MongoDB)

### 1. Admin Collection

* `name` (String)
* `email` (String, Unique)
* `password` (String)
* `createdAt`, `updatedAt` (Timestamps)

### 2. Query Collection

* `customerName` (String)
* `customerEmail` (String)
* `subject` (String)
* `description` (String)
* `category` (Enum: Technical, Billing, Account, General)
* `priority` (Enum: Low, Medium, High)
* `status` (Enum: Open, In Progress, Resolved)
* `isDeleted` (Boolean) — *Powers the soft-delete architecture to maintain data integrity.*
* `createdBy` (ObjectId) — *Links to the User/Admin for Role-Based Access Control (RBAC).*
* `updatedBy` (ObjectId) — *Maintains an audit trail for status and priority modifications.*
* `createdAt`, `updatedAt` (Timestamps) — *Utilized for dashboard sorting and metric calculations.*

---

## ⚙️ Local Setup & Installation

### Prerequisites

* Docker and Docker Compose installed on your machine.
* MongoDB Atlas URI.

### Environment Variables

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development

```

Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:5000/api

```

### Running the Application (Docker)

1. Clone the repository:
```bash
git clone https://github.com/Prathm1605/Customer_Query_Management
cd Query_Management_System

```


2. Build and start the containers:
```bash
docker-compose up -d --build

```


3. Access the application:
* Frontend: `http://localhost:80` (or configured Vite port)
* Backend API: `http://localhost:5000`



---

## ✍️ Author

**Prathmesh Kulkarni**

* **GitHub:** https://github.com/Prathm1605
* **Email:** prathmeshkulkarni550@gmail.com
