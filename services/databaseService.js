const pool = require('../config/database');

class DatabaseService {
    constructor() {
        this.pool = pool;
        // Test connection
        this.testConnection();
    }

    async testConnection() {
        try {
            const connection = await this.pool.getConnection();
            console.log('Database connection successful');
            connection.release();
        } catch (error) {
            console.error('Database connection failed:', error.message);
            throw error;
        }
    }

    async getRankings(region, serviceType, year, month) {
        try {
            console.log('Fetching rankings from database:', { region, serviceType, year, month });
            const [rows] = await this.pool.query(
                'SELECT * FROM tool_rankings WHERE region = ? AND service_type = ? AND year = ? AND month = ? ORDER BY ranking_position',
                [region, serviceType, year, month]
            );
            console.log(`Found ${rows.length} ranking records in database`);
            return rows;
        } catch (error) {
            console.error('Error fetching rankings:', error);
            throw error;
        }
    }

    async saveRankings(rankings, region, serviceType, year, month) {
        const connection = await this.pool.getConnection();
        try {
            console.log('Saving rankings to database:', {
                region,
                serviceType,
                year,
                month,
                rankingsCount: rankings.length
            });

            await connection.beginTransaction();

            // Delete existing rankings
            await connection.query(
                'DELETE FROM tool_rankings WHERE region = ? AND service_type = ? AND year = ? AND month = ?',
                [region, serviceType, year, month]
            );

            // Insert new rankings
            for (let i = 0; i < rankings.length; i++) {
                const ranking = rankings[i];
                await connection.query(
                    `INSERT INTO tool_rankings (
                        region, service_type, year, month, ranking_position,
                        tool_name, tool_description, features, website_link
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        region,
                        serviceType,
                        year,
                        month,
                        i + 1,
                        ranking.tool_name || ranking.company_name,
                        ranking.description || ranking.tool_description,
                        JSON.stringify(ranking.features || ranking.strengths),
                        ranking.website || ranking.website_link
                    ]
                );
            }

            await connection.commit();
            console.log('Rankings saved successfully');
            return true;
        } catch (error) {
            await connection.rollback();
            console.error('Error saving rankings:', error);
            throw error;
        } finally {
            connection.release();
        }
    }

    async checkRankingsExist(region, serviceType, year, month) {
        try {
            console.log('Checking if rankings exist:', { region, serviceType, year, month });
            const [rows] = await this.pool.query(
                'SELECT COUNT(*) as count FROM tool_rankings WHERE region = ? AND service_type = ? AND year = ? AND month = ?',
                [region, serviceType, year, month]
            );
            const exists = rows[0].count > 0;
            console.log('Rankings exist:', exists);
            return exists;
        } catch (error) {
            console.error('Error checking rankings existence:', error);
            return false;
        }
    }
}

module.exports = DatabaseService; 