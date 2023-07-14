import { ISlot } from '@/interfaces/slots';
import axios from 'axios';
import fs from 'fs';

export async function syncData(sheet: string): Promise<ISlot[] | null> {
    const sheetData: ISlot[] | null = await axios
        .get(process.env.GOOGLE_SCRIPT_API_ENDPOINT!, {
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

    sheetData?.forEach((slot) => (slot.announced = false));

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
