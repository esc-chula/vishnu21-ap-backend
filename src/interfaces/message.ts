export interface IMessage {
    type: 'text' | 'flex';
    altText: string;
    contents: any;
}
