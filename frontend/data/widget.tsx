interface IWidget {
    id: number;
    title: string;
    value: string;
    change: string;
    positive: boolean;
}

export const widgets: IWidget[] = [
    {
        id: 1,
        title: "Товары на исходе",
        value: "24",
        change: "+3 за неделю",
        positive: true,
    },
    {
        id: 2,
        title: "Количество продаж",
        value: "1,234",
        change: "+12% к прошлому месяцу",
        positive: true,
    },
    {
        id: 3,
        title: "Баланс",
        value: "125 000 ₽",
        change: "+8% к прошлому месяцу",
        positive: true,
    },
    {
        id: 4,
        title: "Процент активности",
        value: "78%",
        change: "-2% к прошлому месяцу",
        positive: false,
    }
];