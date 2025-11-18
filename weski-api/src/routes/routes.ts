import express from 'express';
import { getHotels, getHotelsProgressive } from '../controllers/hotelsController';

const router = express.Router();

router.get('/health', (req, res) => {
    res.status(200).json({ message: 'API is running' });
});

router.post('/hotels', async (req, res) => {
    try {
        const hotels = await getHotels(
            req.body.resortId, 
            req.body.groupSize, 
            new Date(req.body.startDate), 
            new Date(req.body.endDate)
        );
        res.status(200).json(hotels);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch hotels' });
    }
});

router.post('/hotels/progressive', async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    try {
        await getHotelsProgressive(
            req.body.resortId,
            req.body.groupSize,
            new Date(req.body.startDate),
            new Date(req.body.endDate),
            (hotels) => {
                res.write(`data: ${JSON.stringify({ hotels })}\n\n`);
            }
        );

        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        res.end();
    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        res.write(`data: ${JSON.stringify({ error: errorMsg })}\n\n`);
        res.end();
    }
});

export default router;