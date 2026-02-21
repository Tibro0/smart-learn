# Smart Learn Website

A Brief Description of Your Laravel Project and Its Purpose.

## ✨ Features

- React Js
- RESTful API Endpoints
- Authentication & Authorization
- Database Migrations & Seeders
- Task Scheduling With Laravel Scheduler
- Queue Jobs For Background Processing

## 📋 Prerequisites

Before you begin, ensure you have met the following requirements:

- PHP >= 8.3.29
- Composer 8.3.29
- Node.js >= 22.22.0
- NPM or Yarn
- Database (MySQL)
- Web server (Apache/Nginx) or PHP built-in server
- REST API

## 🚀 Installation

Follow these steps to set up the project locally:

1. **Clone the repository**

```bash
git clone https://github.com/Tibro0/smart-learn.git smart-learn
cd smart-learn
code .
```

2. **Install PHP Dependencies**

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

3. **Configure Environment Variables** <br>
   Edit the .env file with your database credentials and other settings:

```bash
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

4. **Run database migrations and seeders**

```bash
php artisan migrate:fresh --seed
```

5. **Start Backend Development Server**

```bash
php artisan serve
```
5. **Install Node JS Dependencies**

```bash
cd frontend
npm install
npm run dev
```

5. **Start Frontend Development Server**

```bash
http://localhost:5173/
```
