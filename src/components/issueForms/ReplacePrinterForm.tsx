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

const EQUIPMENT_TYPES = ['Термопринтер', 'Принтер А4/МФУ'];

const TERMO_MODELS = ['ATOL TT43', 'TSC TE210', 'Zebra GK420t'];

const MFU_MODELS = [
    'Kyocera M2235dn',
    'Kyocera M3040dn',
    'HP M430',
    'Pantum M6600nw',
    'Pantum-P2500nw',
];

const LOCATIONS = ['ПВЗ', 'TWH', 'LaSport', 'Hybrid'];

export function ReplacePrinterForm({ parsed, setParsed }: Props) {
    const isTsd = parsed.equipmentType === 'Термопринтер';

    const modelOptions = (isTsd ? TERMO_MODELS : MFU_MODELS).map((model) => ({
        value: model,
        content: model,
    }));

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
                            {parsed.equipmentType === 'Термопринтер'
                                ? 'Модель термопринтера'
                                : 'Модель МФУ'}
                        </Text>
                        <div style={{ marginTop: 8 }}>
                            <Select
                                width={370}
                                value={parsed.equipmentModel ? [parsed.equipmentModel] : []}
                                options={modelOptions}
                                onUpdate={handleModelChange}
                                placeholder={
                                    isTsd ? 'Выберите модель термопринтера' : 'Выберите модель МФУ'
                                }
                                disabled={!parsed.equipmentType}
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
