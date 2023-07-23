import bodyParser from 'body-parser';
import cors from 'cors';
import cron from 'node-cron';
import dotenv from 'dotenv';
import express from 'express';
import moment from 'moment';
import 'moment-timezone';
import mongoose from 'mongoose';
import apController from './controllers/ap.controller';
import userController from './controllers/user.controller';
import webhookController from './controllers/webhook.controller';
import apService from './services/ap.service';

dotenv.config();

const app = express();

// moment.tz.setDefault('Asia/Bangkok');

mongoose
    .connect(
        `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER}.7mwofts.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
    )
    .then(() => {
        console.log('Database connected ');
    })
    .catch((err) => {
        console.log('Database connection error');
        console.log(err);
    });

// cron.schedule('* * * * *', () => {
//     console.log('checking active slots');
//     apService.multicastAnnounceSlots();
// });

// cron.schedule('*/20 * * * *', async () => {
//     console.log('syncing google sheet');
//     await apService.syncSheet(process.env.SHEET_NAME!);
// });

app.use(
    cors({
        origin: [process.env.CLIENT_URL!],
    })
);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/ap', apController);
app.use('/user', userController);
app.use('/webhook', webhookController);

app.get('/', async (req, res) => {
    res.send({
        success: true,
        message: `Server is running watching ${process.env.SHEET_NAME}`,
    });
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
