# FleetFlow Backend

Production-ready Node.js/Express backend for the FleetFlow fleet management system.

## Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: Firebase Admin SDK
- **Validation**: Zod

## Setup

1.  **Install Dependencies**

    ```bash
    cd fleetflow-backend
    npm install
    ```

2.  **Environment Variables**
    Copy `.env.example` to `.env` and fill in your values:

    ```bash
    cp .env.example .env
    ```

    - `DATABASE_URL`: Your PostgreSQL connection string.
    - `FIREBASE_credential`: Set up a project in Firebase Console and download service account JSON.

3.  **Database Migration**

    ```bash
    npx prisma db push
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```

## API Documentation

### Auth

- Authentication is handled via Bearer tokens (Firebase ID Tokens).
- Middleware validates tokens and syncs users to the local database.

### Endpoints (Examples)

- `GET /api/vehicles` - List all vehicles
- `POST /api/vehicles` - Create a vehicle (Manager/Dispatcher only)
- `GET /api/drivers` - List drivers
- `POST /api/trips` - Create a new trip dispatch

## Roles

- `MANAGER`: Full access
- `DISPATCHER`: Can manage vehicles and trips
- `SAFETY_OFFICER`: Can manage drivers and safety logs
- `ANALYST`: Read-only access to analytics
