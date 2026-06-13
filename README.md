# Royal Palace Hotel Booking & Hospitality Management Platform

A comprehensive full-stack hospitality management platform built with Next.js, TypeScript, MongoDB, Redux Toolkit, JWT Authentication, and REST APIs.

The platform enables customers to book luxury rooms & suites, reserve dining tables, schedule events and meeting venues, manage reservations, maintain account balances, and track booking transactions through a centralized hospitality management system.

---

# Project Overview

Royal Palace Hotel Booking Platform is an enterprise-grade hotel reservation and hospitality management application designed for luxury hotels, resorts, and premium hospitality businesses.

The system provides complete booking lifecycle management for:

- Rooms & Suites
- Dining Reservations
- Events & Meeting Venues
- Customer Accounts
- Booking Cart Management
- Wallet & Transactions
- Administrative Operations

---

# Core Modules

## Rooms & Suites Reservation

Guests can browse and reserve premium accommodation categories.

### Available Rooms

- Deluxe Room
- Premier Room
- Premier Plus Room
- Luxury Room

### Available Suites

- Deluxe Suite
- Luxury Suite
- Kohinoor Suite
- The Oberoi Suite

Features:

- Dynamic Date Selection
- Guest Capacity Validation
- Availability Checking
- Reservation Locking
- Booking Confirmation

---

## Dining Reservation System

Customers can reserve tables across multiple dining venues.

### Restaurants & Dining Venues

- Cal 27
- Chinoiserie
- Grill By The Pool
- La Patisserie And Deli
- Sonargaon
- Souk
- The Chambers
- The Junction
- The Promenade Lounge

Features:

- Table Reservation
- Guest Count Selection
- Date Based Availability
- Reservation Management

---

## Events & Meeting Room Reservation

Customers can reserve event venues and meeting rooms for business and social events.

### Available Venues

- Banquet Lawns
- Crystal Hall
- Mandarin
- Oriental
- Portico
- Terrace Garden

Features:

- Venue Booking
- Seating Arrangement Selection
- Food Service Selection
- Multi-Day Reservations
- Availability Validation

---

# Event Booking Models

The platform supports three event booking strategies.

## Single Date Booking

Reserve a venue for one specific date.

Example:

```text
15 June 2026
```

---

## Continuous Multi-Date Booking

Reserve a venue across consecutive dates.

Example:

```text
10 June 2026
to
15 June 2026
```

---

## Non-Continuous Multi-Date Booking

Reserve a venue across independent dates.

Example:

```text
10 June 2026
15 June 2026
22 June 2026
30 June 2026
```

---

# Customer Features

## Authentication

- Customer Registration
- Secure Login
- Logout
- JWT Authentication

---

## Profile Management

- View Profile
- Edit Personal Information
- Change Password

---

## Booking Features

- Rooms & Suites Booking
- Dining Reservation
- Event Venue Booking
- Booking Availability Check
- Reservation Confirmation

---

## Cart System

Separate cart management for:

- Rooms & Suites
- Dining Reservations
- Events & Meeting Reservations

Features:

- Add To Cart
- View Cart
- Delete Cart Items
- Booking Conversion

---

## Booking Management

### Current Bookings

Customers can:

- View Active Reservations
- Track Reservation Details

### Past Bookings

Customers can:

- View Booking History
- Review Previous Reservations

---

## Wallet System

Integrated customer wallet management.

Features:

- Add Money
- Deduct Money
- Balance Tracking
- Transaction History

---

# Administrative Features

## Admin Authentication

- Admin Login
- Admin Session Management

---

## Booking Management

### Current Bookings

View:

- Rooms Bookings
- Dining Reservations
- Event Reservations

### Past Bookings

Access complete historical reservation records.

---

## Transaction Management

Administrators can:

- View Customer Transactions
- Monitor Financial Activities
- Manage Booking Payments

---

## Booking Activity Monitoring

Track:

- Room Booking Activities
- Dining Booking Activities
- Event Booking Activities
- Combined Reservation Reports

---

# Reservation Locking System

The platform implements a reservation locking mechanism to prevent double bookings.

### Features

- Real-Time Availability Validation
- Temporary Resource Locking
- Lock Expiration Handling
- Booking Confirmation Processing
- Automatic Unlock Mechanism
- Overbooking Prevention

### Lock Workflow

```text
Availability Check
        ↓
Temporary Lock
        ↓
Customer Confirmation
        ↓
Booking Creation
        ↓
Lock Released
```

---

# Booking Workflow

```text
Select Service
       ↓
Select Date
       ↓
Check Availability
       ↓
Add To Cart
       ↓
Proceed To Booking
       ↓
Payment Validation
       ↓
Booking Confirmation
       ↓
Reservation Created
```

---

# Wallet Workflow

```text
Create Account
      ↓
Add Funds
      ↓
Book Service
      ↓
Amount Deducted
      ↓
Transaction Recorded
```

---

# Technology Stack

| Category | Technology |
|----------|------------|
| Frontend | Next.js 15 |
| Language | TypeScript |
| Backend | Next.js Route Handlers |
| Database | MongoDB |
| Authentication | JWT |
| State Management | Redux Toolkit |
| Styling | CSS Modules |
| API Architecture | REST API |
| Hosting | Vercel / Node.js |
| Package Manager | npm |

---

# Project Structure

```text
src/
├── app/
├── api/
├── components/
├── database models/
├── interface/
├── functions/
├── redux store/
├── json objects/
├── constant string files/
└── database config/
```

---

# Database Collections

## User Collections

- Hotel Customers
- Customer Transactions

---

## Booking Collections

### Rooms & Suites

- Room Cart
- Room Booking
- Hotel Room Availability

### Dining

- Dining Cart
- Dining Booking
- Hotel Dining Availability

### Events & Meetings

- Single Date Booking
- Continuous Date Booking
- Non-Continuous Date Booking
- Venue Availability

---

# API Modules

The application contains REST APIs for:

## Authentication APIs

- Register Customer
- Login Customer
- Logout Customer
- Admin Login
- Admin Logout

---

## Booking APIs

### Rooms & Suites

- Availability Check
- Add Cart
- Add Booking
- View Booking
- Delete Booking

### Dining

- Availability Check
- Add Cart
- Add Booking
- View Booking
- Delete Booking

### Events & Meetings

- Availability Check
- Add Cart
- Add Booking
- View Booking
- Delete Booking

---

## Wallet APIs

- Add Money
- Deduct Money
- View Balance
- View Transactions

---

# Environment Variables

Create a `.env.local` file:

```env
MONGODB_URI=

JWT_SECRET_KEY=

URL=
```

---

# Installation

## Clone Repository

```bash
git clone <repository-url>
```

## Install Dependencies

```bash
npm install
```

## Start Development Server

```bash
npm run dev
```

Application will start on:

```text
http://localhost:3000
```


---

# License

MIT License

---

# Author

Royal Palace Hotel Booking Platform Development Team
