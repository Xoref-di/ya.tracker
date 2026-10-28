// src/components/ThemeSwitcher.tsx
import { useEffect, useRef, useState } from 'react';

import { type ThemeName } from '../hooks/useTheme';

const THEME_OPTIONS: { value: ThemeName; label: string; emoji: string }[] = [
    { value: 'classic', label: 'Классика', emoji: '📄' },
    { value: 'autumn', label: 'Осень', emoji: '🍁' },
    { value: 'winter', label: 'Зима', emoji: '❄️' },
    { value: 'spring', label: 'Весна', emoji: '🌸' },
    { value: 'summer', label: 'Лето', emoji: '☀️' },
    { value: 'cyberpunk', label: 'Киберпанк', emoji: '⚡' },
    { value: 'naruto', label: 'Наруто', emoji: '🍥' },
];

type Props = {
    theme: ThemeName;
    onThemeChange: (theme: ThemeName) => void;
};

export function ThemeSwitcher({ theme, onThemeChange }: Props) {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Закрытие при клике вне
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Закрытие по Escape
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, []);

    const current = THEME_OPTIONS.find((o) => o.value === theme) ?? THEME_OPTIONS[0];

    return (
        <div ref={wrapperRef} style={{ position: 'relative', display: 'inline-block' }}>
            {/* Кнопка: эмодзи + название стиля + стрелка */}
            <button
                type="button"
                className="theme-switcher-btn"
                onClick={() => setOpen((v) => !v)}
                title="Сменить стиль"
            >
                <span style={{ fontSize: 14 }}>{current.emoji}</span>
                <span>{current.label}</span>
                <span className={`theme-switcher-arrow ${open ? 'is-open' : ''}`}>▼</span>
            </button>

            {/* Выпадающий список */}
            {open && (
                <div className="theme-switcher-menu">
                    {THEME_OPTIONS.map((opt) => {
                        const isActive = opt.value === theme;
                        return (
                            <button
                                key={opt.value}
                                type="button"
                                className={`theme-switcher-item ${isActive ? 'is-active' : ''}`}
                                onClick={() => {
                                    onThemeChange(opt.value);
                                    setOpen(false);
                                }}
                            >
                                <span style={{ fontSize: 14 }}>{opt.emoji}</span>
                                <span>{opt.label}</span>
                                {isActive && (
                                    <span
                                        style={{
                                            marginLeft: 'auto',
                                            fontSize: 12,
                                            color: 'var(--g-color-text-brand)',
                                        }}
                                    >
                                        ✓
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
