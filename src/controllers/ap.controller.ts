import { ISlot } from '@/interfaces/ap';
import apService from '@/services/ap.service';
import userService from '@/services/user.service';
import flexTemplate from '@/templates/flex.template';
import messageTemplate from '@/templates/message.template';
import messageUtil from '@/utils/message.util';
import express from 'express';
import moment from 'moment';

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

    const announcingSlots = activeSlots;

    await apService.multicastAnnounceSlots();

    // const users = await userService.findAll();

    // if (!users) {
    //     return res.status(400).send({
    //         success: false,
    //         message: 'Error fetching data',
    //     });
    // }

    // const userContents = {} as {
    //     [key: string]: number[];
    // };

    // for (const user of users) {
    //     for (const slot of announcingSlots) {
    //         if (
    //             user.selectedDepartments.includes(slot.department) &&
    //             user.enableBot
    //         ) {
    //             if (!userContents[user.userId as keyof typeof userContents]) {
    //                 Object.defineProperty(userContents, user.userId, {
    //                     value: [],
    //                     writable: true,
    //                     enumerable: true,
    //                     configurable: true,
    //                 });
    //             }

    //             userContents[user.userId as keyof typeof userContents].push(
    //                 slot.slot
    //             );
    //         }
    //     }
    // }

    // const groupedUserContents = messageUtil.groupMessage(userContents);

    // for (const key of Object.keys(groupedUserContents)) {
    //     const slotIndexes = JSON.parse(key) as number[];
    //     const userIds = groupedUserContents[key];

    //     const slots = [] as ISlot[];

    //     slotIndexes.forEach((slotIndex) => {
    //         const slot = announcingSlots.find(
    //             (slot) => slot.slot === slotIndex
    //         );

    //         if (slot) slots.push(slot);
    //     });

    //     const contents = slots.map((slot) => {
    //         if (!slot) {
    //             return null;
    //         }

    //         const start = moment(slot.start).format('HH:mm');
    //         const end = moment(slot.end).format('HH:mm');

    //         const content = flexTemplate.slotBubble({
    //             slot: slot.slot,
    //             department: slot.department,
    //             start: start,
    //             end: end,
    //             event: slot.event,
    //             location: slot.location,
    //             note: slot.note,
    //             contactName: 'ปูน',
    //             contactTel: '0918751929',
    //         });

    //         return content;
    //     });

    //     const message = messageTemplate.message({
    //         type: 'flex',
    //         altText: slots
    //             .map((slot) => {
    //                 const start = moment(slot.start).format('HH:mm');
    //                 const end = moment(slot.end).format('HH:mm');
    //                 return `${slot.event} ${start}-${end}\n`;
    //             })
    //             .join(' '),
    //         contents: {
    //             type: 'carousel',
    //             contents: contents,
    //         },
    //     });

    //     const replyData = {
    //         to: userIds,
    //         messages: [message],
    //     };

    //     await messageUtil.sendMessage('multicast', replyData);
    // }

    return res.status(200).send({
        success: true,
        message: 'Data fetched successfully',
        data: activeSlots,
    });
});

router.post('/announce', async (req, res) => {
    const announcingSlots = await apService.announceSlots();

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

router.patch('/offset', async (req, res) => {
    const { slot, offset } = req.body;

    const updatedSlot = await apService.setOffset(slot, offset);

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
