// src/config/themeAssets.ts
import { type ThemeName } from '../hooks/useTheme';

export type FormKey = 'tsd' | 'pc' | 'shk' | 'printer' | 'net' | 'itint' | 'onessup';

export type ThemeAssets = {
    // Заголовки и баннер
    bannerEmoji: string;
    bannerText: string;
    bannerRight: string;

    // ✅ Фразы для каждой формы
    banners: Record<FormKey, string>;

    // Эмодзи заголовков секций
    cardHeaderEmoji: string;
    cardBadge: string;

    // Эмодзи меток
    labelEquipment: string;
    labelModel: string;
    labelSn: string;
    labelLocation: string;
    labelEmployee: string;
    labelPhone: string;
    labelAddress: string;
    labelDescription: string;

    // Декор (падающие элементы)
    decor: { char: string }[];
};

export const THEME_ASSETS: Record<ThemeName, ThemeAssets> = {
    classic: {
        bannerEmoji: '📋',
        bannerText: 'Создание связанной задачи',
        bannerRight: '',
        banners: {
            tsd: 'Заполните форму замены ТСД или смартфона',
            pc: 'Заполните форму замены компьютера',
            shk: 'Заполните форму замены СШК или терминала',
            printer: 'Заполните форму замены принтера',
            net: 'Заполните форму замены сетевого оборудования',
            itint: 'Создание заявки IT-интегратору',
            onessup: 'Создание задачи',
        },
        cardHeaderEmoji: '📄',
        cardBadge: 'Раздел',
        labelEquipment: '▪',
        labelModel: '▪',
        labelSn: '▪',
        labelLocation: '▪',
        labelEmployee: '▪',
        labelPhone: '▪',
        labelAddress: '▪',
        labelDescription: '▪',
        decor: [],
    },
    autumn: {
        bannerEmoji: '🍁',
        bannerText: 'Уютной осени! Заполни форму — и всё будет отлично',
        bannerRight: '🍂 · 🍃 · 🍂',
        banners: {
            tsd: 'Я запутался. Даже не то, чтобы запутался, я ничего не понял. 🧡',
            pc: 'Как много вопросов и как мало ответов 🧡',
            shk: 'Правду о себе знаем только мы сами 🧡',
            printer: 'Иногда надо принимать решения и не оглядываться назад 🧡',
            net: 'Не всегда жизнь напоминает сказку, но надо же во что-то верить 🧡',
            itint: 'С первым осенним холодком жизнь начнется сначала 🧡',
            onessup: 'Иногда надо просто заполнить форму и идти дальше 🧡',
        },
        cardHeaderEmoji: '🍁',
        cardBadge: 'Глава I',
        labelEquipment: '🌰',
        labelModel: '🌾',
        labelSn: '🔖',
        labelLocation: '📍',
        labelEmployee: '🧑‍🦱',
        labelPhone: '📞',
        labelAddress: '📦',
        labelDescription: '📝',
        decor: [{ char: '🍂' }, { char: '🍁' }, { char: '🍃' }],
    },
    winter: {
        bannerEmoji: '❄️',
        bannerText: 'Зимний вечер — самое время для заявки',
        bannerRight: '❄ · ❅ · ❄',
        banners: {
            tsd: 'Холод снаружи — тепло в заявке ❄️',
            pc: 'Зимой даже компьютеры хотят немного тепла ❄️',
            shk: 'Мороз не помеха — заполните форму ❄️',
            printer: 'Пусть работает — как часы под Новый год ❄️',
            net: 'Холодные провода — тёплое отношение ❄️',
            itint: 'Зимняя заявка — залог весеннего порядка ❄️',
            onessup: 'Задача ясна — приступаем ❄️',
        },
        cardHeaderEmoji: '❄️',
        cardBadge: 'Глава I',
        labelEquipment: '⛄',
        labelModel: '🧊',
        labelSn: '🏷️',
        labelLocation: '🗺️',
        labelEmployee: '🧑‍🦱',
        labelPhone: '📞',
        labelAddress: '📦',
        labelDescription: '📝',
        decor: [{ char: '❄️' }, { char: '❅' }, { char: '❆' }],
    },
    spring: {
        bannerEmoji: '🌸',
        bannerText: 'Весеннее настроение! Заполни форму',
        bannerRight: '🌸 · 🌷 · 🌸',
        banners: {
            tsd: 'Всё расцветает — и техника тоже 🌸',
            pc: 'Свежий старт — свежий взгляд 🌸',
            shk: 'Весеннее обновление — и оборудованию 🌸',
            printer: 'Пусть печатается так же легко, как дышится весной 🌸',
            net: 'Всё течёт — и сеть тоже 🌸',
            itint: 'Заявка — первый шаг к порядку 🌸',
            onessup: 'Новые задачи — новые идеи 🌸',
        },
        cardHeaderEmoji: '🌸',
        cardBadge: 'Глава I',
        labelEquipment: '🌷',
        labelModel: '🌱',
        labelSn: '🔖',
        labelLocation: '🌍',
        labelEmployee: '🧑‍🦱',
        labelPhone: '📞',
        labelAddress: '📦',
        labelDescription: '📝',
        decor: [{ char: '🌸' }, { char: '🌷' }, { char: '🌺' }],
    },
    summer: {
        bannerEmoji: '☀️',
        bannerText: 'Летний денёк! Заполни форму',
        bannerRight: '🌊 · ☀️ · 🌴',
        banners: {
            tsd: 'Жара не помеха — работаем ☀️',
            pc: 'Даже компьютерам нужен отпуск ☀️',
            shk: 'Солнце светит — техника работает ☀️',
            printer: 'Печатаем — и не паримся ☀️',
            net: 'Всё в сети — и мы тоже ☀️',
            itint: 'Летняя заявка — лёгкая, как бриз ☀️',
            onessup: 'Поработаем — и отдохнём ☀️',
        },
        cardHeaderEmoji: '☀️',
        cardBadge: 'Глава I',
        labelEquipment: '🌴',
        labelModel: '🌊',
        labelSn: '🔖',
        labelLocation: '🏝️',
        labelEmployee: '🧑‍🦱',
        labelPhone: '📞',
        labelAddress: '📦',
        labelDescription: '📝',
        decor: [{ char: '☀️' }, { char: '🌊' }, { char: '🌴' }],
    },
    cyberpunk: {
        bannerEmoji: '⚡',
        bannerText: 'SYSTEM ONLINE — заполните форму запроса',
        bannerRight: '[ICE-01]',
        banners: {
            tsd: '[ICE-01] // SCANNER MALFUNCTION — REPLACE',
            pc: '[ICE-02] // CPU FAILURE — REPLACE',
            shk: '[ICE-03] // BARCODE SYSTEM — REPAIR',
            printer: '[ICE-04] // PRINT NODE — FIX',
            net: '[ICE-05] // NETWORK DOWN — RESTORE',
            itint: '[ICE-06] // INTEGRATOR REQUEST',
            onessup: '[ICE-07] // SUPPORT TASK',
        },
        cardHeaderEmoji: '⚡',
        cardBadge: '// SECTOR',
        labelEquipment: '▸',
        labelModel: '▸',
        labelSn: '▸',
        labelLocation: '▸',
        labelEmployee: '▸',
        labelPhone: '▸',
        labelAddress: '▸',
        labelDescription: '▸',
        decor: [{ char: '✦' }, { char: '✧' }],
    },
    naruto: {
        bannerEmoji: '🍥',
        bannerText: 'Миссия ранга A — заполни свиток',
        bannerRight: '🍥 · 🌀 · 🍥',
        banners: {
            tsd: 'Кланы ТСД в беде — составь свиток 🍥',
            pc: 'Скрытая деревня ждёт помощи 🍥',
            shk: 'Шпион ранен — нужен лекарь 🍥',
            printer: 'Свиток порвался — починим 🍥',
            net: 'Связь с деревней прервана 🍥',
            itint: 'Миссия IT-интегратора 🍥',
            onessup: 'Задание от Хокаге 🍥',
        },
        cardHeaderEmoji: '🍥',
        cardBadge: 'Свиток',
        labelEquipment: '⚔️',
        labelModel: '🌀',
        labelSn: '📜',
        labelLocation: '🗺️',
        labelEmployee: '🥷',
        labelPhone: '📞',
        labelAddress: '🏯',
        labelDescription: '📝',
        decor: [{ char: '🍥' }, { char: '🍃' }, { char: '🌀' }],
    },
};
