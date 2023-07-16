import { ISlot } from '@/interfaces/ap';
import { IMessage } from '@/interfaces/message';
import { IEvent } from '@/interfaces/webhook';
import flexTemplate from '@/templates/flex.template';
import messageTemplate from '@/templates/message.template';
import messageUtil from '@/utils/message.util';
import moment from 'moment';

export const announceSlot = async (event: IEvent, slots: ISlot[]) => {
    const messages: IMessage[] = [];
    const contents = slots.map((slot) => {
        const start = moment(slot.start).format('HH:mm');
        const end = moment(slot.end).format('HH:mm');

        const content = flexTemplate.slotBubble({
            slot: slot.slot,
            department: slot.department,
            start: start,
            end: end,
            event: slot.event,
            location: slot.location,
            note: slot.note,
            contactName: 'ปูน',
            contactTel: '0918751929',
        });

        return content;
    });

    if (contents.length > 1) {
        const message = messageTemplate.message({
            type: 'flex',
            altText: slots
                .map((slot) => {
                    const start = moment(slot.start).format('HH:mm');
                    const end = moment(slot.end).format('HH:mm');
                    return `${slot.event} ${start}-${end}\n`;
                })
                .join(' '),
            contents: {
                type: 'carousel',
                contents: contents,
            },
        });

        const replyData = {
            replyToken: event.replyToken,
            messages: [message],
        };

        messageUtil.sendMessage('reply', replyData);
    } else {
        const content = contents[0];
        const slot = slots[0];
        const start = moment(slot.start).format('HH:mm');
        const end = moment(slot.end).format('HH:mm');
        const message = messageTemplate.message({
            type: 'flex',
            altText: `${slot.event} ${start}-${end}`,
            contents: content,
        });

        const replyData = {
            replyToken: event.replyToken,
            messages: [message],
        };

        messageUtil.sendMessage('reply', replyData);
    }
};

export default {
    announceSlot,
};
