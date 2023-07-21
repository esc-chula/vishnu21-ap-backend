import { ISlot } from '@/interfaces/ap';
import { IEvent } from '@/interfaces/webhook';
import apService from '@/services/ap.service';
import webhookService from '@/services/webhook.service';
import express from 'express';

const router = express.Router();

router.post('/', async (req, res) => {
    const activeApData = await apService.findActiveSlots();

    if (!activeApData) {
        return res.status(400).send({
            success: false,
            message: 'Error fetching data',
        });
    }

    await req.body.events
        .filter(
            (event: IEvent) =>
                event.type === 'message' && event.message.type === 'text'
        )
        .forEach(async (event: IEvent) => {
            switch (event.message.text) {
                case 'active':
                    await webhookService.announceSlot(event, activeApData);
                    break;
            }
        });

    res.status(200).send({
        success: true,
        message: 'HTTP POST request sent to the LINE webhook URL!',
    });
});

export default router;
