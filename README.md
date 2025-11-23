# Drone Medication Delivery System

A REST API service for managing a fleet of drones that deliver medications. Built with NestJS, TypeScript, PostgreSQL, and following the Result-oriented programming pattern.

## Features

### API Endpoints

- **Health Check** (`GET /health`): Check service health and availability
- **Drone Registration** (`POST /drones`): Register new drones with serial number, model, weight limit, and battery capacity
- **List All Drones** (`GET /drones`): Retrieve all registered drones in the fleet
- **Available Drones** (`GET /drones/available`): Get drones that are IDLE and have battery >= 25% (ready for loading)
- **Acquire Drone** (`POST /drones/:id/acquire`): Start a loading session for a specific drone
- **Check Loaded Medications** (`GET /drones/:id/medications`): View all medications currently loaded on a specific drone
- **Load Medication** (`POST /sessions/:id/load-medication`): Add medications to a drone during an active loading session

### Background Services

- **Battery Monitoring**: Automatic battery level audit logging every 5 minutes for all drones

### Business Rules & Validations

- **Drone Registration**:
  - Serial numbers must be unique (max 100 characters)
  - Weight limit cannot exceed 500 grams
  - Battery capacity must be between 0-100%
  - Supported models: Lightweight, Middleweight, Cruiserweight, Heavyweight

- **Loading Session**:
  - Only IDLE drones can start a loading session
  - Drone battery must be >= 25% to acquire/start loading
  - Once acquired, drone state changes to LOADING

- **Medication Loading**:
  - Only drones in LOADING state can have medications added
  - Total weight of all medications cannot exceed drone's weight limit
  - Battery must remain >= 25% during loading operations
  - Multiple loads of the same medication accumulate quantities

## Technology Stack

