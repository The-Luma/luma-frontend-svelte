# Luma Documentation

## Table of Contents
1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Features](#features)
4. [Technical Documentation](#technical-documentation)
5. [Development Guide](#development-guide)
6. [Deployment](#deployment)

## Overview

Luma is a modern web application built with SvelteKit that provides a comprehensive platform for team collaboration, file management, and communication. The application features a robust authentication system, customizable themes, and a responsive design that works seamlessly across desktop and mobile devices.

## Getting Started

### Prerequisites
- Node.js (v23.9.0 or higher recommended)
- npm or yarn package manager
- Docker (optional, for containerized deployment)

### Environment Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and configure the following variables:

```bash
# Backend Configuration 
BACKEND_PORT=<your_backend_port>
BACKEND_LOG_LEVEL=<log_level>
BACKEND_JWT_SECRET=<your_jwt_secret>

# Frontend Configuration
FRONTEND_PORT=<your_frontend_port>
FRONTEND_URL=<your_frontend_url>
VITE_API_URL=<your_api_url>
```

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Features

### Authentication System

#### Initial Setup
- First-time users will be directed to the admin setup page
- Create an admin account with email and username
- Password requirements and validation included

#### User Authentication
- Login with username/email and password
- JWT-based authentication
- Automatic token refresh
- Session management

### Dashboard

#### Navigation
- Desktop: Side navigation rail
- Mobile: Bottom navigation bar
- Main sections:
  - Chats
  - Profile
  - Files
  - Namespaces
  - Settings

### Theme System

#### Theme Management
- Multiple built-in themes available
- Dark/Light mode toggle
- Theme search functionality
- Persistent theme settings

### User Management

#### Roles and Permissions
- Admin: Full system access
- Editor: Content management access
- Viewer: Read-only access

#### User Administration
- User invitation system
- Role assignment
- Profile management
- Password and username updates

## Technical Documentation

### Architecture

```
luma-frontend-svelte/
├── src/
│   ├── routes/              # SvelteKit routes
│   ├── lib/                 # Shared libraries
│   │   ├── components/      # Reusable components
│   │   ├── services/        # API services
│   │   ├── stores/          # Svelte stores
│   │   ├── types/          # TypeScript types
│   │   └── config/         # Configuration files
│   ├── app.html            # App template
│   └── app.css             # Global styles
├── static/                  # Static assets
└── tests/                  # Test files
```

### Core Services

#### Authentication Service
```typescript
// Authentication methods
login(credentials: LoginRequest)
logout()
refreshToken()
checkAuth()
```

#### Health Service
```typescript
// Health check methods
check(): Promise<boolean>
```

#### Admin Service
```typescript
// Admin management methods
createAdmin(data: RegisterRequest)
getUsers()
manageInvitations()
```

### State Management

The application uses Svelte stores for state management:

```typescript
// Auth Store
auth: {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    isServerUp: boolean
}

// Theme Store
theme: {
    currentTheme: string
    isDarkMode: boolean
}
```

## Development Guide

### Code Style

The project uses Prettier for code formatting:

```bash
# Check formatting
npm run lint

# Fix formatting
npm run format
```

### Adding New Features

1. Create new components in `src/lib/components`
2. Add routes in `src/routes`
3. Update services in `src/lib/services` if needed
4. Add types in `src/lib/types`

### Best Practices

1. Use TypeScript for type safety
2. Follow the component structure:
   ```svelte
   <script lang="ts">
     // imports
     // props
     // state
     // methods
   </script>

   <template>
     <!-- markup -->
   </template>

   <style>
     /* styles */
   </style>
   ```
3. Use Svelte stores for global state
4. Implement error handling and loading states

## Deployment

### Docker Deployment

1. Build the Docker image:
```bash
docker build -t luma-frontend .
```

2. Run the container:
```bash
docker run -p 5173:5173 luma-frontend
```

### Docker Compose

```yaml
version: '3'
services:
  frontend:
    build: .
    ports:
      - "${FRONTEND_PORT}:5173"
    environment:
      - VITE_API_URL=${VITE_API_URL}
```

### Environment Configuration

The application supports different environments through `.env` files:
- `.env` - Production environment
- `.env.development` - Development environment
- `.env.test` - Testing environment

## Security Considerations

1. JWT token storage and refresh
2. Password hashing and security
3. Role-based access control
4. API endpoint protection
5. Environment variable management

## Troubleshooting

### Common Issues

1. Backend Connection Issues
   - Check if the backend service is running
   - Verify environment variables
   - Check network connectivity

2. Authentication Problems
   - Clear browser cache
   - Check token expiration
   - Verify credentials

3. Theme Issues
   - Clear local storage
   - Reset theme settings
   - Check browser compatibility

### Support

For additional support:
1. Check the issue tracker
2. Review error logs
3. Contact system administrators

---

