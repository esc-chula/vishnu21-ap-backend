import { TDepartment } from '@/interfaces/department';
import { FlexBubble } from '@line/bot-sdk';

const slotBubble = ({
    slot,
    department,
    start,
    end,
    event,
    location,
    note,
    contactName,
    contactTel,
}: {
    slot: number;
    department: TDepartment;
    start: string;
    end: string;
    event: string;
    location: string;
    note: string;
    contactName: string;
    contactTel: string;
}): FlexBubble => {
    return {
        type: 'bubble',
        size: 'mega',
        body: {
            type: 'box',
            layout: 'vertical',
            contents: [
                {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                        {
                            type: 'text',
                            text: `#${slot} | ${department}`,
                            weight: 'bold',
                            color: '#8B5CF6',
                            size: 'xs',
                        },
                        {
                            type: 'text',
                            text: `${start} - ${end}`,
                            weight: 'bold',
                            size: 'xxl',
                            margin: 'md',
                            color: '#F8FAFC',
                        },
                    ],
                    paddingAll: 'xxl',
                    backgroundColor: '#020617',
                },
                {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                        {
                            type: 'box',
                            layout: 'vertical',
                            contents: [
                                {
                                    type: 'text',
                                    text: 'กิจกรรม',
                                    size: 'xs',
                                    color: '#64748B',
                                },
                                {
                                    type: 'text',
                                    text: `${event}`,
                                    size: 'xl',
                                    weight: 'bold',
                                    wrap: true,
                                    color: '#1E293B',
                                },
                            ],
                        },
                        {
                            type: 'separator',
                            margin: 'xl',
                            color: '#F8FAFC',
                        },
                        {
                            type: 'box',
                            layout: 'vertical',
                            contents: [
                                {
                                    type: 'text',
                                    text: 'สถานที่',
                                    size: 'xs',
                                    color: '#64748B',
                                },
                                {
                                    type: 'text',
                                    text: `${location}`,
                                    size: 'lg',
                                    weight: 'bold',
                                    wrap: true,
                                    color: '#1E293B',
                                },
                            ],
                        },
                        {
                            type: 'separator',
                            margin: 'xl',
                            color: '#F8FAFC',
                        },
                        {
                            type: 'box',
                            layout: 'vertical',
                            contents: [
                                {
                                    type: 'text',
                                    text: 'หมายเหตุ',
                                    size: 'xs',
                                    color: '#64748B',
                                },
                                {
                                    type: 'text',
                                    text: `${note ? note : '-'}`,
                                    color: '#334155',
                                },
                            ],
                        },
                    ],
                    paddingAll: 'xxl',
                    paddingBottom: 'xs',
                    backgroundColor: '#F8FAFC',
                },
                {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                        {
                            type: 'box',
                            layout: 'vertical',
                            contents: [
                                {
                                    type: 'button',
                                    action: {
                                        type: 'uri',
                                        label: `โทรหา ${contactName}`,
                                        uri: `tel:${contactTel}`,
                                    },
                                    color: '#334155',
                                    height: 'sm',
                                },
                            ],
                            backgroundColor: '#E2E8F0',
                            cornerRadius: 'lg',
                        },
                    ],
                    paddingAll: 'xxl',
                    backgroundColor: '#F8FAFC',
                },
            ],
            paddingAll: 'none',
        },
        styles: {
            footer: {
                separator: true,
            },
        },
    };
};

const setOffsetBubble = ({
    slot,
    offset,
}: {
    slot: number;
    offset: number;
}): FlexBubble => {
    return {
        type: 'bubble',
        size: 'kilo',
        body: {
            type: 'box',
            layout: 'vertical',
            contents: [
                {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                        {
                            type: 'text',
                            text: 'ANNOUNCEMENT',
                            weight: 'bold',
                            color: '#e94444',
                            size: 'xs',
                        },
                        {
                            type: 'text',
                            text: `${offset > 0 ? `+${offset}` : offset} นาที`,
                            weight: 'bold',
                            size: 'xxl',
                            margin: 'md',
                            color: '#F8FAFC',
                        },
                    ],
                    paddingAll: 'xxl',
                    backgroundColor: '#020617',
                },
                {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                        {
                            type: 'box',
                            layout: 'vertical',
                            contents: [
                                {
                                    type: 'text',
                                    text: 'ตั้งแต่',
                                    size: 'xs',
                                    color: '#64748B',
                                },
                                {
                                    type: 'text',
                                    text: `Slot #${slot} เป็นต้นไป`,
                                    size: 'xl',
                                    weight: 'bold',
                                    wrap: true,
                                    color: '#1E293B',
                                },
                            ],
                        },
                    ],
                    paddingAll: 'xxl',
                },
            ],
            paddingAll: 'none',
        },
        styles: {
            footer: {
                separator: true,
            },
        },
    };
};

export default {
    slotBubble,
    setOffsetBubble,
};
