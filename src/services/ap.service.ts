import moment from 'moment';
import { ISlot } from '@/interfaces/ap';
import { updateData } from '@/utils/localData.util';

export function findActiveSlots(sheet: string): ISlot[] {
    const sheetData: ISlot[] = require(`@/data/${sheet}.json`);

    const activeSlots = sheetData.filter((slot) => {
        const currentTime = moment();
        const startTime = moment(
            moment(slot.start).format('HH:mm:ss'),
            'HH:mm:ss'
        );
        const endTime = moment(moment(slot.end).format('HH:mm:ss'), 'HH:mm:ss');
        const isBetween = currentTime.isBetween(startTime, endTime);

        if (isBetween) return slot;
    });

    return activeSlots;
}

export function announceSlot(sheet: string, slots: ISlot[]): void {
    const sheetData: ISlot[] = require(`@/data/${sheet}.json`);

    slots.forEach((slot) => {
        if (!slot.announced) {
            slot.announced = true;
            sheetData.forEach((data) => {
                if (data.slot === slot.slot) {
                    data.announced = true;
                }
            });
            console.log('Announcing slot:', slot);
        }
    });

    updateData('Sheet1', sheetData);
}
