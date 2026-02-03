const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'website_board',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
};

console.log('Database configuration:', {
    host: dbConfig.host,
    user: dbConfig.user,
    database: dbConfig.database,
    hasPassword: !!dbConfig.password
});

const pool = mysql.createPool(dbConfig);

// Test database connection
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Successfully connected to the database');
        
        // Ensure database table exists
        await connection.query(`
            CREATE TABLE IF NOT EXISTS tool_rankings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                region VARCHAR(100) NOT NULL COMMENT 'Region name',
                service_type VARCHAR(50) NOT NULL COMMENT 'Service type (devTools or productivityApps)',
                year INT NOT NULL COMMENT 'Year',
                month INT NOT NULL COMMENT 'Month',
                ranking_position INT NOT NULL COMMENT 'Ranking position',
                tool_name VARCHAR(255) NOT NULL COMMENT 'Tool/app name',
                tool_description TEXT COMMENT 'Tool/app description',
                features JSON COMMENT 'Features list in JSON format',
                website_link VARCHAR(500) COMMENT 'Official website link',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Created timestamp',
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Updated timestamp',
                UNIQUE KEY unique_ranking (region, service_type, year, month, ranking_position),
                INDEX idx_region_service (region, service_type),
                INDEX idx_year_month (year, month)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        
        // Test table accessibility
        const [rows] = await connection.query('SELECT COUNT(*) as count FROM tool_rankings');
        console.log('Rankings table verified:', {
            exists: true,
            recordCount: rows[0].count
        });
        
        connection.release();
        return true;
    } catch (err) {
        console.error('Database connection/setup error:', {
            message: err.message,
            code: err.code,
            state: err.sqlState
        });
        throw err;
    }
}

// Test connection immediately
testConnection().catch(err => {
    console.error('Initial database connection failed:', {
        message: err.message,
        code: err.code,
        state: err.sqlState
    });
    process.exit(1);
});

module.exports = pool; 