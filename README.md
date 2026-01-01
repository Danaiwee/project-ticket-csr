<img width="1080" height="1080" alt="1" src="https://github.com/user-attachments/assets/45d1fd51-c635-41da-b757-467ee2bd382c" />
<img width="1080" height="1080" alt="2" src="https://github.com/user-attachments/assets/adef6abd-941c-4ba3-a50e-efb9a11a8793" />



# **TicketSpace – Full-Stack Booking & GIS Visualization System**

TicketSpace is a **modern booking platform** designed for tourist attractions, featuring an integrated **GIS visualization layer**. Built with a decoupled architecture, it uses **Next.js 16** for a highly interactive frontend and **Express** for a robust, type-safe backend API. The system manages complex booking flows, real-time capacity checks, and spatial data rendering using **Leaflet**.

---

## **Backend & Server-Side Services**

- **Express.js API (TypeScript)**:  
  - High-performance RESTful API handling **Booking CRUD** and **Admin operations**.  
  - Implements **Middleware** for authentication (JWT), logging (Pino), and CORS handling.

- **Prisma ORM with PostgreSQL**:  
  - Utilizes **Prisma** for type-safe database access and migrations.  
  - Hosted on **Neon Database (Serverless PostgreSQL)** for scalable storage.  
  - Schema includes relations for Users, Locations, and Bookings with strict constraints.

- **Security & Authentication**:  
  - **JWT (JSON Web Tokens)** & **bcryptjs** for secure user sessions and password hashing.  
  - **Cookie-parser** for handling secure, HTTP-only authentication cookies.

- **Logging & Monitoring**:  
  - **Pino & Pino-pretty** for structured, high-performance logging during development and production.

- **Data Validation & Parsing**:  
  - **Zod** for schema validation on all incoming request bodies.  
  - **csv-parser** for potential bulk data imports of location or GIS info.

---

## **Frontend Development**

- **Next.js 16 (App Router)**:  
  - Leveraging the latest **React 19** features for high-performance rendering.  
  - Hybrid approach using **Server Components** for SEO/Security and **Client Components** for interactivity.

- **GIS Mapping (Leaflet & React-Leaflet)**:  
  - Interactive map integration to visualize geographical data.  
  - Custom layers and markers to display attraction locations dynamically.

- **State & Form Management**:  
  - **React Hook Form** with **Zod** resolvers for robust, type-safe client-side validation.  
  - Custom UI components powered by **shadcn/ui** and **Radix UI**.

- **Testing Environment**:  
  - **Jest & React Testing Library** for comprehensive unit and integration testing.  
  - Simulated user interactions with **@testing-library/user-event**.

---

## **Application Features & Page Flow**

### **1. Home & Discovery Page** - Features an **Interactive GIS Map** allowing users to browse locations visually.  
- Displays available attractions with real-time status.

### **2. Dynamic Booking System** - Users can select dates (via **React Day Picker**) and specify the number of visitors.  
- Automated **price calculation** and **capacity validation** via Backend.  
- Prevents duplicate bookings based on name and email per location.

### **3. Admin Management Portal** - **Admin-only access** to view all system bookings and user details.  
- Ability to **Update Capacity Limits** and manage location availability dynamically.  
- **Local Searchbar** for quick filtering of attractions and records.

### **4. Cancellation & Seat Recovery** - Support for booking cancellation via email validation.  
- Instant recovery of available seats upon cancellation, triggering "Seats Available" notifications.

---

## **Technologies Used**

### **Backend Stack**
- ![Express](https://img.shields.io/badge/-Express-000000?logo=express&logoColor=white&style=flat) **Express.js**
- ![Prisma](https://img.shields.io/badge/-Prisma-2D3748?logo=prisma&logoColor=white&style=flat) **Prisma ORM**
- ![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-4169E1?logo=postgresql&logoColor=white&style=flat) **PostgreSQL (Neon)**
- ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white&style=flat) **TypeScript (tsx)**
- ![JWT](https://img.shields.io/badge/-JWT-000000?logo=jsonwebtokens&logoColor=white&style=flat) **JSON Web Tokens**

### **Frontend Stack**
- ![Next.js](https://img.shields.io/badge/-Next.js-000000?logo=next.js&logoColor=white&style=flat) **Next.js 16 (React 19)**
- ![Leaflet](https://img.shields.io/badge/-Leaflet-199900?logo=leaflet&logoColor=white&style=flat) **Leaflet**
- ![TailwindCSS](https://img.shields.io/badge/-Tailwind%20CSS-38B2AC?logo=tailwindcss&logoColor=white&style=flat) **Tailwind CSS 4**
- ![Jest](https://img.shields.io/badge/-Jest-C21325?logo=jest&logoColor=white&style=flat) **Jest & RTL**
- ![Zod](https://img.shields.io/badge/-Zod-3E64FF?logo=zod&logoColor=white&style=flat) **Zod Validation**

---

## **Installation & Getting Started**
Follow these steps to set up the project locally.

**Prerequisites**
- Node.js (v18 or higher)
- PostgreSQL Database account

### **1. Clone the Repository**
First, clone the project to your local machine:
```bash
git clone https://github.com/Danaiwee/project-ticket-csr.git

cd project-ticket-csr
```


### **Backend**
Navigate to the backend directory and set up the API server:
```bash
cd backend

npm install

# Sync database schema and generate Prisma client
npx prisma generate
npx prisma db push

# Run the seed file to initialize data
npx tsx prisma/seed.ts

# Start development server
npm run dev
```

### **Frontend**
Open a new terminal session and set up the Next.js application:
```bash
cd frontend

npm install

# Start development server
npm run dev
```

## **Conclusion**

**TicketSpace** demonstrates a scalable architectural pattern for community platforms requiring **real-time resource management** and **spatial data visualization**. By decoupling the **Express/Prisma** backend from the **Next.js** frontend, the system achieves clear separation of concerns, high type-safety, and robust performance. This project serves as a comprehensive example of a modern full-stack application capable of handling complex business logic and GIS integration.
