// src/hooks/useTheme.ts
import { useEffect, useState } from 'react';

export type ThemeName =
    'classic' | 'autumn' | 'winter' | 'spring' | 'summer' | 'cyberpunk' | 'naruto';

const STORAGE_KEY = 'issue-plugin-theme';
const DEFAULT_THEME: ThemeName = 'classic';

const VALID_THEMES: ThemeName[] = [
    'classic',
    'autumn',
    'winter',
    'spring',
    'summer',
    'cyberpunk',
    'naruto',
];

function readStoredTheme(): ThemeName {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored && VALID_THEMES.includes(stored as ThemeName)) {
            return stored as ThemeName;
        }
    } catch (e) {
        console.warn('Не удалось прочитать тему из localStorage:', e);
    }
    return DEFAULT_THEME;
}

export function useTheme() {
    const [theme, setThemeState] = useState<ThemeName>(() => readStoredTheme());

    // Слушаем изменения в localStorage из других вкладок/окон
    useEffect(() => {
        const handleStorage = (e: StorageEvent) => {
            if (e.key === STORAGE_KEY && e.newValue) {
                if (VALID_THEMES.includes(e.newValue as ThemeName)) {
                    setThemeState(e.newValue as ThemeName);
                }
            }
        };

        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const setTheme = (newTheme: ThemeName) => {
        setThemeState(newTheme);
        try {
            localStorage.setItem(STORAGE_KEY, newTheme);
        } catch (e) {
            console.warn('Не удалось сохранить тему в localStorage:', e);
        }
    };

    return { theme, setTheme };
}
