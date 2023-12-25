import { ISlot } from '@/interfaces/ap';
import apService from '@/services/ap.service';
import express from 'express';
import moment from 'moment';

const router = express.Router();

// sync data from google sheet
router.post('/sync', async (req, res) => {
    const syncedData = await apService.syncSheet(process.env.SHEET_NAME!);

    if (!syncedData) {
        return res.status(400).send({
            success: false,
            message: 'Error syncing data',
        });
    }

    return res.status(200).send({
        success: true,
        message: `Synced ${syncedData.length} slots successfully`,
    });
});

router.get('/', async (req, res) => {
    const slots = await apService.findAll();

    if (!slots) {
        return res.status(400).send({
            success: false,
            message: 'Error fetching data',
        });
    }

    return res.status(200).send({
        success: true,
        message: 'Data fetched successfully',
        data: slots,
    });
});

router.get('/check/:slot', async (req, res) => {
    const slot = await apService.findOneBySlot(parseInt(req.params.slot));

    if (!slot) {
        return res.status(400).send({
            success: false,
            message: 'Error fetching data',
        });
    }

    const start = moment(
        moment(slot.start).format('HH:mm:ss'),
        'HH:mm:ss'
    ).format();
    const end = moment(
        moment(slot.end).format('HH:mm:ss'),
        'HH:mm:ss'
    ).format();

    return res.status(200).send({
        success: true,
        message: 'Data fetched successfully',
        data: {
            _id: slot._id,
            slot: slot.slot,
            start: start,
            end: end,
            duration: slot.duration,
            department: slot.department,
            event: slot.event,
            location: slot.location,
            contact: slot.contact,
            note: slot.note,
            announced: slot.announced,
        },
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
    const { slot, offset, userId, displayName } = req.body;

    const updatedSlot = await apService
        .setOffset(process.env.SHEET_NAME!, slot, offset, userId, displayName)
        .catch();

    if (updatedSlot instanceof Error && updatedSlot.message === 'slots is null')
        return res.status(400).send({
            success: false,
            message: 'Error updating offset',
        });

    if (
        updatedSlot instanceof Error &&
        updatedSlot.message === 'profile is null'
    )
        return res.status(403).send({
            success: false,
            message: 'Not authorized',
        });

    return res.status(200).send({
        success: true,
        message: `Updated ${updatedSlot.length} slots successfully`,
        data: updatedSlot,
    });
});

export default router;
