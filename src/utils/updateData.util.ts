import axios from 'axios';
import fs from 'fs';

export default async function updateData(sheet: string) {
    const sheetData = await axios
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

    if (sheetData) {
        fs.writeFileSync(
            `./src/data/${sheet}.json`,
            JSON.stringify(sheetData, null, 4)
        );
    }

    return sheetData;
}
