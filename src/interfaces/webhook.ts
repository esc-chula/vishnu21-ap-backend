import { ReplyableEvent, TextEventMessage } from '@line/bot-sdk';

export type TextEvent = {
    type: 'message';
    message: TextEventMessage;
    replyToken: string;
} & ReplyableEvent;
