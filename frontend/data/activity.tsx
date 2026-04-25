interface IActivity {
    title: string;
    lastTime: string;
    colorName: string;
}

export const lastActivity: IActivity[] = [
    {
        title: "Заказ #1234 выполнен",
        lastTime: "5 минут назад",
        colorName: "green"
    },
    {
        title: "Новый клиент: Алексей П.",
        lastTime: "1 час назад",
        colorName: "blue"
    },
    {
        title: "Товар \"Ноутбук\" заканчивается",
        lastTime: "2 часа назад",
        colorName: "yellow"
    },
]