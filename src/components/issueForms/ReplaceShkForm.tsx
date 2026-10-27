import React from 'react';

import { Select, Text, TextArea, TextInput } from '@gravity-ui/uikit';

type Props = {
    parsed: {
        employee: string;
        location: string;
        address: string;
        phone: string;
        serialNumber: string;
        equipmentType: string;
        equipmentModel: string;
        equipmentName: string;
        problem: string;
        description: string;
    };
    setParsed: React.Dispatch<
        React.SetStateAction<{
            employee: string;
            location: string;
            address: string;
            phone: string;
            serialNumber: string;
            equipmentType: string;
            equipmentModel: string;
            equipmentName: string;
            problem: string;
            description: string;
        }>
    >;
};

const EQUIPMENT_TYPES = [
    'СШК',
    'Ридер\\Платежный терминал',
    'Касса',
    'Камера',
    'Монитор',
    'Мышь',
    'Клавиатура',
    'Телевизор',
    'Периферия',
];

// Типы, где модель выбирается из списка (Select)
const TYPES_WITH_SELECT_MODEL = ['СШК', 'Ридер\\Платежный терминал', 'Касса'];

// Типы, где модель вводится вручную (TextInput)
const TYPES_WITH_INPUT_MODEL = ['Камера', 'Монитор', 'Телевизор'];

// Типы, где модель НЕ показывается
const TYPES_WITHOUT_MODEL = ['Мышь', 'Клавиатура', 'Периферия'];

// Модели для каждого типа
const SHK_MODELS = [
    'ATOL Impulse 12BT',
    'G-SENSE IS1402BT HD',
    'Honeywell 1472g',
    'Newland NLS-HR3280-S5',
    'ATOL SB2109 BT',
];

const RIDER_MODELS = ['P17'];

const CASH_MODELS = ['Атол 25Ф', 'Атол FPrint-22ПТК'];

const LOCATIONS = ['ПВЗ', 'TWH', 'LaSport', 'Hybrid'];

