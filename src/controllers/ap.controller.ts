import apService from '@/services/ap.service';
import express from 'express';

const router = express.Router();

// sync data from google sheet
router.post('/sync', async (req, res) => {
    const syncedData = await apService.syncSheet('Sheet1');

    if (!syncedData) {
        return res.status(400).send({
            success: false,
            message: 'Error syncing data',
        });
    }

    return res.status(200).send({
        success: true,
        message: 'Data synced successfully',
    });
});

router.get('/', async (req, res) => {
    return res.status(200).send({
        success: true,
        message: 'Data fetched successfully',
        data: require('@/data/Sheet1.json'),
    });
});

router.get('/active', async (req, res) => {
    const activeSlots = await apService.findActiveSlots();

    if (!activeSlots) {
        return res.status(400).send({
            success: false,
            message: 'Error fetching data',
        });
    }

    return res.status(200).send({
        success: true,
        message: 'Data fetched successfully',
        data: activeSlots,
    });
});

router.post('/announce', async (req, res) => {
    const announcingSlots = await apService.announce();

    return res.status(200).send({
        success: true,
        message: 'Announced successfully',
        data: announcingSlots,
    });
});

export default router;
