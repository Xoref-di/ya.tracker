import React from 'react';

import { TextArea, TextInput } from '@gravity-ui/uikit';

import { THEME_ASSETS } from '../../config/themeAssets';

import { ThemeFormWrapper, type ThemeName } from './themes/ThemeFormWrapper';

type Props = {
    parsed: {
        summary: string;
        description: string;
        employee: string;
        location: string;
        address: string;
        phone: string;
        serialNumber: string;
        equipmentType: string;
        equipmentModel: string;
        equipmentName: string;
        problem: string;
        [key: string]: any;
    };
    setParsed: React.Dispatch<React.SetStateAction<any>>;
    theme?: ThemeName;
};

export function ReplaceOnessupForm({ parsed, setParsed, theme = 'classic' }: Props) {
    const assets = THEME_ASSETS[theme] ?? THEME_ASSETS.classic;

    return (
        <ThemeFormWrapper
            theme={theme}
            title="Задача"
            headerEmoji={assets.cardHeaderEmoji}
            badge={assets.cardBadge}
            bannerText={assets.banners.onessup}
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
            <div className="theme-label">
                <span>Название задачи</span>
                <span className="theme-required">*</span>
            </div>
            <div className="theme-field">
                <TextInput
                    value={parsed.summary || ''}
                    onUpdate={(value) => setParsed((prev: any) => ({ ...prev, summary: value }))}
                    placeholder="Введите название задачи"
                />
            </div>
            <div className="theme-hint">Кратко о сути задачи</div>

            <div className="theme-label theme-field-gap">
                <span>Описание</span>
                <span className="theme-required">*</span>
            </div>
            <div className="theme-field">
                <TextArea
                    minRows={8}
                    value={parsed.description || ''}
                    onUpdate={(value) =>
                        setParsed((prev: any) => ({ ...prev, description: value }))
                    }
                    placeholder="Опишите задачу"
                />
            </div>
            <div className="theme-hint">Чем подробнее, тем лучше</div>
        </ThemeFormWrapper>
    );
}