export function ReplaceShkForm({ parsed, setParsed }: Props) {
    const isSelectType = TYPES_WITH_SELECT_MODEL.includes(parsed.equipmentType);
    const isInputType = TYPES_WITH_INPUT_MODEL.includes(parsed.equipmentType);

    // Получаем опции для селекта в зависимости от типа
    const getModelOptions = () => {
        let models: string[] = [];

        switch (parsed.equipmentType) {
            case 'СШК':
                models = SHK_MODELS;
                break;
            case 'Ридер\\Платежный терминал':
                models = RIDER_MODELS;
                break;
            case 'Касса':
                models = CASH_MODELS;
                break;
            default:
                models = [];
        }

        return models.map((model) => ({
            value: model,
            content: model,
        }));
    };

    const handleEquipmentTypeChange = (values: string[]) => {
        const newType = values[0] ?? '';

        setParsed((prev) => ({
            ...prev,
            equipmentType: newType,
            equipmentModel: '',
            equipmentName: newType,
        }));
    };

    const handleModelSelectChange = (values: string[]) => {
        const newModel = values[0] ?? '';

        setParsed((prev) => ({
            ...prev,
            equipmentModel: newModel,
            equipmentName: newModel,
        }));
    };

    const handleModelInputChange = (value: string) => {
        setParsed((prev) => ({
            ...prev,
            equipmentModel: value,
            equipmentName: value,
        }));
    };

    // Определяем лейбл для поля модели
    const getModelLabel = () => {
        if (parsed.equipmentType) {
            if (parsed.equipmentType === 'Ридер\\Платежный терминал') {
                return 'Модель Ридера';
            }
            return `Модель ${parsed.equipmentType}`;
        }
        return 'Модель оборудования';
    };

    // Определяем плейсхолдер для поля модели
    const getModelPlaceholder = () => {
        if (isSelectType) {
            if (parsed.equipmentType === 'СШК') return 'Выберите модель СШК';
            if (parsed.equipmentType === 'Ридер\\Платежный терминал')
                return 'Выберите модель Ридера';
            return `Выберите модель ${parsed.equipmentType}`;
        }
        if (isInputType) {
            return `Введите модель ${parsed.equipmentType}`;
        }
        return 'Введите модель';
    };

    return (
        <div style={{ marginTop: 20 }}>
            {/* Сетка для компактного расположения полей */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {/* Левая колонка */}
                <div>
                    <Text variant="subheader-2">Наименование оборудования</Text>
                    <div style={{ marginTop: 8 }}>
                        <Select
                            width={370}
                            value={parsed.equipmentType ? [parsed.equipmentType] : []}
                            options={EQUIPMENT_TYPES.map((type) => ({
                                value: type,
                                content: type,
                            }))}
                            onUpdate={handleEquipmentTypeChange}
                            placeholder="Выберите оборудование"
                        />
                    </div>

                    {/* Поле модели: показываем если есть тип и он не в списке WITHOUT_MODEL */}
                    {parsed.equipmentType &&
                        !TYPES_WITHOUT_MODEL.includes(parsed.equipmentType) && (
                            <div style={{ marginTop: 20 }}>
                                <Text variant="subheader-2">{getModelLabel()}</Text>
                                <div style={{ marginTop: 8 }}>
                                    {isSelectType ? (
                                        // Селект для выбора модели - БЕЗ ПОИСКА
                                        <Select
                                            width={370}
                                            value={
                                                parsed.equipmentModel ? [parsed.equipmentModel] : []
                                            }
                                            options={getModelOptions()}
                                            onUpdate={handleModelSelectChange}
                                            placeholder={getModelPlaceholder()}
                                            // ✅ Убраны filterable, searchPlaceholder, emptyPlaceholder
                                        />
                                    ) : isInputType ? (
                                        // Текстовое поле для ручного ввода
                                        <TextInput
                                            value={parsed.equipmentModel || ''}
                                            onUpdate={handleModelInputChange}
                                            placeholder={getModelPlaceholder()}
                                        />
                                    ) : null}
                                </div>
                            </div>
                        )}

                    <div style={{ marginTop: 20 }}>
                        <Text variant="subheader-2">Локация</Text>
                        <div style={{ marginTop: 8 }}>
                            <Select
                                width={370}
                                value={parsed.location ? [parsed.location] : []}
                                options={LOCATIONS.map((location) => ({
                                    value: location,
                                    content: location,
                                }))}
                                onUpdate={(values) =>
                                    setParsed((prev) => ({
                                        ...prev,
                                        location: values[0] ?? '',
                                    }))
                                }
                                placeholder="Выберите локацию"
                            />
                        </div>
                    </div>

                    <div style={{ marginTop: 20 }}>
                        <Text variant="subheader-2">Адрес отправителя</Text>
                        <div style={{ marginTop: 8 }}>
                            <TextInput
                                value={parsed.address || ''}
                                onUpdate={(value) =>
                                    setParsed((prev) => ({ ...prev, address: value }))
                                }
                                placeholder="Введите адрес"
                            />
                        </div>
                    </div>
                </div>

                {/* Правая колонка */}
                <div>
                    <Text variant="subheader-2">SN (Серийный номер)</Text>
                    <div style={{ marginTop: 8 }}>
                        <TextInput
                            value={parsed.serialNumber || ''}
                            onUpdate={(value) =>
                                setParsed((prev) => ({
                                    ...prev,
                                    serialNumber: value,
                                }))
                            }
                            placeholder="Введите серийный номер"
                        />
                    </div>

                    <div style={{ marginTop: 20 }}>
                        <Text variant="subheader-2">Телефон</Text>
                        <div style={{ marginTop: 8 }}>
                            <TextInput
                                value={parsed.phone || ''}
                                onUpdate={(value) =>
                                    setParsed((prev) => ({ ...prev, phone: value }))
                                }
                                placeholder="Введите телефон"
                            />
                        </div>
                    </div>

                    <div style={{ marginTop: 20 }}>
                        <Text variant="subheader-2">ФИО Управляющего объекта</Text>
                        <div style={{ marginTop: 8 }}>
                            <TextInput
                                value={parsed.employee || ''}
                                onUpdate={(value) =>
                                    setParsed((prev) => ({ ...prev, employee: value }))
                                }
                                placeholder="Введите ФИО"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Блок описания (на всю ширину) */}
            <div style={{ marginTop: 24 }}>
                <Text variant="subheader-2">Описание проблемы</Text>
                <div style={{ marginTop: 8 }}>
                    <TextArea
                        minRows={8}
                        value={parsed.description || ''}
                        onUpdate={(value) => setParsed((prev) => ({ ...prev, description: value }))}
                        placeholder="Опишите проблему"
                    />
                </div>
            </div>
        </div>
    );
}
