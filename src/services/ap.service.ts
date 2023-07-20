import moment from 'moment';
import { ISlot } from '@/interfaces/ap';
import webhookService from './webhook.service';
import ApModel from '@/models/ap.model';
import { TDepartment } from '@/interfaces/department';
import axios from 'axios';

const create = async (body: ISlot) => {
    const createdSlot = await ApModel.create(body)
        .then((slot) => slot)
        .catch((e) => {
            console.log(e);
            return null;
        });

    return createdSlot;
};

const findAll = async () => {
    const slots = await ApModel.find()
        .then((slot) => slot)
        .catch(() => null);

    if (!slots) {
        return null;
    }

    return slots.filter((slot) => slot.slot);
};

const findOneBySlot = async (slot: number) => {
    const slotData = await ApModel.findOne({
        slot,
    })
        .then((slot) => slot)
        .catch(() => null);

    return slotData;
};

const updateBySlot = async (
    slot: number,
    body: {
        slot?: number;
        start?: string;
        end?: string;
        duration?: string;
        department?: TDepartment;
        event?: string;
        location?: string;
        contact?: string;
        note?: string;
        announced?: boolean;
    }
) => {
    const updatedSlot = await ApModel.findOneAndUpdate(
        {
            slot,
        },
        body,
        {
            new: true,
        }
    )
        .then((slot) => slot)
        .catch(() => null);

    return updatedSlot;
};

const getSheet = async (sheet: string) => {
    const sheetData: ISlot[] | null = await axios
        .get(process.env.AP_SHEET_API!, {
            params: {
                sheet,
            },
        })
        .then((res) => {
            if (res.data.success) return res.data.data;

            return null;
        })
        .catch(() => null);

    return sheetData;
};

const syncSheet = async (sheet: string) => {
    const sheetData = (await getSheet(sheet))?.filter((slot) => slot.slot);

    if (!sheetData) {
        return null;
    }

    const syncedSheet = sheetData.map(async (slot) => {
        const existedSlot = await findOneBySlot(slot.slot);

        if (!existedSlot) {
            const createdSlot = await create({ ...slot, announced: false });

            return createdSlot;
        }

        const updatedSlot = await updateBySlot(slot.slot, slot);

        return updatedSlot;
    });

    if (syncedSheet.length === 0) {
        return null;
    }

    return syncedSheet;
};

const findActiveSlots = async () => {
    const sheetData = (await findAll()) as ISlot[];

    if (!sheetData) {
        return null;
    }

    const activeSlots = sheetData.filter((slot) => {
        const currentTime = moment();
        const startTime = moment(
            moment(slot.start).format('HH:mm:ss'),
            'HH:mm:ss'
        );
        const endTime = moment(moment(slot.end).format('HH:mm:ss'), 'HH:mm:ss');
        const isBetween = currentTime.isBetween(startTime, endTime);
        const isSameAsStart =
            currentTime.format('HH:mm') === startTime.format('HH:mm');

        if (isBetween || isSameAsStart) return slot;
    });

    return activeSlots.sort((a, b) => a.slot - b.slot);
};

const announce = async () => {
    const activeSlots = await findActiveSlots();

    if (!activeSlots) {
        return null;
    }

    const announcingSlots = [] as ISlot[];

    for (const slot of activeSlots) {
        if (!slot.announced) {
            slot.announced = true;

            const updatedSlot = await updateBySlot(slot.slot, slot);

            announcingSlots.push(Object(updatedSlot));
        }
    }

    return announcingSlots;
};

export default {
    create,
    findAll,
    updateBySlot,
    getSheet,
    syncSheet,
    findActiveSlots,
    announce,
};
