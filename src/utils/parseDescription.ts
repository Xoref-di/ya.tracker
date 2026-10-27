export interface ParsedDescription {
    employee?: string;
    location?: string;
    address?: string;
    phone?: string;
    serialNumber?: string;
    equipmentModel?: string;
    equipmentType?: string;
    equipmentName?: string;
    problem?: string;
}

function getValue(text: string, label: string): string | undefined {
    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const regexp = new RegExp(`${escaped}:\\s*([\\s\\S]*?)(?=\\n\\n[^\\n]+:|$)`, 'i');

    const match = text.match(regexp);

    return match?.[1].trim();
}

export function parseDescription(description: string): ParsedDescription {
    return {
        employee: getValue(
            description,
            'ФИО сотрудника или логин учётной записи у которого возникла проблема',
        ),
        location: getValue(description, 'Локация'),
        address: getValue(description, 'Укажите адрес'),
        phone: getValue(description, 'Контактный номер телефона'),
        serialNumber: getValue(description, 'Серийный номер'),
        equipmentType: getValue(description, 'Тип оборудования'),
        problem: getValue(description, 'Описание проблемы'),
        equipmentModel:
            getValue(description, 'Модель ТСД') ||
            getValue(description, 'Модель смартфона') ||
            getValue(description, 'Модель термопринтера') ||
            getValue(description, 'Модель СШК') ||
            getValue(description, 'Модель ПК'),
        equipmentName: getValue(description, 'Имя термопринтера'),
    };
}
