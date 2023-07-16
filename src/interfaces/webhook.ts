export interface IEvent {
    replyToken: string;
    type: string;
    timestamp: number;
    source: {
        type: string;
        userId: string;
    };
    message: {
        id: string;
        type: string;
        text: string;
    };
}
