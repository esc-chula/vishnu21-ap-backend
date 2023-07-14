import moment from 'moment';
import { ISlot } from '@/interfaces/slots';

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
