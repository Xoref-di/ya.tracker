import React, { useEffect, useState } from 'react';

import { DatePicker } from '@gravity-ui/date-components';
import { dateTimeParse } from '@gravity-ui/date-utils';
import { Button, Select, TextArea, TextInput } from '@gravity-ui/uikit';

import { THEME_ASSETS } from '../../config/themeAssets';
import { useDWHData } from '../../hooks/useDWHData';
import { DWHLocationSelector } from '../DWHLocationSelector';

import { ThemeFormWrapper, type ThemeName } from './themes/ThemeFormWrapper';

type Props = {
    parsed: any;
    setParsed: React.Dispatch<React.SetStateAction<any>>;
    theme?: ThemeName;
};

const REQUEST_TYPES = [
    { value: 'Обслуживание ПК', content: 'Обслуживание ПК' },
    { value: 'Обслуживание РМК(Магазин)', content: 'Обслуживание РМК(Магазин)' },
    { value: 'Обслуживание РММ(Магазин)', content: 'Обслуживание РММ(Магазин)' },
    { value: 'Обслуживание РМ(ПВЗ/ТВХ)', content: 'Обслуживание РМ(ПВЗ/ТВХ)' },
    { value: 'СКС - инцидент', content: 'СКС - инцидент' },
    { value: 'СКС - монтаж', content: 'СКС - монтаж' },
    { value: 'Диагностика сетевого оборудования', content: 'Диагностика сетевого оборудования' },
    {
        value: 'Обслуживание оргтехники(МФУ/А4) - диагностика',
        content: 'Обслуживание оргтехники(МФУ/А4) - диагностика',
    },
    {
        value: 'Обслуживание оргтехники(МФУ/А4) - ремонт',
        content: 'Обслуживание оргтехники(МФУ/А4) - ремонт',
    },
    {
        value: 'Обслуживание принтеров этикеток - диагностика',
        content: 'Обслуживание принтеров этикеток - диагностика',
    },
    {
        value: 'Обслуживание принтеров этикеток - ремонт',
        content: 'Обслуживание принтеров этикеток - ремонт',
    },
    {
        value: 'Обслуживание мобильных принтеров этикеток - диагностика',
        content: 'Обслуживание мобильных принтеров этикеток - диагностика',
    },
    {
        value: 'Обслуживание мобильных принтеров этикеток - ремонт',
        content: 'Обслуживание мобильных принтеров этикеток - ремонт',
    },
    { value: 'Обслуживание ИБП', content: 'Обслуживание ИБП' },
    {
        value: 'Обслуживание ККМ - (диагностика/ремонт)',
        content: 'Обслуживание ККМ - (диагностика/ремонт)',
    },
    { value: 'Обслуживание видеонаблюдения', content: 'Обслуживание видеонаблюдения' },
    { value: 'Обслуживание аудио-оборудования', content: 'Обслуживание аудио-оборудования' },
    { value: 'Обслуживание digital-оборудования', content: 'Обслуживание digital-оборудования' },
    { value: 'Обслуживание счетчиков посетителей', content: 'Обслуживание счетчиков посетителей' },
    { value: 'Дополнительные услуги', content: 'Дополнительные услуги' },
];

const CONTRACTORS = [
    { value: 'Mcore', content: 'Mcore' },
    { value: 'Sodeystvie', content: 'Sodeystvie' },
    { value: 'Dismart', content: 'Dismart' },
    { value: 'Rarus', content: 'Rarus' },
    { value: 'Fonmix', content: 'Fonmix' },
];

const CONTRACTOR_DESCRIPTIONS: Record<string, string> = {
    Mcore: 'Универсальный спектр работ по ТО',
    Sodeystvie: 'Универсальный спектр работ по ТО, заказ расходников для оргтехники',
    Dismart: 'Сопровождение работы Digital-поверхностей в магазинах LaSport',
    Rarus: 'Сопровождение работы счетчиков подсчета посетителей в магазинах LaSport',
    Fonmix: 'Сопровождение работы музыкального оборудования в магазинах LaSport',
};

const NETWORK_REQUEST_TYPE = 'Диагностика сетевого оборудования';

