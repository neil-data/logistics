# FleetFlow

A comprehensive fleet management dashboard for the Indian logistics sector.

## Features

- **Dashboard**: Real-time overview of fleet status, KPI metrics, and financial performance.
- **Vehicle Registry**: Manage your fleet of trucks, vans, and bikes.
- **Trip Dispatcher**: Assign vehicles and drivers to trips with cargo and destination details.
- **Maintenance**: Log and track vehicle maintenance issues.
- **Expenses**: Record fuel and miscellaneous expenses for trips.
- **Analytics**: Visualize revenue vs. profit and fuel cost trends.

## Production Setup

### Vercel Note

If you deploy the frontend to Vercel, you must set:

- `VITE_API_BASE_URL` = your deployed backend URL (for example, your Express API host)

Without this, frontend requests to `/api/*` will not reach your backend in production and dashboards may show zero/empty data.

1.  **Install Dependencies**:

    ```bash
    npm install
    ```

2.  **Build the Project**:

    ```bash
    npm run build
    ```

3.  **Start the Server**:
    To run in production mode (requires build):

    ```bash
    # Linux/Mac
    export NODE_ENV=production
    npm start

    # Windows (PowerShell)
    $env:NODE_ENV="production"; npm start
    ```

    The server will start on port `3000` (or `PORT` env var).

## Development

To run in development mode with hot reloading:

```bash
npm run dev
```

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Recharts, Framer Motion, Lucide React
- **Backend**: Express, Better-sqlite3
- **Database**: SQLite (file-based `fleetflow.db`)
