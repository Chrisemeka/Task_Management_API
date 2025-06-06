# Task Management API

A RESTful API for managing tasks with user authentication built with Node.js, Express, TypeScript, and Prisma ORM.

## Features

- **User Authentication**: Register, login, and password reset functionality
- **Task Management**: Create, read, update, and delete tasks
- **JWT Authorization**: Secure API endpoints with JSON Web Tokens
- **Database Integration**: SQLite database with Prisma ORM
- **TypeScript**: Full type safety and better development experience
- **Error Handling**: Centralized error handling middleware

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: SQLite
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Development**: Nodemon for hot reloading

## Prerequisites

Before running this project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd task_management-_api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory and add the following:
   ```env
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="your-super-secret-jwt-key-here"
   PORT=5000
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma db push
   ```

5. **Build the project**
   ```bash
   npm run build
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```
This will start the server with hot reloading on `http://localhost:5000`

### Production Mode
```bash
npm start
```
This will run the compiled JavaScript from the `dist` folder

## API Endpoints

### Authentication Endpoints

#### Register a New User
```http
POST /users/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

#### Login
```http
POST /users/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

#### Reset Password
```http
PUT /users/reset-password
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "email": "user@example.com",
  "newPassword": "yournewpassword"
}
```

### Task Endpoints

All task endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

#### Get All Tasks
```http
GET /api/tasks
```

#### Get a Specific Task
```http
GET /api/tasks/:id
```

#### Create a New Task
```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Task Title",
  "description": "Task Description (optional)",
  "userId": 1
}
```

#### Update a Task
```http
PUT /api/tasks/:id
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated Description",
  "completed": true
}
```

#### Delete a Task
```http
DELETE /api/tasks/:id
```

## Database Schema

### User Model
```prisma
model User {
  id       Int    @id @default(autoincrement())
  email    String @unique
  password String
  tasks    Task[]
}
```

### Task Model
```prisma
model Task {
  id          Int     @id @default(autoincrement())
  title       String
  description String?
  completed   Boolean @default(false)
  userId      Int
  user        User    @relation(fields: [userId], references: [id])
}
```

## Project Structure

```
src/
├── middleware/
│   ├── auth.ts          # JWT authentication middleware
│   └── errorHandler.ts  # Global error handling middleware
├── routes/
│   ├── task.ts          # Task-related routes
│   └── user.ts          # User authentication routes
├── types/
│   └── task.ts          # TypeScript type definitions
├── index.ts             # Main application entry point
└── prisma.ts            # Prisma client configuration

prisma/
└── schema.prisma        # Database schema definition
```

## Scripts

- `npm run dev` - Start development server with hot reloading
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma db push` - Push schema changes to database

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | SQLite database file path | `file:./dev.db` |
| `JWT_SECRET` | Secret key for JWT token signing | Required |
| `PORT` | Server port number | `5000` |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Troubleshooting

### Common Issues

1. **Database connection errors**
   - Make sure the `DATABASE_URL` in your `.env` file is correct
   - Run `npx prisma db push` to ensure the database is set up

2. **JWT token errors**
   - Ensure your `JWT_SECRET` is set in the `.env` file
   - Make sure you're including the Bearer token in your requests

3. **TypeScript compilation errors**
   - Run `npm run build` to check for any TypeScript errors
   - Ensure all dependencies are installed with `npm install`

## Support

If you encounter any issues or have questions, please open an issue in the repository.
