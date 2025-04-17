<<<<<<< HEAD
# Luma Frontend
=======
# create-svelte-app-for-Luma
>>>>>>> 678528550e0adb83d93b2a6bcce725929eb03199

[![Svelte](https://img.shields.io/badge/svelte-v5.0.0-orange.svg)](https://svelte.dev/)
[![SvelteKit](https://img.shields.io/badge/sveltekit-v2.20.1-orange.svg)](https://kit.svelte.dev/)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Docker](https://img.shields.io/badge/docker-supported-blue.svg)](https://www.docker.com/)

*A modern, responsive frontend for the Luma document management and chat system built with SvelteKit*

<<<<<<< HEAD
[Getting Started](#getting-started) •
[Documentation](#documentation) •
[Features](#features) •
[Contributing](#contributing) •
[License](#license)

## Features

- **Modern Authentication System**
  - Secure JWT-based authentication
  - Role-based access control
  - Automatic token refresh
  - Protected routes

- **Responsive Dashboard**
  - Desktop and mobile layouts
  - Dark/Light mode support
  - Multiple built-in themes
  - Customizable interface

- **Advanced UI Components**
  - Chat interface
  - File management
  - Namespace organization
  - User management
  - Settings configuration

- **Performance Optimized**
  - Server-side rendering
  - Client-side navigation
  - Optimized asset loading
  - TypeScript support

## Getting Started

### Prerequisites

- Node.js (v23.9.0 or higher)
- npm or yarn
- Docker (optional)

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/your-org/luma-frontend-svelte.git
cd luma-frontend-svelte
=======
If you're seeing this, you've probably already done this step. Congrats!
\
\
To install all the packages run the following bash commands
```bash
npm install \
  @lucide/svelte@0.488.0 \
  @skeletonlabs/skeleton-svelte@1.0.0 \
  @sveltejs/adapter-node@5.2.12 \
  @sveltejs/kit@2.20.1 \
  @sveltejs/vite-plugin-svelte@4.0.4 \
  lucide-svelte@0.484.0 \
  prettier-plugin-svelte@3.3.3 \
  svelte-check@4.1.5 \
  svelte@5.23.2
>>>>>>> 678528550e0adb83d93b2a6bcce725929eb03199
```

2. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Install and run**
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Docker Setup

```bash
# Build and run with Docker
docker build -t luma-frontend .
docker run -p 5173:5173 --env-file .env luma-frontend

# Or using Docker Compose
docker-compose up
```

## Documentation

Detailed documentation is available in the [docs](docs/) directory:

- [User Guide](docs/user-guide.md)
- [Component Library](docs/components.md)
- [Development Guide](docs/development.md)
- [Deployment Guide](docs/deployment.md)

### Basic Configuration

Create a `.env` file with the following:

```env
# Frontend Configuration
FRONTEND_PORT=5173
FRONTEND_URL=http://localhost:5173

# Backend Configuration
VITE_API_URL=http://localhost:8000

# Theme Configuration
DEFAULT_THEME=skeleton
ENABLE_DARK_MODE=true
```

## Development

### Project Structure

```
src/
├── lib/            # Shared libraries
│   ├── components/ # Reusable components
│   ├── services/   # API services
│   ├── stores/     # Svelte stores
│   ├── types/      # TypeScript types
│   └── utils/      # Utility functions
├── routes/         # SvelteKit routes
│   ├── login/      # Authentication pages
│   ├── dashboard/  # Main application
│   └── admin/      # Admin interface
├── static/         # Static assets
├── app.html        # HTML template
└── app.css         # Global styles
```

### Available Scripts

```bash
# Development
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build

# Quality Checks
npm run check       # Run type checking
npm run lint        # Check code formatting
npm run format      # Format code

# Testing (when configured)
npm run test        # Run tests
npm run test:watch  # Watch mode
```

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Component Examples

### Authentication Form

```svelte
<script lang="ts">
  import { auth } from '$lib/stores/auth';
  
  let username = '';
  let password = '';
  
  async function handleLogin() {
    await auth.login({ username, password });
  }
</script>

<form on:submit|preventDefault={handleLogin}>
  <input bind:value={username} type="text" placeholder="Username" />
  <input bind:value={password} type="password" placeholder="Password" />
  <button type="submit">Login</button>
</form>
```

## Configuration Options

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| FRONTEND_PORT | Server port | No | 5173 |
| VITE_API_URL | Backend API URL | Yes | - |
| DEFAULT_THEME | UI theme | No | skeleton |
| ENABLE_DARK_MODE | Dark mode support | No | true |

## License

This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). This means:

### What you can do:
- Use the software for any purpose
- Study how the software works and modify it
- Redistribute the software
- Make commercial use of the software
- Distribute modified versions of the software

### What you must do:
- Make source code available when you distribute the software
- Include a copy of the AGPL-3.0 license with the code
- Indicate significant changes made to the software
- Disclose source code when running a modified version on a server

### Important Notes:
- If you modify and use this software on a network server, you MUST make the complete source code available to users who interact with the server
- All derivative works must also be licensed under AGPL-3.0
- Including this software in a larger program may require the entire program to be licensed under AGPL-3.0

For the full license text, see the [LICENSE](LICENSE) file or visit [GNU AGPL-3.0](https://www.gnu.org/licenses/agpl-3.0.en.html).

## Deployment

### Production Checklist

-  Set secure environment variables
-  Configure HTTPS
-  Optimize asset bundling
-  Enable SSR (if needed)
-  Configure CDN
-  Set up monitoring
-  Review security settings

## Status

- ✅ Core Features
<!-- - ✅ Authentication System -->
- ✅ Dashboard Interface
- ✅ Theme System
- ✅ File Management
- ✅ Real-time Chat
<!-- - 🟡 Advanced Analytics (In Progress) -->
<!-- - 🟡 Offline Support (Planned) -->

---

<div align="center">

[Report Bug](https://github.com/your-org/luma-frontend-svelte/issues) • [Request Feature](https://github.com/your-org/luma-frontend-svelte/issues)

</div>