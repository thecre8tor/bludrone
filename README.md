# Drone Medication Delivery System

A REST API service for managing a fleet of drones that deliver medications. Built with NestJS, TypeScript, PostgreSQL, and following the Result-oriented programming pattern.

## Features

- **Drone Management**: Register and manage a fleet of 10 drones
- **Medication Management**: Create and manage medication items
- **Loading System**: Load medications onto drones with weight and battery validation
- **Battery Monitoring**: Periodic battery level audit logging (every 5 minutes)
- **Business Rules**:
  - Prevent loading if total weight exceeds drone capacity
  - Prevent loading if battery level is below 25%
  - Only IDLE or LOADING drones can be loaded
