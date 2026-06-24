import { TreeNodeData } from "@/lib/types/inerfaces";

export const DEMO_TREE: TreeNodeData[] = [
    {
        id: '1',
        title: 'НОМЕНКЛАТУРА',
        children: [
            { id: '1.1', title: 'АВТО И ВЕЛОСИПЕД', children: [] },
            {
                id: '1.2',
                title: 'В НАЛИЧИИ',
                children: [
                    { id: '1.2.1', title: 'Аксессуары' },
                    { id: '1.2.2', title: 'Бытовая химия' },
                ],
            },
        ],
    },
    { id: '2', title: 'ИНСТРУМЕНТ', children: [] },
];