import { ISlot } from '@/interfaces/ap';
import { TextEvent } from '@/interfaces/webhook';
import flexTemplate from '@/templates/flex.template';
import messageTemplate from '@/templates/message.template';
import lineClientUtil from '@/utils/lineClient.util';
import moment from 'moment';

export const announceSlot = async (event: TextEvent, slots: ISlot[]) => {
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
            contactName: 'เติ้ล',
            contactTel: '0897991699',
        });

        return content;
    });

    if (contents.length > 1) {
        const message = messageTemplate.flex({
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

        lineClientUtil.replyMessage(event.replyToken, [message]);
    } else {
        const content = contents[0];
        const slot = slots[0];
        const start = moment(slot.start).format('HH:mm');
        const end = moment(slot.end).format('HH:mm');
        const message = messageTemplate.flex({
            altText: `${slot.event} ${start}-${end}`,
            contents: content,
        });

        lineClientUtil.replyMessage(event.replyToken, [message]);
    }
};

export default {
    announceSlot,
};
