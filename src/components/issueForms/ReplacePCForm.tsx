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

const EQUIPMENT_TYPES = ['Ноутбук', 'Стационарный ПК'];

const LAPTOP_MODELS = [
    'MSI Modern 14 B11MOU',
    'MSI Modern 14 C5M',
    'MSI Modern 14 C12M',
    'Chuwi CoreBook X',
    'Chuwi CoreBook XPro',
    'HP ProBook 440 G6',
    'HP ProBook 440 G7',
    'HP ProBook 440 G8',
    'HP 240 14 inch G9',
    'HP ProBook 440 14 inch G10',
];

const PC_MODELS = [
    'HP 260 G2 DM',
    'HP 260 G3 DM',
    'HP 260 G4 DM',
    'MSI PRO H510 AP241 (MS-AE03)',
    'MSI PRO H610 AP242 14M (MS-AE06)',
    'DELL OptiPlex 3050',
    'DELL OptiPlex 3060',
];

const LOCATIONS = ['ПВЗ', 'TWH', 'LaSport', 'Hybrid'];

export function ReplacePCForm({ parsed, setParsed }: Props) {
    const isTsd = parsed.equipmentType === 'Ноутбук';

    // Функция для получения опций с возможностью добавления кастомного значения
    const getModelOptions = () => {
        const baseModels = isTsd ? LAPTOP_MODELS : PC_MODELS;
        const options = baseModels.map((model) => ({
            value: model,
            content: model,
        }));

        // Если текущая модель не в списке, добавляем её как опцию
        if (parsed.equipmentModel && !baseModels.includes(parsed.equipmentModel)) {
            options.push({
                value: parsed.equipmentModel,
                content: parsed.equipmentModel,
            });
        }

        return options;
    };

    const modelOptions = getModelOptions();

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

                    <div style={{ marginTop: 20 }}>
                        <Text variant="subheader-2">
                            {parsed.equipmentType === 'Ноутбук' ? 'Модель ноутбука' : 'Модель ПК'}
                        </Text>
                        <div style={{ marginTop: 8 }}>
                            <Select
                                width={370}
                                value={parsed.equipmentModel ? [parsed.equipmentModel] : []}
                                options={modelOptions}
                                onUpdate={handleModelChange}
                                placeholder={
                                    isTsd
                                        ? 'Выберите модель ноутбука или введите вручную'
                                        : 'Выберите модель ПК или введите вручную'
                                }
                                disabled={!parsed.equipmentType}
                                filterable={true}
                                filterPlaceholder="Введите название модели..."
                            />
                        </div>
                    </div>

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
                                value={parsed.address}
                                onUpdate={(value) =>
                                    setParsed((prev) => ({ ...prev, address: value }))
                                }
                            />
                        </div>
                    </div>
                </div>

                {/* Правая колонка */}
                <div>
                    <Text variant="subheader-2">SN (Серийный номер)</Text>
                    <div style={{ marginTop: 8 }}>
                        <TextInput
                            value={parsed.serialNumber}
                            onUpdate={(value) =>
                                setParsed((prev) => ({ ...prev, serialNumber: value }))
                            }
                        />
                    </div>

                    <div style={{ marginTop: 20 }}>
                        <Text variant="subheader-2">Телефон</Text>
                        <div style={{ marginTop: 8 }}>
                            <TextInput
                                value={parsed.phone}
                                onUpdate={(value) =>
                                    setParsed((prev) => ({ ...prev, phone: value }))
                                }
                            />
                        </div>
                    </div>

                    <div style={{ marginTop: 20 }}>
                        <Text variant="subheader-2">ФИО Управляющего объекта</Text>
                        <div style={{ marginTop: 8 }}>
                            <TextInput
                                value={parsed.employee}
                                onUpdate={(value) =>
                                    setParsed((prev) => ({ ...prev, employee: value }))
                                }
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
                        value={parsed.description}
                        onUpdate={(value) => setParsed((prev) => ({ ...prev, description: value }))}
                    />
                </div>
            </div>
        </div>
    );
}
