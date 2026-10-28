import React, { useEffect, useState } from 'react';

import { Select, TextArea, TextInput } from '@gravity-ui/uikit';

import { THEME_ASSETS } from '../../config/themeAssets';
import { type DWHLocation, useDWHData } from '../../hooks/useDWHData';

import { ThemeFormWrapper, type ThemeName } from './themes/ThemeFormWrapper';

// 1. Строгий тип для parsed
type ParsedData = {
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

type Props = {
    parsed: ParsedData;
    setParsed: React.Dispatch<React.SetStateAction<ParsedData>>;
    theme?: ThemeName;
};

const EQUIPMENT_TYPES = ['ТСД', 'Смартфон'];

const TSD_MODELS = [
    'ATOL PT-5 Lite',
    'Point Mobile PM84',
    'Honeywell EDA51',
    'Urovo DT50',
    'Meferi ME40K',
];

const SMARTPHONE_MODELS = ['Samsung Galaxy A13', 'Samsung Galaxy A14', 'Samsung Galaxy A16', 'Samsung Galaxy A17', 'Samsung Galaxy A20', 'Samsung Galaxy A20s', 'Samsung Galaxy A21s', 'Samsung Galaxy A22'];

const LOCATIONS = ['ПВЗ', 'TWH', 'СЦ', 'LaSport', 'Hybrid'];

export function ReplaceTsdForm({ parsed, setParsed, theme = 'classic' }: Props) {
    const isTsd = parsed.equipmentType === 'ТСД';
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

        let locationData: DWHLocation | undefined = parsed.address
            ? findLocationByAddress(parsed.address)
            : undefined;

        if (!locationData && title) {
            locationData = findLocationByTitle(title);
        }

        if (!locationData) return;

        // Создаём константу. TypeScript теперь точно знает, что это DWHLocation (не undefined)
        const data = locationData;

        const isLaSport = data.toType === 'LaSport';
        const managerName = isLaSport
            ? data.storeManagerName
            : data.managerName || data.storeManagerName;
        const managerPhone = isLaSport
            ? data.storeManagerPhone
            : data.managerPhone || data.storeManagerPhone;

        if (!parsed.employee || !parsed.phone || !parsed.location || !parsed.address) {
            setParsed((prev) => ({
                ...prev,
                address: prev.address || data.address,
                toId: prev.toId || data.id,
                toName: prev.toName || data.toName,
                toType: prev.toType || data.toType,
                shortCostCenter: prev.shortCostCenter || data.shortCostCenter,
                employee: prev.employee || managerName || '',
                phone: prev.phone || managerPhone || '',
                location: prev.location || data.toType || '',
            }));
        }
    }, [locations, parsed.address, parsed.toName, parsed.storeTitle, setParsed]);

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

            setParsed((prev) => ({
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
            setParsed((prev) => ({ ...prev, address: selectedAddress }));
        }
    };

    return (
        <ThemeFormWrapper
            theme={theme}
            title="Оборудование"
            headerEmoji={assets.cardHeaderEmoji}
            badge={assets.cardBadge}
            bannerText={assets.banners.tsd}
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
                {/* ===== ЛЕВАЯ КОЛОНКА ===== */}
                <div>
                    <div className="theme-label">
                        <span>Наименование</span>
                        <span className="theme-required">*</span>
                    </div>
                    <div className="theme-field">
                        <Select
                            width="100%"
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

                    <div className="theme-label theme-field-gap">
                        <span>{isTsd ? 'Модель ТСД' : 'Модель смартфона'}</span>
                    </div>
                    <div className="theme-field">
                        <Select
                            width="100%"
                            value={parsed.equipmentModel ? [parsed.equipmentModel] : []}
                            options={modelOptions}
                            onUpdate={handleModelChange}
                            placeholder={
                                isTsd ? 'Выберите модель ТСД' : 'Выберите модель смартфона'
                            }
                            disabled={!parsed.equipmentType}
                            filterable
                            filterPlaceholder="Поиск модели..."
                        />
                    </div>
                    <div className="theme-hint">
                        {parsed.equipmentType
                            ? 'Начните вводить для поиска'
                            : 'Сначала выберите тип'}
                    </div>

                    <div className="theme-label theme-field-gap">
                        <span>SN (Серийный номер)</span>
                    </div>
                    <div className="theme-field">
                        <TextInput
                            width="100%"
                            value={parsed.serialNumber || ''}
                            onUpdate={(value) =>
                                setParsed((prev) => ({ ...prev, serialNumber: value }))
                            }
                            placeholder="Введите серийный номер"
                        />
                    </div>
                    <div className="theme-hint">Указан на корпусе</div>
                </div>

                {/* ===== ПРАВАЯ КОЛОНКА ===== */}
                <div>
                    <div className="theme-label">
                        <span>Локация</span>
                    </div>
                    <div className="theme-field">
                        <Select
                            width="100%"
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
                    <div className="theme-hint">Подставляется из адреса</div>

                    <div className="theme-label theme-field-gap">
                        <span>ФИО Управляющего объекта</span>
                    </div>
                    <div className="theme-field">
                        <TextInput
                            width="100%"
                            value={parsed.employee || ''}
                            onUpdate={(value) =>
                                setParsed((prev) => ({ ...prev, employee: value }))
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
                            width="100%"
                            value={parsed.phone || ''}
                            onUpdate={(value) => setParsed((prev) => ({ ...prev, phone: value }))}
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
                        width="100%"
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
                        onUpdate={(value) => setParsed((prev) => ({ ...prev, description: value }))}
                        placeholder="Опишите проблему"
                    />
                </div>
                <div className="theme-hint">Чем подробнее, тем лучше</div>
            </div>
        </ThemeFormWrapper>
    );
}
