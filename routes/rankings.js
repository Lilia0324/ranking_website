const express = require('express');
const router = express.Router();
const RankingService = require('../services/rankingService');

const rankingService = new RankingService();

router.get('/rankings', async (req, res) => {
    try {
        const { region, serviceType, year, month } = req.query;
        
        if (!region || !serviceType || !year || !month) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        const rankings = await rankingService.generateRankings(region, serviceType, year, month);
        res.json(rankings);
    } catch (error) {
        console.error('Error in rankings route:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router; 