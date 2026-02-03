const express = require('express');
const router = express.Router();
const RankingService = require('../services/rankingService');
const rankingService = new RankingService();

// Get rankings for specific region, service type, and time period
router.get('/:region/:serviceType/:year/:month', async (req, res) => {
    try {
        const { region, serviceType, year, month } = req.params;
        console.log('Received request for rankings:', { region, serviceType, year, month });
        
        const rankings = await rankingService.generateRankings(region, serviceType, parseInt(year), parseInt(month));
        console.log('Generated rankings:', rankings);
        
        res.json(rankings);
    } catch (error) {
        console.error('Detailed error in rankings endpoint:', error);
        res.status(500).json({ 
            error: 'Failed to fetch rankings',
            details: error.message,
            stack: error.stack
        });
    }
});

module.exports = router; 