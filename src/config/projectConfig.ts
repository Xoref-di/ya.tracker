export type ProjectCode = 'ITEQUIPHO' | 'NET' | 'ONESSUP';

export interface ProjectConfig {
    queue: ProjectCode;
    issueType: string;

    copyFields: Record<string, string>;

    copyAuthor: boolean;
    copyFollowers: boolean;

    requiresDescription: boolean;
}

export const PROJECTS: ProjectConfig[] = [
    {
        queue: 'ITEQUIPHO',

        issueType: 'Оборудование',

        copyFields: {
            'Контактный номер телефона': 'Телефон',
            'Укажите адрес': 'Адрес получателя',
            'Описание проблемы': 'description',
            'ФИО сотрудника или логин учётной записи у которого возникла проблема':
                'ФИО управляющего ТО',
            Локация: 'Локация (EQ)',
        },

        copyAuthor: true,
        copyFollowers: true,

        requiresDescription: false,
    },

    {
        queue: 'NET',

        issueType: 'Запрос',

        copyFields: {},

        copyAuthor: false,

        copyFollowers: false,

        requiresDescription: true,
    },

    {
        queue: 'ONESSUP',

        issueType: 'Запрос',

        copyFields: {},

        copyAuthor: false,

        copyFollowers: false,

        requiresDescription: true,
    },
];
