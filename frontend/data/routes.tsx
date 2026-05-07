interface MenuItem {
    label: string;
    href: string;
    children?: MenuItem[];
};

export const routes: MenuItem[] = [
    {
        label: 'Рабочий стол',
        href: '/dashboard',
    },
    {
        label: 'Настройки',
        href: '#',
        children: [
            {
                label: 'Пользователи',
                href: '/dashboard/users',
            }
        ]
    }
];