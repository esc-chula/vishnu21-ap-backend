import { ISlot } from '@/interfaces/slots';
import { updateData } from './updateData';

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
