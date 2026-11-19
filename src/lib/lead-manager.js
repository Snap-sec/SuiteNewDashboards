import appConfig from "../config/appConfig";

export class LeadManager {

    static async recordActivity(activityData) {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${appConfig.BASE_URL}/auth/api/auth/record-lead-activity`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(activityData),
            });

            if (!response.ok) {
                console.error('Failed to record lead activity');
            }
        } catch (error) {
            console.error('Error recording lead activity:', error);
        }
    }

}