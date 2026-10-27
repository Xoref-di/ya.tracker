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

const EQUIPMENT_TYPES = ['ТСД', 'Смартфон'];

const TSD_MODELS = ['ATOL PT-5 Lite', 'Point Mobile PM84', 'Honeywell EDA51', 'Urovo DT50'];

const SMARTPHONE_MODELS = ['Samsung Galaxy A14', 'Samsung Galaxy A21s', 'Samsung Galaxy A22'];

const LOCATIONS = ['ПВЗ', 'TWH', 'LaSport', 'Hybrid'];

export function ReplaceTsdForm({ parsed, setParsed }: Props) {
    const isTsd = parsed.equipmentType === 'ТСД';

    const modelOptions = (isTsd ? TSD_MODELS : SMARTPHONE_MODELS).map((model) => ({
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
                            {isTsd ? 'Модель ТСД' : 'Модель смартфона'}
                        </Text>

                        <div style={{ marginTop: 8 }}>
                            <Select
                                width={370}
                                value={parsed.equipmentModel ? [parsed.equipmentModel] : []}
                                options={modelOptions}
                                onUpdate={handleModelChange}
                                placeholder={
                                    isTsd ? 'Выберите модель ТСД' : 'Выберите модель смартфона'
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
                                    setParsed((prev) => ({
                                        ...prev,
                                        address: value,
                                    }))
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
                                setParsed((prev) => ({
                                    ...prev,
                                    serialNumber: value,
                                }))
                            }
                        />
                    </div>

                    <div style={{ marginTop: 20 }}>
                        <Text variant="subheader-2">Телефон</Text>

                        <div style={{ marginTop: 8 }}>
                            <TextInput
                                value={parsed.phone}
                                onUpdate={(value) =>
                                    setParsed((prev) => ({
                                        ...prev,
                                        phone: value,
                                    }))
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
                                    setParsed((prev) => ({
                                        ...prev,
                                        employee: value,
                                    }))
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Описание */}
            <div style={{ marginTop: 24 }}>
                <Text variant="subheader-2">Описание проблемы</Text>

                <div style={{ marginTop: 8 }}>
                    <TextArea
                        minRows={8}
                        value={parsed.description}
                        onUpdate={(value) =>
                            setParsed((prev) => ({
                                ...prev,
                                description: value,
                            }))
                        }
                    />
                </div>
            </div>
        </div>
    );
}
