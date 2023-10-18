import { IMessage } from '@/interfaces/message';
import { FlexContainer, FlexMessage, TextMessage } from '@line/bot-sdk';

const text = ({ contents }: { contents: string }): TextMessage => {
    return {
        type: 'text',
        text: contents,
    };
};

const flex = ({
    altText,
    contents,
}: {
    altText: string;
    contents: FlexContainer;
}): FlexMessage => {
    return {
        type: 'flex',
        altText: altText,
        contents: contents,
    };
};

export default {
    text,
    flex,
};
