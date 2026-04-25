interface IAction {
    title: string;
    colorName: string;
    action: () => void;
}

export const Actions: IAction[] = [
    { title: "Добавить товар", colorName: "blue", action: () => {} },
    { title: "Создать заказ", colorName: "green", action: () => {} },
    { title: "Добавить клиента", colorName: "purple", action: () => {} },
    { title: "Отчет", colorName: "orange", action: () => {} },
];