import https from 'https';

const sendMessage = async (path: 'reply' | 'push' | 'multicast', data: any) => {
    const dataString = JSON.stringify(data);

    // Options to pass into the request
    const webhookOptions = {
        hostname: 'api.line.me',
        path: `/v2/bot/message/${path}`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + process.env.LINE_ACCESS_TOKEN,
        },
        body: dataString,
    };

    // Define request
    const request = https.request(webhookOptions, (res) => {
        res.on('data', (d) => {
            process.stdout.write(d);
        });
    });

    // Handle error
    request.on('error', (err) => {
        console.error(err);
    });

    // Send data
    request.write(dataString);
    request.end();

    return;
};

const groupMessage = <T>(
    obj: Record<string, T[]>
): Record<string, string[]> => {
    const groupedObj: Record<string, string[]> = {};

    for (const key in obj) {
        const value = JSON.stringify(obj[key]);
        if (groupedObj[value]) {
            groupedObj[value].push(key);
        } else {
            groupedObj[value] = [key];
        }
    }

    return groupedObj;
};

export default { sendMessage, groupMessage };
