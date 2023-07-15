import { syncData } from '@/utils/updateData.util';
import express from 'express';

const router = express.Router();

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

export default router;
