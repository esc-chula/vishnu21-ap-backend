import { ISlot } from '@/interfaces/ap';
import { TextEvent } from '@/interfaces/webhook';
import apService from '@/services/ap.service';
import userService from '@/services/user.service';
import webhookService from '@/services/webhook.service';
import lineClientUtil from '@/utils/lineClient.util';
import { WebhookEvent } from '@line/bot-sdk';
import { Request, Response } from 'express';

async function webhookHandler(req: Request, res: Response) {
    // console.log(req.body.events);

    await req.body.events
        .filter(
            (event: WebhookEvent) =>
                event.type === 'message' && event.message.type === 'text'
        )
        .forEach(async (event: TextEvent) => {
            const user = await userService.findByUserId(event.source.userId!);

            switch (event.message.text) {
                case 'active':
                    const activeApData = await apService.findActiveSlots();

                    if (!activeApData) {
                        await lineClientUtil.replyText(
                            event.replyToken,
                            'ไม่เจอ Slots ปัจจุบันงับ'
                        );
                        return res.status(400).send({
                            success: false,
                            message: 'Error fetching data',
                        });
                    }

                    await webhookService.announceSlot(event, activeApData);
                    break;
                case 'sync':
                    if (!user || !user.superuser) {
                        return res.status(400).send({
                            success: false,
                            message:
                                'Error syncing data: userId not found or is not superuser',
                        });
                    }

                    const syncedData = await apService.syncSheet(
                        process.env.SHEET_NAME!
                    );

                    if (!syncedData) {
                        await lineClientUtil.replyText(
                            event.replyToken,
                            'Sync AP ไม่สำเร็จงับ'
                        );
                        return res.status(400).send({
                            success: false,
                            message: 'Error syncing data',
                        });
                    }
                    await lineClientUtil.replyText(
                        event.replyToken,
                        `Synced ${syncedData.length} slots successfully`
                    );
                    break;
                case 'reset':
                    if (!user || !user.superuser) {
                        return res.status(400).send({
                            success: false,
                            message:
                                'Error syncing data: userId not found or is not superuser',
                        });
                    }

                    const slots = await apService.findAnnouncedSlots();

                    if (!slots) {
                        return res.status(400).send({
                            success: false,
                            message: 'Error fetching announced slots',
                        });
                    }

                    const updatedSlots = [] as ISlot[];

                    for (const slot of slots) {
                        const updatedSlot = await apService.updateBySlot(
                            slot.slot,
                            {
                                announced: false,
                            }
                        );

                        updatedSlots.push(updatedSlot);
                    }

                    await lineClientUtil.replyText(
                        event.replyToken,
                        `Reset ${updatedSlots.length} announced slots successfully`
                    );
                    break;
                default:
            }
        });

    res.status(200).send({
        success: true,
        message: 'HTTP POST request sent to the LINE webhook URL!',
    });
}

export default { webhookHandler };
