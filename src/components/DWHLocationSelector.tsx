// src/components/DWHLocationSelector.tsx
import React, { useEffect, useRef } from 'react';

import { Button, Loader, Select, Text } from '@gravity-ui/uikit';

import { type DWHLocation } from '../hooks/useDWHData';
import { useDWHData } from '../hooks/useDWHData';

interface DWHLocationSelectorProps {
    parsed: any;
    setParsed: React.Dispatch<React.SetStateAction<any>>;
    showCard?: boolean; // Флаг для управления карточкой
}

export const DWHLocationSelector = ({
    parsed,
    setParsed,
    showCard = true, // по умолчанию показываем
}: DWHLocationSelectorProps) => {
    const { locations, loading, error, findLocationByToName, findLocationByAddress, reload } =
        useDWHData();

    const [toOptions, setToOptions] = React.useState<{ value: string; content: string }[]>([]);
    const autoFilledRef = useRef(false);

    useEffect(() => {
        setToOptions(
            locations.map((loc) => ({
                value: loc.toName,
                content: loc.toName,
            })),
        );
    }, [locations]);

    const fillAllFields = (locationData: DWHLocation) => {
        const costCenter =
            locationData.toType === 'TWH' || locationData.toType === 'СЦ'
                ? locationData.costCenterTwh
                : locationData.shortCostCenter;

        setParsed((prev: any) => ({
            ...prev,
            toName: locationData.toName,
            toId: locationData.id,
            toType: locationData.toType,
            address: locationData.address,
            shortCostCenter: costCenter,
            managerName: locationData.managerName,
            managerPhone: locationData.managerPhone,
            employee: locationData.managerName,
            phone: locationData.managerPhone,
        }));
    };

    // Автозаполнение
    useEffect(() => {
        if (locations.length === 0) return;
        if (autoFilledRef.current) return;
        if (parsed.toId) {
            autoFilledRef.current = true;
            return;
        }

        if (parsed.address) {
            const locationData = findLocationByAddress(parsed.address);
            if (locationData) {
                fillAllFields(locationData);
                autoFilledRef.current = true;
                return;
            }
        }

        if (parsed.toName) {
            const locationData = findLocationByToName(parsed.toName);
            if (locationData) {
                fillAllFields(locationData);
                autoFilledRef.current = true;
            }
        }
    }, [locations, parsed.address, parsed.toName, parsed.toId]);

    const handleToChange = (values: string[]) => {
        const selectedToName = values[0] ?? '';
        const locationData = findLocationByToName(selectedToName);

        if (locationData) {
            fillAllFields(locationData);
        } else {
            setParsed((prev: any) => ({ ...prev, toName: selectedToName }));
        }
    };

    if (loading) {
        return (
            <div style={{ padding: 20, textAlign: 'center' }}>
                <Loader size="m" />
                <Text variant="body-2" color="secondary" style={{ marginTop: 8 }}>
                    Загрузка данных из DWH...
                </Text>
            </div>
        );
    }

    if (error) {
        return (
            <div
                style={{
                    padding: 12,
                    backgroundColor: 'var(--g-color-base-danger-light)',
                    borderRadius: 6,
                }}
            >
                <Text variant="body-2" color="danger">
                    {error}
                </Text>
                <Button view="outlined" size="s" onClick={reload} style={{ marginTop: 8 }}>
                    Попробовать снова
                </Button>
            </div>
        );
    }

    return (
        <div>
            {/* Только Название ПВЗ - ТО */}
            <Text variant="subheader-2">Название ПВЗ - ТО</Text>
            <div style={{ marginTop: 8 }}>
                <Select
                    width={370}
                    value={parsed.toName ? [parsed.toName] : []}
                    options={toOptions}
                    onUpdate={handleToChange}
                    placeholder="Выберите ПВЗ / ТО"
                    filterable={true}
                    filterPlaceholder="Введите название для поиска..."
                />
            </div>

            {/* Карточка с данными — показываем если showCard !== false */}
            {showCard && parsed.toId && (
                <div
                    style={{
                        marginTop: 12,
                        padding: 12,
                        backgroundColor: 'var(--g-color-base-misc-light)',
                        borderRadius: 6,
                        border: '1px solid var(--g-color-line-generic)',
                    }}
                >
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        <div>
                            <Text variant="caption-1" color="secondary">
                                ID ТО
                            </Text>
                            <Text variant="body-2">{parsed.toId}</Text>
                        </div>
                        <div>
                            <Text variant="caption-1" color="secondary">
                                Тип ТО
                            </Text>
                            <Text variant="body-2">{parsed.toType || '-'}</Text>
                        </div>
                        <div>
                            <Text variant="caption-1" color="secondary">
                                Кост-центр
                            </Text>
                            <Text variant="body-2">{parsed.shortCostCenter || '-'}</Text>
                        </div>
                        <div>
                            <Text variant="caption-1" color="secondary">
                                Управляющий
                            </Text>
                            <Text variant="body-2">{parsed.managerName || '-'}</Text>
                        </div>
                        <div>
                            <Text variant="caption-1" color="secondary">
                                Телефон
                            </Text>
                            <Text variant="body-2">{parsed.managerPhone || '-'}</Text>
                        </div>
                    </div>
                </div>
            )}

            <div style={{ marginTop: 8 }}>
                <Button view="flat" size="s" onClick={reload}>
                    Обновить список
                </Button>
            </div>
        </div>
    );
};
