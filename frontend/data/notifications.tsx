interface INotification {
    id: number;
    text: string;
    time: string;
};

export const notifications: INotification[] = [
    { id: 1, text: "Новый заказ #1234", time: "5 мин назад" },
    { id: 2, text: "Товар заканчивается", time: "1 час назад" },
    { id: 3, text: "Новый клиент", time: "2 часа назад" },
];