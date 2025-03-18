import { AuthService as AuthServiceClass } from './auth.service';
import { AdminService as AdminServiceClass } from './admin.service';
import { HealthService as HealthServiceClass } from './health.service';

// Create service instances
const authService = new AuthServiceClass();
const adminService = new AdminServiceClass();
const healthService = new HealthServiceClass();

// Export the API object
export const api = {
    auth: authService,
    admin: adminService,
    health: healthService,
} as const;
