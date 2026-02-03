require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const path = require('path');
const RankingService = require('./services/rankingService');
const SchedulerService = require('./services/schedulerService');
const rankingsRouter = require('./routes/rankings');
const fs = require('fs');

// Print environment variables with sensitive info masked
console.log('Environment variables loaded:', {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_NAME: process.env.DB_NAME,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY ? 'set' : 'not set'
});

const rankingService = new RankingService();
const schedulerService = new SchedulerService();
const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS
app.use(cors());

// Start scheduled tasks
schedulerService.startScheduledTasks();

// Middleware
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    const startTime = Date.now();
    const requestId = Math.random().toString(36).substring(7);
    
    console.log('=== Request Start ===');
    console.log(`[${requestId}] Incoming request:`, {
        method: req.method,
        url: req.url,
        params: req.params,
        query: req.query,
        headers: {
            'user-agent': req.headers['user-agent'],
            'accept': req.headers['accept']
        },
        timestamp: new Date().toISOString()
    });

    // Add response completion listener
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        console.log(`[${requestId}] Response completed:`, {
            method: req.method,
            url: req.url,
            status: res.statusCode,
            duration: `${duration}ms`,
            timestamp: new Date().toISOString()
        });
        console.log('=== Request End ===\n');
    });

    // Attach requestId to request object
    req.requestId = requestId;
    next();
});

// API routes
app.use('/api', rankingsRouter);

// API routes - rankings
app.get('/api/rankings/:region/:serviceType/:year/:month', async (req, res) => {
    try {
        const { region, serviceType, year, month } = req.params;
        const rankings = await rankingService.getRankings(region, serviceType, year, month);
        res.json(rankings);
    } catch (error) {
        console.error('Error getting rankings:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

// Manual ranking update endpoint
app.post('/api/rankings/update', async (req, res) => {
    const { requestId } = req;
    console.log(`[${requestId}] Manual ranking update requested`);
    
    try {
        await schedulerService.triggerManualUpdate();
        res.json({ message: 'Ranking update triggered' });
    } catch (error) {
        console.error(`[${requestId}] Manual update failed:`, error);
        res.status(500).json({ 
            error: 'Update failed',
            details: error.message
        });
    }
});

// Static file server - after API routes
app.use(express.static(path.join(__dirname)));

// Handle dev tools and productivity apps page requests
app.get('/top-dev-tools-in-:region', (req, res) => {
    const { region } = req.params;
    const formattedRegion = region.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    
    console.log(`Request for dev tools in ${formattedRegion}`);
    
    const templatePath = path.join(__dirname, 'templates', 'dev-tools.html');
    
    fs.readFile(templatePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading template:', err);
            return res.status(404).json({
                error: 'Page not found',
                details: `The requested page for ${formattedRegion} dev tools is not available`
            });
        }
        
        const pageContent = data.replace(/\{\{region\}\}/g, formattedRegion);
        res.send(pageContent);
    });
});

app.get('/top-productivity-apps-in-:region', (req, res) => {
    const { region } = req.params;
    const formattedRegion = region.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    
    console.log(`Request for productivity apps in ${formattedRegion}`);
    
    const templatePath = path.join(__dirname, 'templates', 'productivity-apps.html');
    
    fs.readFile(templatePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading template:', err);
            return res.status(404).json({
                error: 'Page not found',
                details: `The requested page for ${formattedRegion} productivity apps is not available`
            });
        }
        
        const pageContent = data.replace(/\{\{region\}\}/g, formattedRegion);
        res.send(pageContent);
    });
});

// Legacy service page routes for backward compatibility
app.get('/top-:serviceType-services-in-:region', (req, res) => {
    const { serviceType, region } = req.params;
    const formattedRegion = region.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    
    console.log(`Request for ${serviceType} services in ${formattedRegion}`);
    
    // Select template based on service type
    const templatePath = path.join(__dirname, 'templates', `${serviceType}.html`);
    
    fs.readFile(templatePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading template:', err);
            return res.status(404).json({
                error: 'Page not found',
                details: `The requested page for ${formattedRegion} ${serviceType} services is not available`
            });
        }
        
        // Replace placeholders in template
        const pageContent = data
            .replace(/\{\{region\}\}/g, formattedRegion)
            .replace(/\{\{serviceType\}\}/g, serviceType.toUpperCase());
        
        res.send(pageContent);
    });
});

// Legacy region page routes as fallback
app.get('/regions/:region/:service', (req, res) => {
    const { region, service } = req.params;
    const filePath = path.join(__dirname, 'regions', region, `${service}.html`);
    console.log(`[${req.requestId}] Serving region page:`, {
        region,
        service,
        filePath,
        exists: require('fs').existsSync(filePath)
    });
    res.sendFile(filePath);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(`[${req.requestId}] Global error:`, {
        url: req.url,
        method: req.method,
        error: err.message,
        stack: err.stack,
        timestamp: new Date().toISOString()
    });
    res.status(500).json({ 
        error: 'Internal server error',
        details: err.message
    });
});

// 404 handler - return JSON instead of HTML
app.use((req, res) => {
    console.log(`[${req.requestId}] 404 not found:`, {
        url: req.url,
        method: req.method,
        headers: req.headers,
        timestamp: new Date().toISOString()
    });
    res.status(404).json({ 
        error: 'Route not found',
        path: req.url
    });
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled promise rejection:', {
        reason,
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Route configuration:', {
        api: '/api/rankings/:region/:serviceType/:year/:month',
        pages: '/regions/:region/:service'
    });
}); 