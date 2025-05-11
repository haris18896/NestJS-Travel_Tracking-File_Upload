# NestJS Travel Tracker

This repository contains a Travel Tracker application built with NestJS, a progressive Node.js framework for building efficient and scalable server-side applications. The application allows users to register, log in, and track their travel destinations.

## Table of Contents

- [Project Setup](#project-setup)
- [Project Structure](#project-structure)
- [Database Setup with Prisma and Neon](#database-setup-with-prisma-and-neon)
- [Authentication Implementation](#authentication-implementation)
- [Destination Management](#destination-management)
- [API Endpoints](#api-endpoints)
- [Development Commands](#development-commands)

## Project Setup

### Prerequisites

- Node.js
- npm
- NestJS CLI

### Installation

1. Install NestJS CLI globally:
   ```bash
   npm i -g @nestjs/cli
   ```

2. Create a new NestJS project:
   ```bash
   nest new travel-tracker
   ```

3. Install required dependencies:
   ```bash
   # For Prisma ORM
   npm install prisma @prisma/client
   
   # For configuration management
   npm i --save @nestjs/config
   
   # For validation
   npm i --save class-validator class-transformer
   
   # For authentication
   npm install --save @nestjs/jwt
   npm install --save @nestjs/passport @nestjs/jwt passport-jwt
   npm install --save-dev @types/passport-jwt
   
   # For DTO updates
   npm install @nestjs/mapped-types
   ```

4. Generate a JWT secret (for authentication):
   ```bash
   openssl rand -hex 64
   ```

## Project Structure

The Travel Tracker application follows a modular structure with the following components:

- **Auth Module**: Handles user registration and authentication
- **Destination Module**: Manages travel destinations CRUD operations
- **Prisma Module**: Provides database connectivity using Prisma ORM

## Database Setup with Prisma and Neon

1. Sign up for a [Neon](https://neon.tech) account and create a new project
2. Connect to the database and copy the connection URL
3. Create a `.env` file in the project root and add the database URL:
   ```
   DATABASE_URL="your-neon-connection-string"
   JWT_SECRET="your-generated-jwt-secret"
   ```

4. Initialize Prisma:
   ```bash
   npx prisma init
   ```

5. Design your schema in `prisma/schema.prisma`:
   ```prisma
   model User {
     id           Int           @id @default(autoincrement())
     email        String        @unique
     password     String
     createdAt    DateTime      @default(now())
     updatedAt    DateTime      @updatedAt
     destinations Destination[]
   }

   model Destination {
     id         Int       @id @default(autoincrement())
     name       String
     travelDate DateTime?
     notes      String?
     createdAt  DateTime  @default(now())
     updatedAt  DateTime  @updatedAt
     userId     Int
     user       User      @relation(fields: [userId], references: [id])
   }
   ```

6. Generate Prisma client and run migrations:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

## Authentication Implementation

Authentication is implemented using JWT (JSON Web Tokens) with the following components:

1. **Registration**: Users can register with email and password (password is hashed)
2. **Login**: Users can log in with credentials and receive a JWT token
3. **JWT Strategy**: Implemented to verify token authenticity
4. **Auth Guard**: Protects routes that require authentication

Key implementation files:
- `src/auth/auth.service.ts`: Contains logic for registration and login
- `src/auth/auth.controller.ts`: Exposes auth endpoints
- `src/auth/jwt.strategy.ts`: Implements JWT verification strategy
- `src/auth/dto/register.dto.ts`: Data validation for registration

## Destination Management

The Destination module allows users to manage their travel destinations with CRUD operations:

1. **Create**: Add new destinations with name, travel date, and notes
2. **Read**: Get a list of all destinations or a specific destination by ID
3. **Update**: Modify destination details
4. **Delete**: Remove destinations

Key implementation files:
- `src/destination/destination.service.ts`: Contains CRUD logic
- `src/destination/destination.controller.ts`: Exposes destination endpoints
- `src/destination/dto/destination.dto.ts`: Data validation for destinations

## API Endpoints

### Authentication

- **POST /auth/register** - Register a new user
- **POST /auth/login** - Login and get JWT token

### Destinations

- **GET /destination** - Get all destinations for authenticated user
- **GET /destination/:id** - Get specific destination by ID
- **POST /destination** - Create a new destination
- **PATCH /destination/:id** - Update a destination
- **DELETE /destination/:id** - Delete a destination

## Development Commands

- **Start the application**:
  ```bash
  npm run start
  ```

- **Start in development mode with watch**:
  ```bash
  npm run start:dev
  ```

- **Build the application**:
  ```bash
  npm run build
  ```

- **Run tests**:
  ```bash
  npm run test
  ```

- **Lint the code**:
  ```bash
  npm run lint
  ```

- **Format the code**:
  ```bash
  npm run format
  ```

## TypeScript Linting

For code quality and consistency, ESLint is configured with the following packages:

```bash
npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-prettier eslint-config-prettier
```

Add `"strictPropertyInitialization": false` to the `tsconfig.json` file to avoid property initialization errors.

Update the `eslint.config.mjs` file with appropriate rules:

```js
{
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/no-floating-promises': 'warn',
  '@typescript-eslint/no-unsafe-argument': 'warn',
  '@typescript-eslint/explicit-module-boundary-types': 'off',
  '@typescript-eslint/ban-ts-comment': 'off',
  '@typescript-eslint/no-unsafe-call': 'off',
  '@typescript-eslint/no-unused-vars': 'warn',
  '@typescript-eslint/no-unused-imports': 'warn',
  '@typescript-eslint/no-empty-object-type': 'off',
  '@typescript-eslint/no-empty-interface': 'off',
  '@typescript-eslint/no-unsafe-member-access': 'off',
  '@typescript-eslint/no-unsafe-assignment': 'off',
  '@typescript-eslint/no-unsafe-function-type': 'off',
  '@typescript-eslint/no-unsafe-return': 'off',
}
```

# File Upload Nest JS

This section demonstrates a file upload system built with NestJS, Prisma, and Cloudinary integration.

## Features

- **File Upload**: Upload files to Cloudinary cloud storage
- **File Management**: Store file metadata in a PostgreSQL database using Prisma
- **File Operations**: Search, retrieve, and delete uploaded files
- **Case-Insensitive Search**: Search files by filename, public ID, or URL with case-insensitive matching

## Setup

1. Create a Cloudinary account and get your credentials
2. Add the following environment variables to your `.env` file:
   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

3. Set up the Prisma schema with a File model:
   ```prisma
   model File {
     id        String   @id @default(uuid())
     filename  String
     publicId  String   @unique
     url       String
     createdAt DateTime @default(now())
     updatedAt DateTime @updatedAt
   }
   ```

4. Run Prisma migration to create the database table:
   ```bash
   npx prisma migrate dev --name init
   ```

## API Endpoints

- **POST /file-upload/upload** - Upload a file to Cloudinary
- **GET /file-upload/all** - Get all uploaded files
- **GET /file-upload/file/:id** - Get file details by ID
- **GET /file-upload/search?query=keyword** - Search for files by filename, public ID, or URL
- **DELETE /file-upload/delete/:id** - Delete a file from Cloudinary and database

## Implementation Details

The system uses:
- Multer for handling file uploads
- Cloudinary SDK for cloud storage
- Prisma ORM for database operations
- NestJS modules for organizing code structure

Files are temporarily stored in the uploads directory before being sent to Cloudinary, then the temporary files are automatically cleaned up.
