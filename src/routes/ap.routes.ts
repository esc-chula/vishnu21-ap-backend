import apController from '@/controllers/ap.controller';
import express from 'express';

const router = express.Router();

// sync data from google sheet
router.post('/sync', apController.syncFromSheet);

router.get('/', apController.getSlots);

router.get('/check/:slot', apController.getOneSlot);

router.get('/active', apController.getActiveSlots);

router.get('/upcoming', apController.getUpcomingSlots);

router.post('/announce', apController.announce);

router.post('/announce/reset', apController.resetAnnouncedSlots);

router.patch('/offset', apController.makeOffset);

export default router;
