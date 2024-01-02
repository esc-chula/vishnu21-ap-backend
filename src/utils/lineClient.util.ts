import {
    Message,
    MessageEvent,
    WebhookEvent,
    messagingApi,
} from '@line/bot-sdk';
import dotenv from 'dotenv';
dotenv.config();

const client = new messagingApi.MessagingApiClient({
    channelAccessToken: process.env.LINE_ACCESS_TOKEN!,
});

const getProfile = async (userId: string) => {
    const profile = await client
        .getGroupMemberProfile(process.env.LINE_VERIFIED_GROUP_ID!, userId)
        .then((profile) => profile)
        .catch((e) => {
            console.log(e.originalError.response.data.message);
            return null;
        });
    return profile;
};

const replyMessage = async (replyToken: string, messages: Message[]) => {
    const sentMessages = await client
        .replyMessage({ replyToken, messages })
        .then((sentMessages) => sentMessages)
        .catch((e) => {
            console.log(e.originalError.response.data.message);
            return null;
        });
    return sentMessages;
};

const replyText = async (replyToken: string, text: string) => {
    const sentMessages = await client
        .replyMessage({
            replyToken,
            messages: [
                {
                    type: 'text',
                    text,
                },
            ],
        })
        .then((sentMessages) => sentMessages)
        .catch((e) => {
            console.log(e.originalError.response.data.message);
            return null;
        });
    return sentMessages;
};

export default { getProfile, replyMessage, replyText };