- **Framework**: NestJS 11
- **Language**: TypeScript 5.9
- **Database**: PostgreSQL 15
- **ORM**: TypeORM 0.3
- **Package Manager**: Yarn 4.6.0
- **Architecture**: Result-oriented programming pattern (similar to Rust's Result<T, E>)
- **Scheduling**: @nestjs/schedule for periodic tasks

## Prerequisites

- Node.js 18+
- Yarn 4.6.0 (or use Corepack: `corepack enable`)
- Docker and Docker Compose (for local database)

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd bludrone
```

2. Install dependencies:

```bash
yarn install
```

3. Set up environment variables (see [Environment Variables](#environment-variables) section)

4. Start the database using Docker Compose:

```bash
# For development
# Start all services (database + app)
yarn docker:dev

# Or for production
# Start all services (database + app)
yarn docker:prod
```

5. Run the application:

```bash
# Development mode with hot reload
yarn start:watch

# Or production mode
yarn build
yarn start
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5433
DATABASE_USER=bluser
DATABASE_PASSWORD=secret
DATABASE_NAME=bludrone

# Application Configuration
PORT=3000
NODE_ENV=development
```

**Note**: The default values match the Docker Compose configuration. Adjust as needed for your environment.

## API Endpoints

All endpoints are prefixed with `/api/v1`.

### Health Check

#### `GET /health`

Check if the service is running.

**Response:**

```json
{
  "status": "success",
  "message": "Service is healthy",
  "data": {
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

### Drone Endpoints

#### `POST /drones`

Register a new drone.

**Request Body:**

```json
{
  "serial_number": "DRONE001",
  "model": "Lightweight",
  "weight_limit": 100,
  "battery_capacity": 100
}
```

**Validation Rules:**

- `serial_number`: String, max 100 characters, must be unique
- `model`: Enum - `Lightweight`, `Middleweight`, `Cruiserweight`, `Heavyweight`
- `weight_limit`: Number, 0-500 grams
- `battery_capacity`: Number, 0-100 percentage

**Response:**

```json
{
  "status": "success",
  "message": "Drone registered successfully",
  "data": {
    "id": "uuid",
    "serial_number": "DRONE001",
    "model": "Lightweight",
    "weight_limit": 100,
    "battery_capacity": 100,
    "state": "IDLE",
    "current_weight": 0,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### `GET /drones`

Get all registered drones.

**Response:**

```json
{
  "status": "success",
  "message": "Drones fetched successfully",
  "data": [
    {
      "id": "uuid",
      "serial_number": "DRONE001",
      "model": "Lightweight",
      "weight_limit": 100,
      "battery_capacity": 100,
      "state": "IDLE",
      "current_weight": 0,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### `GET /drones/available`

Get all drones available for loading (IDLE state with battery >= 25%).

**Response:**

```json
{
  "status": "success",
  "message": "Available drones fetched successfully",
  "data": [
    {
      "id": "uuid",
      "serial_number": "DRONE001",
      "model": "Lightweight",
      "weight_limit": 100,
      "battery_capacity": 85,
      "state": "IDLE",
      "current_weight": 0,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### `POST /drones/:id/acquire`

Start a loading session for a drone. The drone must be IDLE and have battery >= 25%.

**Parameters:**

- `id`: Drone UUID

**Response:**

```json
{
  "status": "success",
  "message": "Loading session started",
  "data": {
    "session_id": "uuid"
  }
}
```

**Error Responses:**

- `400 Bad Request`: Drone is not IDLE or battery too low
- `404 Not Found`: Drone not found

#### `GET /drones/:id/medications`

Get all medications currently loaded on a drone.

**Parameters:**

- `id`: Drone UUID

**Response:**

```json
{
  "status": "success",
  "message": "Loaded medications fetched successfully",
  "data": {
    "drone_id": "uuid",
    "medications": [
      {
        "id": "uuid",
        "medication": {
          "id": "uuid",
          "name": "Paracetamol_500mg",
          "weight": 5,
          "code": "PARA_500",
          "image": "https://example.com/images/paracetamol.jpg",
          "createdAt": "2024-01-01T00:00:00.000Z",
          "updatedAt": "2024-01-01T00:00:00.000Z"
        },
        "quantity": 10,
        "loaded_at": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

**Error Responses:**

- `404 Not Found`: Drone not found

### Session Endpoints

#### `POST /sessions/:id/load-medication`

Load medication onto a drone during an active loading session.

**Parameters:**

- `id`: Session UUID

**Request Body:**

```json
{
  "session_id": "uuid",
  "medication_id": "uuid",
  "quantity": 5
}
```

**Validation Rules:**

- `session_id`: UUID, must match the session ID in the URL
- `medication_id`: UUID, must be a valid medication
- `quantity`: Number, minimum 1

**Response:**

```json
{
  "status": "success",
  "message": "Medication loaded successfully",
  "data": {
    "id": "uuid",
    "drone_id": "uuid",
    "medication_id": "uuid",
    "quantity": 5,
    "loaded_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**

- `400 Bad Request`:
  - Weight limit exceeded
  - Battery too low (< 25%)
  - Drone not in LOADING state
- `404 Not Found`: Session or medication not found

## Database Setup

The database is automatically initialized with:

- Schema creation (tables, indexes, constraints)
- Seed data (10 sample drones and 10 sample medications)

The initialization scripts are in the `init_scripts/` directory and run automatically when the PostgreSQL container starts for the first time.

## Project Structure

```
bludrone/
├── src/
│   ├── features/
│   │   ├── audit/          # Battery audit logging
│   │   ├── drones/         # Drone management
│   │   │   ├── controllers/
│   │   │   ├── dto/
│   │   │   ├── entities/
│   │   │   ├── models/
│   │   │   ├── payload/
│   │   │   ├── repository/
│   │   │   └── services/
│   │   └── medications/    # Medication management
│   ├── core/               # Core utilities
│   │   ├── errors/         # Error handling
│   │   ├── filters/        # HTTP exception filters
│   │   ├── responses/      # API response builders
│   │   └── result.ts       # Result type implementation
│   ├── health/             # Health check endpoint
│   ├── infrastructure/    # Infrastructure setup
│   └── main.ts             # Application entry point
├── init_scripts/           # Database initialization scripts
├── test/                   # E2E tests
└── docker-compose.yml      # Docker configuration
```

## Architecture Patterns

### Result-Oriented Programming

The application uses a Result pattern similar to Rust's `Result<T, E>` to handle errors explicitly:

```typescript
type Result<T, E> = Ok<T> | Err<E>;
```

This pattern:

- Makes error handling explicit
- Prevents unhandled exceptions
- Provides type-safe error handling
- Improves code readability

### Repository Pattern

Data access is abstracted through repositories:

- `DroneRepository`: Handles all drone-related database operations
- `MedicationRepository`: Handles medication database operations

### Service Layer

Business logic is encapsulated in services:

- `DroneService`: Contains drone business logic
- `AuditService`: Handles battery audit logging

## API Response Format

All API responses follow a consistent format:

**Success Response:**

```json
{
  "status": "success",
  "message": "Operation completed successfully",
  "data": { ... }
}
```

**Error Response:**

```json
{
  "status": "fail",
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  }
}
```

## Error Codes

Common error codes:

- `VALIDATION_ERROR`: Request validation failed
- `NOT_FOUND`: Resource not found
- `CONFLICT`: Resource conflict (e.g., duplicate serial number)
- `BAD_REQUEST`: Invalid request (e.g., business rule violation)
- `DATABASE_ERROR`: Database operation failed

## License

UNLICENSED
