import React from 'react';

import { Select, Text, TextArea, TextInput } from '@gravity-ui/uikit';

// Оставляем только те пропсы, которые реально используются в форме без вложений
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

const EQUIPMENT_TYPES = ['Маршрутизатор', 'Коммутатор', 'Wi-Fi AP (точка доступа)'];

const ROUTER_MODELS = [
    'Cisco C819G-4G-GA-K9',
    'Cisco C1111-8PLTEEA',
    'Mikrotik RBD53iG-5HacD2HnD',
    'MikroTik RBD53GR-5HacD2HnD&R11e-LTE6 ',
];

const SWITCH_MODELS = ['Cisco C1111-8PLTEEA'];

const AP_MODELS: string[] = [];
// Добавьте модели для Wi-Fi AP если есть

const LOCATIONS = ['ПВЗ', 'TWH', 'LaSport', 'Hybrid'];

export function ReplaceNetForm({ parsed, setParsed }: Props) {
    // Получаем опции для модели в зависимости от типа оборудования
    const getModelOptions = () => {
        let models: string[] = [];

        switch (parsed.equipmentType) {
            case 'Маршрутизатор':
                models = ROUTER_MODELS;
                break;
            case 'Коммутатор':
                models = SWITCH_MODELS;
                break;
            case 'Wi-Fi AP (точка доступа)':
                models = AP_MODELS;
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

    const handleModelChange = (values: string[]) => {
        const newModel = values[0] ?? '';

        setParsed((prev) => ({
            ...prev,
            equipmentModel: newModel,
            equipmentName: newModel,
        }));
    };

    // Определяем лейбл для поля модели
    const getModelLabel = () => {
        if (parsed.equipmentType) {
            return `Модель ${parsed.equipmentType}`;
        }
        return 'Модель оборудования';
    };

    // Определяем плейсхолдер для поля модели
    const getModelPlaceholder = () => {
        if (parsed.equipmentType) {
            return `Выберите модель ${parsed.equipmentType}`;
        }
        return 'Выберите модель';
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

                    {/* Поле модели: показываем если выбран тип оборудования */}
                    {parsed.equipmentType && (
                        <div style={{ marginTop: 20 }}>
                            <Text variant="subheader-2">{getModelLabel()}</Text>
                            <div style={{ marginTop: 8 }}>
                                <Select
                                    width={370}
                                    value={parsed.equipmentModel ? [parsed.equipmentModel] : []}
                                    options={getModelOptions()}
                                    onUpdate={handleModelChange}
                                    placeholder={getModelPlaceholder()}
                                    disabled={!parsed.equipmentType}
                                />
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
                                setParsed((prev) => ({ ...prev, serialNumber: value }))
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
