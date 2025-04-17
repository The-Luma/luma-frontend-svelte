import { BaseService } from './base.service';
import { API_CONFIG } from '$lib/config/api.config';

export class HealthService extends BaseService {
    constructor() {
        super();
    }

    async check(): Promise<boolean> {
        try {
            const response = await fetch(this.buildUrl(API_CONFIG.endpoints.health.check));
            return response.ok;
        } catch (error) {
            console.error('Health check error:', error);
            return false;
        }
    }
} 