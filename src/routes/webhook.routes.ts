import webhookController from '@/controllers/webhook.controller';
import express from 'express';
import dotenv from 'dotenv';
import { middleware } from '@line/bot-sdk';
dotenv.config();

const lineConfig = {
    channelAccessToken: process.env.LINE_ACCESS_TOKEN!,
    channelSecret: process.env.LINE_CHANNEL_SECRET!,
};

const router = express.Router();

router.post('/', middleware(lineConfig), webhookController.webhookHandler);

export default router;
