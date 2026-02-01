# ChemVis - Chemical Equipment Parameter Visualizer

## Overview

ChemVis is a hybrid Web + Desktop application for visualizing chemical equipment data. Users can upload CSV files containing equipment parameters (flowrate, pressure, temperature), view summary statistics, and explore data through interactive charts. The system supports both a React-based web dashboard and a Python/PyQt5 desktop client, both connecting to a shared Node.js/Express backend with PostgreSQL storage.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend (Web)
- **Framework**: React with TypeScript, using Vite as the build tool
- **Routing**: Wouter for client-side routing with protected routes
- **State Management**: TanStack React Query for server state and caching
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Charts**: Recharts for data visualization (pie charts, bar charts, scatter plots)
- **Forms**: React Hook Form with Zod validation

### Frontend (Desktop)
- **Framework**: Python with PyQt5 for native GUI
- **Charts**: Matplotlib for data visualization
- **HTTP Client**: Requests library for API communication
- **Data Processing**: Pandas for CSV/data handling

### Backend
- **Runtime**: Node.js with Express
- **Language**: TypeScript
- **API Style**: RESTful endpoints with session-based authentication
- **File Uploads**: Multer for multipart form-data handling
- **CSV Parsing**: csv-parse library for processing uploaded data

### Database
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with drizzle-zod for schema validation
- **Session Store**: connect-pg-simple for persistent sessions
- **Schema Location**: `shared/schema.ts` contains all table definitions

### Authentication
- **Strategy**: Passport.js with Local Strategy
- **Password Hashing**: scrypt with random salt
- **Sessions**: Express-session with PostgreSQL session store
- **Protected Routes**: Server-side middleware and client-side route guards

### Project Structure
- `client/`: React web application (components, pages, hooks)
- `server/`: Express backend (routes, auth, storage, database)
- `shared/`: Shared TypeScript types and schemas (used by both client and server)
- `desktop/`: Python desktop application (standalone, connects to same API)

### Key Design Patterns
- **Shared Types**: The `shared/` directory contains Zod schemas and route definitions used by both frontend and backend, ensuring type safety across the stack
- **Storage Abstraction**: `server/storage.ts` implements an `IStorage` interface, allowing the data layer to be swapped if needed
- **Component Architecture**: UI components in `client/src/components/ui/` are reusable primitives; feature components in `client/src/components/dashboard/` compose these for specific functionality

## External Dependencies

### Database
- **PostgreSQL**: Primary data store, connection via `DATABASE_URL` environment variable
- **Tables**: users, datasets, equipment, plus session table for auth

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (required)
- `SESSION_SECRET`: Secret for session encryption (required)

### Key NPM Packages
- `drizzle-orm` / `drizzle-kit`: Database ORM and migrations
- `passport` / `passport-local`: Authentication
- `multer`: File upload handling
- `csv-parse`: CSV file parsing
- `recharts`: Chart library for React
- `@tanstack/react-query`: Data fetching and caching
- `zod`: Schema validation

### Desktop Dependencies (Python)
- `PyQt5`: GUI framework
- `matplotlib`: Charting
- `requests`: HTTP client
- `pandas`: Data manipulation