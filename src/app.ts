import bodyParser from 'body-parser';
import cors from 'cors';
import cron from 'node-cron';
import dotenv from 'dotenv';
import express from 'express';
import { syncData } from './utils/updateData';
import { findActiveSlots } from './utils/checkSlots';
import { announceSlot } from './utils/announceSlot';

dotenv.config();

const app = express();

app.use(
    cors({
        origin: '*',
    })
);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

cron.schedule('* * * * *', () => {
    console.log('checking schedule');
    announceSlot('Sheet1', findActiveSlots('Sheet1'));
});

cron.schedule('*/20 * * * *', async () => {
    console.log('syncing google sheet');
    await syncData('Sheet1');
});

app.get('/', async (req, res) => {
    // await syncData('Sheet1');
    const data = findActiveSlots('Sheet1');
    res.send(data);
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
