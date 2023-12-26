import webhookController from '@/controllers/webhook.controller';
import express from 'express';

const router = express.Router();

router.post('/', webhookController.webhookHandler);

export default router;
