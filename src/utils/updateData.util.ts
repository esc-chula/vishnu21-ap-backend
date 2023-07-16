import { ISlot } from '@/interfaces/ap';
import axios from 'axios';
import fs from 'fs';

export async function syncData(sheet: string): Promise<ISlot[] | null> {
    const localSheetData: ISlot[] = require(`@/data/${sheet}.json`);

    const sheetData: ISlot[] | null = await axios
        .get(process.env.AP_SHEET_API!, {
            params: {
                sheet,
            },
        })
        .then((res) => {
            if (res.data.success) {
                return res.data.data;
            }
            return null;
        })
        .catch(() => null);

    sheetData?.forEach(
        (slot) =>
            (slot.announced = localSheetData.find(
                (localSheet) => slot.slot === localSheet.slot
            )?.announced)
    );

    if (sheetData) {
        fs.writeFileSync(
            `./src/data/${sheet}.json`,
            JSON.stringify(sheetData, null, 4)
        );
    }

    return sheetData;
}

export function updateData(sheet: string, sheetData: ISlot[]) {
    fs.writeFileSync(
        `./src/data/${sheet}.json`,
        JSON.stringify(sheetData, null, 4)
    );
}
