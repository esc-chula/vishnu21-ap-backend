import { ISlot } from '@/interfaces/ap';
import { TextEvent } from '@/interfaces/webhook';
import apService from '@/services/ap.service';
import webhookService from '@/services/webhook.service';
import { WebhookEvent } from '@line/bot-sdk';
import { Request, Response } from 'express';

async function webhookHandler(req: Request, res: Response) {
    // console.log(req.body.events);
    const activeApData = await apService.findActiveSlots();

    if (!activeApData) {
        return res.status(400).send({
            success: false,
            message: 'Error fetching data',
        });
    }

    await req.body.events
        .filter(
            (event: WebhookEvent) =>
                event.type === 'message' && event.message.type === 'text'
        )
        .forEach(async (event: TextEvent) => {
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
}

export default { webhookHandler };
