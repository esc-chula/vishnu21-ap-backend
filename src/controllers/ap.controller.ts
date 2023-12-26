import { ISlot } from '@/interfaces/ap';
import apService from '@/services/ap.service';
import { Request, Response } from 'express';
import moment from 'moment';

// sync data from google sheet
async function syncFromSheet(req: Request, res: Response) {
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
}

async function getSlots(req: Request, res: Response) {
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
}

async function getOneSlot(req: Request, res: Response) {
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
}

async function getActiveSlots(req: Request, res: Response) {
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
}

async function getUpcomingSlots(req: Request, res: Response) {
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
}

async function announce(req: Request, res: Response) {
    const announcingSlots = await apService.multicastAnnounceSlots();

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
}

async function resetAnnouncedSlots(req: Request, res: Response) {
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
}

async function makeOffset(req: Request, res: Response) {
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
}

export default {
    syncFromSheet,
    getSlots,
    getOneSlot,
    getActiveSlots,
    getUpcomingSlots,
    announce,
    resetAnnouncedSlots,
    makeOffset,
};
