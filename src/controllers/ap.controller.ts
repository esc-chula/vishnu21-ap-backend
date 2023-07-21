import { ISlot } from '@/interfaces/ap';
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

router.get('/upcoming', async (req, res) => {
    const upcomingSlots = await apService.findUpcomingSlots();

    if (!upcomingSlots) {
        return res.status(400).send({
            success: false,
            message: 'Error fetching data',
        });
    }

    return res.status(200).send({
        success: true,
        message: 'Data fetched successfully',
        data: upcomingSlots,
    });
});

router.post('/announce', async (req, res) => {
    const announcingSlots = await apService.announceSlots();
    await apService.multicastAnnounceSlots();

    if (!announcingSlots) {
        return res.status(400).send({
            success: false,
            message: 'Error announcing',
        });
    }

    for (const slot of announcingSlots) {
        console.log(slot);
    }

    return res.status(200).send({
        success: true,
        message: 'Announced successfully',
        data: announcingSlots,
    });
});

router.post('/announce/reset', async (req, res) => {
    const slots = await apService.findAnnouncedSlots();

    if (!slots) {
        return res.status(400).send({
            success: false,
            message: 'Error fetching data',
        });
    }

    const updatedSlots = [] as ISlot[];

    for (const slot of slots) {
        const updatedSlot = await apService.updateBySlot(slot.slot, {
            announced: false,
        });

        updatedSlots.push(updatedSlot);
    }

    return res.status(200).send({
        success: true,
        message: 'Announced slots reset successfully',
        data: updatedSlots,
    });
});

router.patch('/offset', async (req, res) => {
    const { slot, offset } = req.body;

    const updatedSlot = await apService.setOffset('Sheet1', slot, offset);

    if (!updatedSlot) {
        return res.status(400).send({
            success: false,
            message: 'Error updating offset',
        });
    }

    return res.status(200).send({
        success: true,
        message: 'Offset updated successfully',
        data: updatedSlot,
    });
});

export default router;
