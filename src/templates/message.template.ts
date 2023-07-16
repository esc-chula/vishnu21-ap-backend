import { IMessage } from '@/interfaces/message';

const message = ({ type, altText, contents }: IMessage) => {
    return {
        type: type,
        altText: altText,
        contents: contents,
    };
};

export default {
    message,
};
