import { findActiveSlots } from '@/services/ap.service';
import { syncData } from '@/utils/localData.util';
import express from 'express';

const router = express.Router();

// sync data from google sheet
router.post('/sync', async (req, res) => {
    const apData = await syncData('Sheet1');

    if (!apData) {
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
    const activeApData = findActiveSlots('Sheet1');

    return res.status(200).send({
        success: true,
        message: 'Data fetched successfully',
        data: activeApData,
    });
});

export default router;
