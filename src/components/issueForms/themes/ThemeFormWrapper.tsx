import React from 'react';

import './theme-form.scss';

export type ThemeName =
    'classic' | 'autumn' | 'winter' | 'spring' | 'summer' | 'cyberpunk' | 'naruto';

type Props = {
    theme?: ThemeName;
    title?: string;
    headerEmoji?: string;
    badge?: string;
    bannerText?: string;
    bannerEmoji?: string;
    bannerRight?: string;
    // Декор: что падает с неба (листья, лепестки, звёзды)
    decor?: {
        char: string;
        left: string;
        delay: string;
        duration: string;
        size?: number;
    }[];
    children: React.ReactNode;
};

export function ThemeFormWrapper({
    theme = 'classic',
    title = 'Оборудование',
    headerEmoji = '📄',
    badge = 'Раздел',
    bannerText = 'Создание связанной задачи',
    bannerEmoji = '📋',
    bannerRight = '',
    decor = [],
    children,
}: Props) {
    return (
        <div className="theme-form" data-theme={theme}>
            {/* Баннер */}
            <div className="theme-banner">
                <span className="theme-banner-emoji">{bannerEmoji}</span>
                <span style={{ whiteSpace: 'pre-line' }}>{bannerText}</span>
                {bannerRight && <span className="theme-banner-right">{bannerRight}</span>}
            </div>

            {/* Декор (падающие элементы) — только если передан */}
            {decor.length > 0 && (
                <div className="theme-decor" aria-hidden="true">
                    {decor.map((item, i) => (
                        <span
                            key={i}
                            className="theme-decor-item"
                            style={
                                {
                                    left: item.left,
                                    fontSize: item.size ?? 16,
                                    '--decor-delay': item.delay,
                                    '--decor-duration': item.duration,
                                } as React.CSSProperties
                            }
                        >
                            {item.char}
                        </span>
                    ))}
                </div>
            )}

            {/* Карточка */}
            <div className="theme-card">
                <div className="theme-bg-glow" aria-hidden="true" />

                <div className="theme-header">
                    <span className="theme-header-emoji">{headerEmoji}</span>
                    <span className="theme-header-title">{title}</span>
                    <span className="theme-header-badge">{badge}</span>
                </div>

                {children}
            </div>
        </div>
    );
}
