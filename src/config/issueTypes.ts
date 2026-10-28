export const ISSUE_TYPES = {
    ITEQUIPHO: [
        {
            value: 'replace-tsd',
            content: 'Замена ТСД \\ Смартфона по неисправности',
        },
        {
            value: 'replace-printer',
            content: 'Замена МФУ \\ Принтера этикеток по неисправности',
        },
        {
            value: 'replace-pc',
            content: 'Замена ноутбука \\ ПК по неисправности',
        },
        {
            value: 'replace-shk',
            content: 'Выдача\\замена периферийного ИТ оборудования',
        },
        {
            value: 'replace-net',
            content: 'Замена сетевого оборудования',
        },
    ],

    NET: [
        {
            value: 'net-question',
            content: 'Вопрос',
        },
        {
            value: 'net-problem',
            content: 'Проблема',
        },
        {
            value: 'net-config',
            content: 'Настройка',
        },
        {
            value: 'net-access',
            content: 'Доступ',
        },
    ],

    ONESSUP: [
        {
            value: 'sup-question',
            content: 'Вопрос',
        },
    ],

    ITINT: [
        {
            value: 'itint-integrator',
            content: 'Инцидент',
        },
    ],
} as const;
