# Hospital Billing System

A comprehensive web-based hospital billing management system built with Laravel and React/Inertia.js. The system enables efficient handling of patient transactions, voucher management, and secure authentication with role-based access control.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [System Requirements](#system-requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Architecture](#architecture)
- [User Roles](#user-roles)
- [API Integration](#api-integration)
- [Usage Guide](#usage-guide)
- [Database Schema](#database-schema)
- [Development](#development)
- [Project Structure](#project-structure)

## 🎯 Overview

Delta Surya Hospital Billing System is a full-featured billing management platform designed to streamline hospital operations. It combines a Point-of-Sale (POS) interface for cashiers and a voucher management system for marketing teams, with secure hybrid authentication.

## ✨ Features

### Core Features

- **Hybrid Authentication**: API-first validation with local role-based management
- **Role-Based Access Control**: Separate interfaces for Cashier and Marketing teams
- **Transaction Management**: Complete POS system for hospital billing
- **Voucher Management**: Create and manage patient discount vouchers
- **PDF Receipt Generation**: Professional receipt printing (A5 format)
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

### Cashier Features (Kasir)

- Point of Sale interface for transaction processing
- Search and filter procedures by insurance type
- Apply discount vouchers to transactions
- Calculate discounts automatically
- Generate and download PDF receipts
- View transaction history

### Marketing Features

- Create and manage discount vouchers
- Set validity periods with date pickers
- Manage insurance-linked vouchers
- Track voucher usage
- View all vouchers

## 🛠️ Technology Stack

### Backend

- **Framework**: Laravel 12.57.0
- **Language**: PHP 8.2+
- **Database**: MySQL/MariaDB
- **Authentication**: Hybrid (External API + Local Session)
- **PDF Generation**: Barryvdh\DomPDF

### Frontend

- **Framework**: React with Inertia.js
- **Styling**: Tailwind CSS + DaisyUI
- **UI Components**: Lucide Icons
- **Date Picker**: React Day Picker (date-fns)
- **State Management**: Inertia.js props
- **Build Tool**: Vite

### Development

- **Package Manager**: Composer (PHP), npm (Node.js)
- **Testing**: PHPUnit
- **Code Quality**: ESLint, Prettier

## 📦 System Requirements

- PHP 8.2 or higher
- Node.js 18+ and npm 9+
- MySQL 8.0+ / MariaDB 10.5+
- Composer 2.0+
- Modern web browser with JavaScript enabled

## 🚀 Installation

### 1. Clone Repository

```bash
git clone <repository-url>
cd hospital-billing
```

### 2. Install Dependencies

```bash
# PHP dependencies
composer install

# JavaScript dependencies
npm install
```

### 3. Environment Setup

```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 4. Database Setup

```bash
# Run migrations
php artisan migrate

# Seed database (optional)
php artisan migrate:fresh --seed
```

### 5. Build Frontend Assets

```bash
# Development
npm run dev

# Production
npm run build
```

### 6. Start Development Server

```bash
# Terminal 1: PHP Development Server
php artisan serve

# Terminal 2: Vite Dev Server
npm run dev
```

The application will be available at `http://localhost:8000`

## ⚙️ Configuration

### Environment Variables (.env)

```env
# Application
APP_NAME="Hospital Billing"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=hospital_billing
DB_USERNAME=root
DB_PASSWORD=

# API Configuration
RS_API_ENDPOINT=https://recruitment.rsdeltasurya.com/api/v1
```

### API Credentials

Credentials are provided at login and validated against RS Delta Surya API:

- **Email**: User email address
- **Password**: Phone number (used as password)

## 🏗️ Architecture

### Authentication Flow

```
User Login Request
    ↓
Validate against RS Delta Surya API
    ↓
API Returns Success
    ↓
Find or Create Local User
    ↓
Set Session & Store API Token
    ↓
Redirect Based on User Role
    ├─ Marketing → /vouchers
    └─ Cashier (default) → /transactions
```

### Directory Structure

```
hospital-billing/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── VoucherController.php
│   │   │   ├── TransactionController.php
│   │   │   └── Auth/
│   │   ├── Middleware/
│   │   │   └── CheckRole.php
│   │   └── Requests/
│   ├── Models/
│   │   ├── User.php
│   │   ├── Voucher.php
│   │   ├── Transaction.php
│   │   └── TransactionDetail.php
│   └── Providers/
├── resources/
│   ├── js/
│   │   ├── Pages/
│   │   │   ├── Transactions/
│   │   │   └── Vouchers/
│   │   └── Layouts/
│   └── views/
│       ├── app.blade.php
│       └── pdf/
│           └── receipt.blade.php
├── routes/
│   ├── web.php
│   └── auth.php
├── database/
│   ├── migrations/
│   └── seeders/
└── storage/
    └── app/
        └── private/
```

## 👥 User Roles

### 1. Kasir (Cashier) - Default Role

**Responsibilities:**

- Process patient transactions
- Apply discount vouchers
- Generate receipts
- Manage payment processing

**Access:**

- Dashboard
- Transactions (POS)
- Transaction history
- PDF receipt generation

**Routes:** `/transactions/*`

### 2. Marketing

**Responsibilities:**

- Create and manage discount vouchers
- Set voucher validity periods
- Manage insurance-specific vouchers
- Track voucher effectiveness

**Access:**

- Dashboard
- Vouchers management
- Create/edit vouchers
- View voucher history

**Routes:** `/vouchers/*`

## 🔗 API Integration

### External API: RS Delta Surya

#### Authentication Endpoint

```
POST https://recruitment.rsdeltasurya.com/api/v1/auth
```

Request:

```json
{
    "email": "user@example.com",
    "password": "08123456789"
}
```

Response:

```json
{
    "status": true,
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
        "id": 1,
        "name": "John Doe",
        "email": "user@example.com"
    }
}
```

#### Data Endpoints

**Get Insurances:**

```
GET /api/v1/insurances
Authorization: Bearer {token}
```

**Get Procedures:**

```
GET /api/v1/procedures
Authorization: Bearer {token}
```

Response Structure:

```json
{
    "status": true,
    "insurances": [{ "id": 1, "name": "Asuransi Kesehatan", "percentage": 80 }],
    "procedures": [{ "id": 1, "name": "Pemeriksaan Umum", "price": 50000 }]
}
```

## 📖 Usage Guide

### For Cashiers (Kasir)

1. **Login**
    - Enter email and phone number
    - System authenticates against API
    - Automatically redirected to transactions

2. **Process Transaction**
    - Search and select procedures
    - Adjust quantities
    - Select insurance type
    - Apply voucher (optional)
    - Review discount calculations
    - Confirm transaction

3. **Generate Receipt**
    - Click "Print" button
    - PDF opens in new tab
    - Print or save

### For Marketing Team

1. **Login**
    - Enter email and phone number
    - System authenticates against API
    - Redirected to vouchers management

2. **Create Voucher**
    - Fill voucher details
    - Select insurance type
    - Set validity dates (auto-close date picker)
    - Set discount percentage
    - Submit form

3. **Manage Vouchers**
    - View all vouchers in table
    - Edit existing vouchers
    - Dates display in readable format (MMM dd, yyyy)
    - Delete vouchers

## 🗄️ Database Schema

### Users Table

```sql
- id: uuid
- name: string
- email: string (unique)
- password: string (hashed)
- role: string (kasir, marketing) [default: kasir]
- api_token: string (API token from RS Delta Surya)
- created_at, updated_at
```

### Vouchers Table

```sql
- id: uuid
- code: string (unique)
- insurance_id: integer (foreign)
- discount_percentage: decimal
- valid_from: date
- valid_until: date
- created_at, updated_at
```

### Transactions Table

```sql
- id: uuid
- user_id: uuid (foreign to users)
- insurance_id: integer
- subtotal: decimal
- discount: decimal
- discount_type: string (percentage, fixed)
- total: decimal
- voucher_id: uuid (foreign, nullable)
- status: string (completed, pending, cancelled)
- created_at, updated_at
```

### TransactionDetails Table

```sql
- id: uuid
- transaction_id: uuid (foreign)
- procedure_id: integer
- quantity: integer
- unit_price: decimal
- subtotal: decimal
- created_at, updated_at
```

## 💻 Development

### Running Development Server

```bash
# Terminal 1: Laravel Server
php artisan serve

# Terminal 2: Vite Dev Server (auto-compiles on changes)
npm run dev
```

### Database Migrations

```bash
# Create new migration
php artisan make:migration create_table_name

# Run migrations
php artisan migrate

# Rollback migrations
php artisan migrate:rollback

# Fresh migration
php artisan migrate:fresh --seed
```

### Code Quality

```bash
# Run tests
php artisan test

# Format code
npm run format

# Lint code
npm run lint
```

### Building for Production

```bash
# Build assets
npm run build

# Optimize
php artisan optimize

# Cache config
php artisan config:cache
```

## 🔐 Security Features

- **Hybrid Authentication**: Validates credentials against external API
- **Role-Based Middleware**: Protects routes by user role
- **CSRF Protection**: Built-in Laravel CSRF tokens
- **Password Hashing**: Bcrypt hashing for local passwords
- **API Token Management**: Secure session storage of API tokens
- **XSS Protection**: React's automatic XSS prevention

## 📱 Responsive Design

The application is fully responsive:

- **Desktop**: Full feature access with optimized layout
- **Tablet**: Touch-friendly interface elements
- **Mobile**: Stacked layout with dropdown menus
- Date pickers positioned for optimal mobile experience (dropdown-top)

## 🐛 Troubleshooting

### Login Issues

- Verify email format is correct
- Ensure phone number is used as password
- Check API connectivity to RS Delta Surya

### PDF Generation

- Ensure storage directory has write permissions
- Check DomPDF is installed: `composer show barryvdh/laravel-dompdf`

### Database Connection

- Verify database credentials in `.env`
- Ensure MySQL/MariaDB service is running
- Check database exists: `mysql -u root -p hospital_billing`

### Frontend Issues

- Clear browser cache
- Rebuild assets: `npm run build`
- Check console for JavaScript errors

## 📝 API Response Codes

| Code | Description                          |
| ---- | ------------------------------------ |
| 200  | Success                              |
| 400  | Bad Request                          |
| 401  | Unauthorized                         |
| 403  | Forbidden (insufficient permissions) |
| 404  | Not Found                            |
| 422  | Validation Error                     |
| 500  | Server Error                         |

## 📞 Support & Contact

For issues or questions:

- Review this README
- Check Laravel & React documentation
- Contact development team

## 📄 License

This project is proprietary to RS Delta Surya Hospital.

## ✅ Checklist for Deployment

- [ ] Environment variables configured
- [ ] Database migrations run successfully
- [ ] API endpoints accessible
- [ ] Frontend assets built
- [ ] Admin user created
- [ ] Email configuration tested
- [ ] Error logging configured
- [ ] HTTPS enabled
- [ ] Backups configured
- [ ] Monitoring enabled

---

**Version**: 1.0.0  
**Last Updated**: April 29, 2026  
**Built with** ❤️ for RS Delta Surya Hospital
