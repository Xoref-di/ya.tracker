import React, { useEffect, useState } from 'react';

import { Select, TextArea, TextInput } from '@gravity-ui/uikit';

import { THEME_ASSETS } from '../../config/themeAssets';
import { useDWHData } from '../../hooks/useDWHData';

import { ThemeFormWrapper, type ThemeName } from './themes/ThemeFormWrapper';

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
        toName?: string;
        toId?: string;
        toType?: string;
        shortCostCenter?: string;
        storeTitle?: string;
    };
    setParsed: React.Dispatch<React.SetStateAction<any>>;
    theme?: ThemeName;
};

const EQUIPMENT_TYPES = ['Маршрутизатор', 'Коммутатор', 'Wi-Fi AP (точка доступа)'];

const ROUTER_MODELS = [
    'Cisco C819G-4G-GA-K9',
    'Cisco C1111-8PLTEEA',
    'Mikrotik RBD53iG-5HacD2HnD',
    'MikroTik RBD53GR-5HacD2HnD&R11e-LTE6',
];

const SWITCH_MODELS = ['Cisco C1111-8PLTEEA'];

const AP_MODELS: string[] = [];

const LOCATIONS = ['ПВЗ', 'TWH', 'СЦ', 'LaSport', 'Hybrid'];

export function ReplaceNetForm({ parsed, setParsed, theme = 'classic' }: Props) {
    const assets = THEME_ASSETS[theme] ?? THEME_ASSETS.classic;

    const { locations, findLocationByAddress, findLocationByTitle } = useDWHData();

    const [addressOptions, setAddressOptions] = useState<{ value: string; content: string }[]>([]);

    useEffect(() => {
        setAddressOptions(
            locations.map((loc) => ({
                value: loc.address,
                content: loc.address,
            })),
        );
    }, [locations]);

    useEffect(() => {
        if (locations.length === 0) return;

        const title = parsed.toName || parsed.storeTitle;
        if (!parsed.address && !title) return;

        let locationData = parsed.address ? findLocationByAddress(parsed.address) : undefined;

        if (!locationData && title) {
            locationData = findLocationByTitle(title);
        }

        if (!locationData) return;

        const isLaSport = locationData.toType === 'LaSport';
        const managerName = isLaSport
            ? locationData.storeManagerName
            : locationData.managerName || locationData.storeManagerName;
        const managerPhone = isLaSport
            ? locationData.storeManagerPhone
            : locationData.managerPhone || locationData.storeManagerPhone;

        if (!parsed.employee || !parsed.phone || !parsed.location || !parsed.address) {
            setParsed((prev: any) => ({
                ...prev,
                address: prev.address || locationData!.address,
                toId: prev.toId || locationData!.id,
                toName: prev.toName || locationData!.toName,
                toType: prev.toType || locationData!.toType,
                shortCostCenter: prev.shortCostCenter || locationData!.shortCostCenter,
                employee: prev.employee || managerName || '',
                phone: prev.phone || managerPhone || '',
                location: prev.location || locationData!.toType || '',
            }));
        }
    }, [locations, parsed.address, parsed.toName, parsed.storeTitle]);

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

        setParsed((prev: any) => ({
            ...prev,
            equipmentType: newType,
            equipmentModel: '',
            equipmentName: newType,
        }));
    };

    const handleModelChange = (values: string[]) => {
        const newModel = values[0] ?? '';

        setParsed((prev: any) => ({
            ...prev,
            equipmentModel: newModel,
            equipmentName: newModel,
        }));
    };

    const handleAddressChange = (values: string[]) => {
        const selectedAddress = values[0] ?? '';
        const locationData = findLocationByAddress(selectedAddress);

        if (locationData) {
            const isLaSport = locationData.toType === 'LaSport';
            const managerName = isLaSport
                ? locationData.storeManagerName
                : locationData.managerName || locationData.storeManagerName;
            const managerPhone = isLaSport
                ? locationData.storeManagerPhone
                : locationData.managerPhone || locationData.storeManagerPhone;

            setParsed((prev: any) => ({
                ...prev,
                address: selectedAddress,
                toId: locationData.id,
                toName: locationData.toName,
                toType: locationData.toType,
                shortCostCenter: locationData.shortCostCenter,
                employee: managerName || '',
                phone: managerPhone || '',
                location: locationData.toType || prev.location,
            }));
        } else {
            setParsed((prev: any) => ({ ...prev, address: selectedAddress }));
        }
    };

    const getModelLabel = () => {
        if (parsed.equipmentType) {
            return `Модель ${parsed.equipmentType}`;
        }
        return 'Модель оборудования';
    };

    const getModelPlaceholder = () => {
        if (parsed.equipmentType) {
            return `Выберите модель ${parsed.equipmentType}`;
        }
        return 'Выберите модель';
    };

    return (
        <ThemeFormWrapper
            theme={theme}
            title="Сетевое оборудование"
            headerEmoji={assets.cardHeaderEmoji}
            badge={assets.cardBadge}
            bannerText={assets.banners.net}
            bannerEmoji={assets.bannerEmoji}
            bannerRight={assets.bannerRight}
            decor={assets.decor.map((d, i) => ({
                char: d.char,
                left: `${10 + i * 25}%`,
                delay: `${i}s`,
                duration: `${14 + i * 2}s`,
                size: 18,
            }))}
        >
            <div className="theme-grid">
                <div>
                    <div className="theme-label">
                        <span>Наименование оборудования</span>
                        <span className="theme-required">*</span>
                    </div>
                    <div className="theme-field">
                        <Select
                            value={parsed.equipmentType ? [parsed.equipmentType] : []}
                            options={EQUIPMENT_TYPES.map((type) => ({
                                value: type,
                                content: type,
                            }))}
                            onUpdate={handleEquipmentTypeChange}
                            placeholder="Выберите оборудование"
                        />
                    </div>
                    <div className="theme-hint">Что у нас сломалось?</div>

                    {parsed.equipmentType && (
                        <>
                            <div className="theme-label theme-field-gap">
                                <span>{getModelLabel()}</span>
                            </div>
                            <div className="theme-field">
                                <Select
                                    value={parsed.equipmentModel ? [parsed.equipmentModel] : []}
                                    options={getModelOptions()}
                                    onUpdate={handleModelChange}
                                    placeholder={getModelPlaceholder()}
                                    disabled={!parsed.equipmentType}
                                    filterable
                                    filterPlaceholder="Поиск модели..."
                                />
                            </div>
                            <div className="theme-hint">
                                {getModelOptions().length > 0
                                    ? 'Выберите модель из списка'
                                    : 'Список моделей пока пуст'}
                            </div>
                        </>
                    )}

                    <div className="theme-label theme-field-gap">
                        <span>SN (Серийный номер)</span>
                    </div>
                    <div className="theme-field">
                        <TextInput
                            value={parsed.serialNumber || ''}
                            onUpdate={(value) =>
                                setParsed((prev: any) => ({ ...prev, serialNumber: value }))
                            }
                            placeholder="Введите серийный номер"
                        />
                    </div>
                    <div className="theme-hint">Указан на корпусе</div>
                </div>

                <div>
                    <div className="theme-label">
                        <span>Локация</span>
                    </div>
                    <div className="theme-field">
                        <Select
                            value={parsed.location ? [parsed.location] : []}
                            options={LOCATIONS.map((location) => ({
                                value: location,
                                content: location,
                            }))}
                            onUpdate={(values) =>
                                setParsed((prev: any) => ({
                                    ...prev,
                                    location: values[0] ?? '',
                                }))
                            }
                            placeholder="Выберите локацию"
                        />
                    </div>
                    <div className="theme-hint">Подставляется из адреса</div>

                    <div className="theme-label theme-field-gap">
                        <span>ФИО Управляющего объекта</span>
                    </div>
                    <div className="theme-field">
                        <TextInput
                            value={parsed.employee || ''}
                            onUpdate={(value) =>
                                setParsed((prev: any) => ({ ...prev, employee: value }))
                            }
                            placeholder="Введите ФИО"
                        />
                    </div>
                    <div className="theme-hint">Контактное лицо</div>

                    <div className="theme-label theme-field-gap">
                        <span>Телефон</span>
                    </div>
                    <div className="theme-field">
                        <TextInput
                            value={parsed.phone || ''}
                            onUpdate={(value) =>
                                setParsed((prev: any) => ({ ...prev, phone: value }))
                            }
                            placeholder="Введите телефон"
                        />
                    </div>
                    <div className="theme-hint">Номер телефона</div>
                </div>
            </div>

            <div className="theme-full-width">
                <div className="theme-label">
                    <span>Адрес отправителя</span>
                </div>
                <div className="theme-field">
                    <Select
                        value={parsed.address ? [parsed.address] : []}
                        options={addressOptions}
                        onUpdate={handleAddressChange}
                        placeholder="Выберите адрес"
                        filterable={true}
                        filterPlaceholder="Введите адрес для поиска..."
                    />
                </div>
                <div className="theme-hint">Локация, ФИО и телефон подставятся автоматически</div>
            </div>

            <div className="theme-full-width">
                <div className="theme-label">
                    <span>Описание проблемы</span>
                </div>
                <div className="theme-field">
                    <TextArea
                        minRows={8}
                        value={parsed.description || ''}
                        onUpdate={(value) =>
                            setParsed((prev: any) => ({ ...prev, description: value }))
                        }
                        placeholder="Опишите проблему"
                    />
                </div>
                <div className="theme-hint">Чем подробнее, тем быстрее</div>
            </div>
        </ThemeFormWrapper>
    );
}