type NetworkRowData = {
    label: string;
    provider: string;
    ip: string;
    gateway: string;
    mask: string;
    dns1: string;
    dns2: string;
};

export function ReplaceItintForm({ parsed, setParsed, theme = 'classic' }: Props) {
    const assets = THEME_ASSETS[theme] ?? THEME_ASSETS.classic;

    const { loadNetworks, networksLoaded, networksLoading, findNetworksByPupId } = useDWHData();

    const [networkRows, setNetworkRows] = useState<NetworkRowData[]>([]);

    const showNetworkBlock = parsed.requestType === NETWORK_REQUEST_TYPE;

    useEffect(() => {
        if (showNetworkBlock && !networksLoaded) {
            loadNetworks();
        }
    }, [showNetworkBlock, networksLoaded, loadNetworks]);

    useEffect(() => {
        if (!showNetworkBlock) {
            setNetworkRows([]);
            return;
        }
        if (!parsed.toId) {
            setNetworkRows([]);
            return;
        }
        if (!networksLoaded) {
            setNetworkRows([]);
            return;
        }

        const nets = findNetworksByPupId(String(parsed.toId));

        setNetworkRows(
            nets.map((net) => ({
                label: net.connectionType || 'Канал',
                provider: net.provider,
                ip: net.ip,
                gateway: net.gate,
                mask: net.mask,
                dns1: net.dns1,
                dns2: net.dns2,
            })),
        );
    }, [showNetworkBlock, parsed.toId, networksLoaded, findNetworksByPupId]);

    const handleCopyToDescription = (row: NetworkRowData) => {
        const lines = [
            `--- ${row.label} ---`,
            `Провайдер: ${row.provider || '—'}`,
            `IP-адрес: ${row.ip || '—'}`,
            `Шлюз: ${row.gateway || '—'}`,
            `Маска: ${row.mask || '—'}`,
            `DNS 1: ${row.dns1 || '—'}`,
            `DNS 2: ${row.dns2 || '—'}`,
            '',
        ];

        const block = lines.join('\n');

        setParsed((prev: any) => {
            const current = (prev.description || '').trimEnd();
            const next = current ? `${current}\n\n${block}` : block;
            return { ...prev, description: next };
        });
    };

    return (
        <ThemeFormWrapper
            theme={theme}
            title="Заявка IT-интегратору"
            headerEmoji={assets.cardHeaderEmoji}
            badge={assets.cardBadge}
            bannerText={assets.banners.itint}
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
            {/* ===== СЕКЦИЯ 1: Основная информация ===== */}
            <div className="theme-card" style={{ marginTop: 0 }}>
                <div className="theme-bg-glow" aria-hidden="true" />

                <div className="theme-header">
                    <span className="theme-header-emoji">{assets.cardHeaderEmoji}</span>
                    <span className="theme-header-title">Основная информация</span>
                    <span className="theme-header-badge">{assets.cardBadge}</span>
                </div>

                {/* Название задачи */}
                <div className="theme-label">
                    <span>Название задачи</span>
                    <span className="theme-required">*</span>
                </div>
                <div className="theme-field">
                    <TextInput
                        value={parsed.summary || ''}
                        onUpdate={(value) =>
                            setParsed((prev: any) => ({ ...prev, summary: value }))
                        }
                        placeholder="Введите название задачи"
                    />
                </div>
                <div className="theme-hint">Кратко о сути заявки</div>

                {/* Тип запроса */}
                <div className="theme-label theme-field-gap">
                    <span>Тип запроса</span>
                    <span className="theme-required">*</span>
                </div>
                <div className="theme-field">
                    <Select
                        value={parsed.requestType ? [parsed.requestType] : []}
                        options={REQUEST_TYPES}
                        onUpdate={(values) =>
                            setParsed((prev: any) => ({
                                ...prev,
                                requestType: values[0] ?? '',
                            }))
                        }
                        placeholder="Выберите тип запроса"
                    />
                </div>
                <div className="theme-hint">Что нужно сделать?</div>

                {/* Плановая дата */}
                <div className="theme-label theme-field-gap">
                    <span>Плановая дата выезда IT-интегратора</span>
                </div>
                <div className="theme-field-date">
                    <DatePicker
                        value={parsed.plannedDate ? dateTimeParse(parsed.plannedDate) : null}
                        onUpdate={(value) =>
                            setParsed((prev: any) => ({
                                ...prev,
                                plannedDate: value ? value.format('YYYY-MM-DD') : '',
                            }))
                        }
                        placeholder="ДД.ММ.ГГГГ"
                        format="DD.MM.YYYY"
                    />
                </div>
                <div className="theme-hint">Когда требуется специалист?</div>
            </div>

            {/* ===== СЕКЦИЯ 2: Данные из DWH ===== */}
            <div className="theme-card">
                <div className="theme-bg-glow" aria-hidden="true" />

                <div className="theme-header">
                    <span className="theme-header-emoji">🔒</span>
                    <span className="theme-header-title">Данные из DWH</span>
                    <span className="theme-header-badge">авто</span>
                </div>

                <div className="theme-full-width" style={{ marginTop: 0 }}>
                    <DWHLocationSelector parsed={parsed} setParsed={setParsed} showCard={false} />
                </div>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr',
                        gap: 16,
                        position: 'relative',
                        zIndex: 3,
                        marginTop: 28,
                    }}
                >
                    <div>
                        <div className="theme-hint" style={{ marginTop: 0 }}>
                            ID ТО
                        </div>
                        <div style={{ marginTop: 4, color: 'var(--theme-text-bright)' }}>
                            {parsed.toId || '—'}
                        </div>
                    </div>

                    <div>
                        <div className="theme-hint" style={{ marginTop: 0 }}>
                            Тип ТО
                        </div>
                        <div style={{ marginTop: 4, color: 'var(--theme-text-bright)' }}>
                            {parsed.toType || '—'}
                        </div>
                    </div>

                    <div>
                        <div className="theme-hint" style={{ marginTop: 0 }}>
                            Короткий кост-центр
                        </div>
                        <div style={{ marginTop: 4, color: 'var(--theme-text-bright)' }}>
                            {parsed.shortCostCenter || '—'}
                        </div>
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                        <div className="theme-hint" style={{ marginTop: 0 }}>
                            Адрес ТО
                        </div>
                        <div style={{ marginTop: 4, color: 'var(--theme-text-bright)' }}>
                            {parsed.address || '—'}
                        </div>
                    </div>

                    <div>
                        <div className="theme-hint" style={{ marginTop: 0 }}>
                            Управляющий ТО
                        </div>
                        <div style={{ marginTop: 4, color: 'var(--theme-text-bright)' }}>
                            {parsed.managerName || '—'}
                        </div>
                    </div>

                    <div>
                        <div className="theme-hint" style={{ marginTop: 0 }}>
                            Телефон управляющего
                        </div>
                        <div style={{ marginTop: 4, color: 'var(--theme-text-bright)' }}>
                            {parsed.managerPhone || '—'}
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== СЕКЦИЯ 3: Исполнитель ===== */}
            <div className="theme-card">
                <div className="theme-bg-glow" aria-hidden="true" />

                <div className="theme-header">
                    <span className="theme-header-emoji">👤</span>
                    <span className="theme-header-title">Исполнитель</span>
                    <span className="theme-header-badge">{assets.cardBadge}</span>
                </div>

                <div className="theme-grid">
                    <div>
                        <div className="theme-label">
                            <span>Подрядчик</span>
                        </div>
                        <div className="theme-field">
                            <Select
                                value={parsed.contractor ? [parsed.contractor] : []}
                                options={CONTRACTORS}
                                onUpdate={(values) =>
                                    setParsed((prev: any) => ({
                                        ...prev,
                                        contractor: values[0] ?? '',
                                    }))
                                }
                                placeholder="Выберите подрядчика"
                            />
                        </div>
                    </div>
                </div>

                <div
                    style={{
                        marginTop: 16,
                        padding: 12,
                        backgroundColor: 'var(--theme-field-bg)',
                        borderRadius: 10,
                        border: '1.5px solid var(--theme-field-border)',
                        width: '100%',
                        boxSizing: 'border-box',
                        position: 'relative',
                        zIndex: 3,
                    }}
                >
                    <div
                        className="theme-hint"
                        style={{ marginTop: 0, marginBottom: 8, display: 'block' }}
                    >
                        Расшифровка:
                    </div>
                    {CONTRACTORS.map((c) => (
                        <div key={c.value} style={{ marginBottom: 6 }}>
                            <span
                                style={{
                                    fontWeight: 700,
                                    color: 'var(--theme-accent)',
                                    fontSize: 12,
                                }}
                            >
                                {c.content}
                            </span>
                            <span
                                style={{
                                    color: 'var(--theme-hint)',
                                    fontSize: 12,
                                    fontStyle: 'italic',
                                }}
                            >
                                {' — '}
                                {CONTRACTOR_DESCRIPTIONS[c.value]}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ===== СЕКЦИЯ 3.5: Сетевые параметры ===== */}
            {showNetworkBlock && (
                <div className="theme-card">
                    <div className="theme-bg-glow" aria-hidden="true" />

                    <div className="theme-header">
                        <span className="theme-header-emoji">🌐</span>
                        <span className="theme-header-title">Сетевые параметры</span>
                        <span className="theme-header-badge">из DWH</span>
                    </div>

                    {!parsed.toId && (
                        <div className="theme-hint" style={{ marginTop: 0 }}>
                            Сначала выберите название ПВЗ в разделе «Данные из DWH»
                        </div>
                    )}

                    {parsed.toId && networksLoading && (
                        <div className="theme-hint" style={{ marginTop: 0 }}>
                            Загружаем сетевые параметры…
                        </div>
                    )}

                    {parsed.toId && networksLoaded && networkRows.length === 0 && (
                        <div className="theme-hint" style={{ marginTop: 0 }}>
                            По этому ПВЗ сетевые параметры не найдены
                        </div>
                    )}

                    {networkRows.length > 0 && (
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: 20,
                                position: 'relative',
                                zIndex: 3,
                            }}
                        >
                            {networkRows.map((row, idx) => (
                                <div
                                    key={`${row.label}-${idx}`}
                                    style={{
                                        padding: 16,
                                        borderRadius: 12,
                                        background: 'var(--theme-field-bg)',
                                        border: '1.5px solid var(--theme-field-border)',
                                    }}
                                >
                                    <div className="theme-label" style={{ marginBottom: 12 }}>
                                        <span>{row.label}</span>
                                    </div>

                                    <NetworkRow label="Провайдер" value={row.provider} />
                                    <NetworkRow label="IP-адрес" value={row.ip} />
                                    <NetworkRow label="Шлюз" value={row.gateway} />
                                    <NetworkRow label="Маска" value={row.mask} />
                                    <NetworkRow label="DNS 1" value={row.dns1} />
                                    <NetworkRow label="DNS 2" value={row.dns2} />

                                    <div style={{ marginTop: 16 }}>
                                        <Button
                                            view="action"
                                            size="m"
                                            onClick={() => handleCopyToDescription(row)}
                                        >
                                            📋 Скопировать в описание
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ===== СЕКЦИЯ 4: Описание ===== */}
            <div className="theme-card">
                <div className="theme-bg-glow" aria-hidden="true" />

                <div className="theme-header">
                    <span className="theme-header-emoji">📝</span>
                    <span className="theme-header-title">Описание</span>
                    <span className="theme-header-badge">{assets.cardBadge}</span>
                </div>

                <div className="theme-field">
                    <TextArea
                        minRows={6}
                        value={parsed.description || ''}
                        onUpdate={(value) =>
                            setParsed((prev: any) => ({ ...prev, description: value }))
                        }
                        placeholder="План необходимых для проведения работ или описание неисправности оборудования."
                    />
                </div>
            </div>
        </ThemeFormWrapper>
    );
}

// ===== Вспомогательный компонент строки сетевых данных =====
function NetworkRow({ label, value }: { label: string; value?: string }) {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 8,
                marginBottom: 6,
                fontSize: 12,
            }}
        >
            <span
                style={{
                    color: 'var(--theme-hint)',
                    minWidth: 90,
                    fontStyle: 'italic',
                }}
            >
                {label}:
            </span>
            <span
                style={{
                    color: 'var(--theme-text-bright)',
                    fontWeight: 600,
                    wordBreak: 'break-all',
                }}
            >
                {value || '—'}
            </span>
        </div>
    );
}
