const cron = require('node-cron');
const RankingService = require('./rankingService');
const rankingService = new RankingService();

class SchedulerService {
    constructor() {
        this.regions = ['usa', 'china', 'hong-kong', 'singapore'];
        this.serviceTypes = ['eor', 'payroll'];
    }

    // Start scheduled tasks
    startScheduledTasks() {
        // Run at 2 AM on the 1st of every month
        cron.schedule('0 2 1 * *', async () => {
            console.log('Starting monthly ranking update task...');
            await this.updateMonthlyRankings();
        });

        console.log('Ranking auto-update task started');
    }

    // Update rankings for all regions and service types
    async updateMonthlyRankings() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;

        console.log(`Starting update for ${year}-${month} ranking data`);

        try {
            for (const region of this.regions) {
                for (const serviceType of this.serviceTypes) {
                    console.log(`Updating rankings for ${region} - ${serviceType}...`);
                    try {
                        await rankingService.generateRankings(region, serviceType, year, month);
                        console.log(`Successfully updated rankings for ${region} - ${serviceType}`);
                    } catch (error) {
                        console.error(`Failed to update rankings for ${region} - ${serviceType}:`, error);
                        // Continue with other regions and service types
                    }
                }
            }
            console.log('All rankings updated');
        } catch (error) {
            console.error('Monthly ranking update task failed:', error);
        }
    }

    // Trigger manual update
    async triggerManualUpdate() {
        console.log('Manually triggering ranking update...');
        await this.updateMonthlyRankings();
    }
}

module.exports = SchedulerService; 