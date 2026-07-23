# Full Stack E-Commerce Backend

A RESTful API for an E-Commerce platform built using Node.js, Express.js, and MongoDB.

This project provides secure authentication and product management functionalities for an online shopping platform.

---

## Features

- User Authentication
- OTP Verification
- JWT Authentication
- Role-Based Authorization
- Product Management (CRUD Operations)
- Product Ratings
- Stock Management
- Featured Products
- Discount Price Management
- Image Uploads
- Input Validation using Joi
- Password Hashing using bcrypt
- Email Verification using Nodemailer
- Rate Limiting
- Error Handling

---

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (JSON Web Token)
- Joi
- bcrypt.js
- Nodemailer
- Multer
- Express Rate Limit
- dotenv

---

## Authentication APIs

- Register User
- Login User
- Verify OTP
- Resend OTP
- Forgot Password
- Reset Password

---

## Product APIs

- Create Product
- Get All Products
- Get Product By ID
- Update Product
- Delete Product

---

## Product Features

- Product Name
- Description
- Price
- Discount Price
- Category
- Brand
- Stock
- Product Image Cover
- Product Images
- Ratings Average
- Ratings Quantity
- Featured Products
- Active Products

---

## Security Features

- Password Hashing
- JWT Authentication
- Role-Based Access Control
- Rate Limiting
- Request Validation
- Secure Environment Variables

---

## Running the Project

Install dependencies:

```bash
npm install
```

Run the project in development mode:

```bash
npm run dev
```

---

## Environment Variables

Create a `.env` file and add the following:

```env
PORT=

MONGO_URI=

JWT_SECRET=

EMAIL_USER=

EMAIL_PASS=
```

---

## API Endpoints

### Authentication

```http
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/verify-otp
POST /api/v1/auth/resend-otp
POST /api/v1/auth/forgot-password
POST /api/v1/auth/reset-password
```

### Products

```http
POST /api/v1/product/create
GET /api/v1/product
GET /api/v1/product/:id
PUT /api/v1/product/update/:id
DELETE /api/v1/product/delete/:id
```

---

## Project Status

This project is currently under active development.

---

## Author

Marwa Youssef

Junior Full-Stack Developer

React | Node.js | MongoDB
