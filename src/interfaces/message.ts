export interface IMessage {
    type: 'text' | 'flex' | 'carousel';
    altText: string;
    contents: any;
}
