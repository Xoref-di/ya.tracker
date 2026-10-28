export interface ParsedDescription {
    employee?: string;
    location?: string;
    address?: string;
    phone?: string;
    serialNumber?: string;
    equipmentModel?: string;
    equipmentType?: string;
    equipmentName?: string;
    problem?: string;
    locationType?: string; // Офлайн магазин Lasport -> Shop
    snDevice?: string; // S/N устройства
    printerModel?: string; // Модель принтера*
    tradeObjectAddress?: string; // Адрес торгового объекта*
    contactPerson?: string; // ФИО контактного лица*
    contactPhone?: string; // Контактный телефон*
    storeTitle?: string; // RU_MOSCOW_OkhotnyRyad_URBAN
    toName?: string;
    toId?: string;
    toType?: string;
    shortCostCenter?: string;
    managerName?: string;
    managerPhone?: string;
    contractor?: string;
    plannedDate?: string;
    requestType?: string;
    summary?: string;
}

/**
 * Извлекает значение поля из текста описания.
 * Поддерживает метки с экранированной звёздочкой (Наименование магазина\*:),
 * с обычной звёздочкой (Наименование магазина*:) и без неё.
 */
function getValue(text: string, label: string): string | undefined {
    // Чистим метку от обратных слэшей: "Наименование магазина\*" → "Наименование магазина*"
    const cleanedLabel = label.replace(/\\/g, '');

    // Экранируем спецсимволы для regexp
    const escaped = cleanedLabel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Ищем: "Label:" → захватываем всё до:
    //   - пустой строки (\n\n)
    //   - следующей строки с "Что-то:"
    //   - конца текста
    const regexp = new RegExp(`${escaped}:\\s*([\\s\\S]*?)(?=\\n\\s*\\n|\\n[^\\n]*:|$)`, 'i');

    const match = text.match(regexp);

    return match?.[1].trim();
}

// Проверка: значение похоже на технический title магазина
// Примеры: RU_MOSCOW_OkhotnyRyad_URBAN, RU_SPB_Nevsky_SPORT
function looksLikeStoreTitle(value?: string): boolean {
    if (!value) return false;

    const trimmed = value.trim();

    return /^RU_[A-Za-z0-9_]+$/.test(trimmed);
}

export function parseDescription(description: string): ParsedDescription {
    const normalized = description
        .replace(/\\\*/g, '*')
        .replace(/\\/g, '')
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .replace(/\u00A0/g, ' ');

    // 1. Название магазина / торгового объекта (технический title)
    // БЕЗ 'Заголовок' — это тема задачи, а не магазин
    const storeTitle =
        getValue(normalized, 'Наименование магазина*') ||
        getValue(normalized, 'Наименование магазина') ||
        getValue(normalized, 'Название торгового объекта*') ||
        getValue(normalized, 'Название торгового объекта');

    // 2. Адрес: явный или из "Название торгового объекта"
    const rawAddress =
        getValue(normalized, 'Укажите адрес') ||
        getValue(normalized, 'Адрес торгового объекта*') ||
        getValue(normalized, 'Адрес торгового объекта');

    let address = rawAddress;
    let finalStoreTitle = storeTitle;

    // Если в rawAddress лежит RU_... — переносим в storeTitle
    if (rawAddress && looksLikeStoreTitle(rawAddress)) {
        address = undefined;
        finalStoreTitle = finalStoreTitle || rawAddress;
    }

    // Если адреса нет, а "Название торгового объекта" — НЕ RU_...,
    // используем его как адрес (человекочитаемый адрес магазина)
    if (!address && storeTitle && !looksLikeStoreTitle(storeTitle)) {
        address = storeTitle;
    }

    if (finalStoreTitle) {
        finalStoreTitle = finalStoreTitle.trim();
    }

    // 3. Контактные поля с фоллбэками
    const contactPerson =
        getValue(normalized, 'ФИО контактного лица*') ||
        getValue(normalized, 'ФИО контактного лица');

    const contactPhone =
        getValue(normalized, 'Контактный телефон*') || getValue(normalized, 'Контактный телефон');

    return {
        employee:
            getValue(
                normalized,
                'ФИО сотрудника или логин учётной записи у которого возникла проблема',
            ) ||
            getValue(normalized, 'ФИО управляющего ТО') ||
            contactPerson,

        contactPerson,

        location: (() => {
            const equipmentLocation =
                getValue(normalized, 'Локация оборудования') ||
                getValue(normalized, 'Локация') ||
                '';

            return equipmentLocation === 'Офлайн магазин Lasport' ? 'LaSport' : equipmentLocation;
        })(),

        address,

        phone:
            getValue(normalized, 'Контактный номер телефона') ||
            getValue(normalized, 'Телефон управляющего ТО') ||
            contactPhone,

        contactPhone,

        serialNumber:
            getValue(normalized, 'Серийный номер') ||
            getValue(normalized, 'S/N устройства') ||
            getValue(normalized, 'S/N (серийный номер) принтера') ||
            getValue(normalized, 'Sn первой') ||
            getValue(normalized, 'Sn второй'),

        equipmentType:
            getValue(normalized, 'Тип оборудования') ||
            getValue(normalized, 'Типы оборудования, с которым возникла проблема'),

        problem: getValue(normalized, 'Описание проблемы') || getValue(normalized, 'Описание*'),

        equipmentModel:
            getValue(normalized, 'Модель ТСД') ||
            getValue(normalized, 'Модель смартфона') ||
            getValue(normalized, 'Модель термопринтера') ||
            getValue(normalized, 'Модель принтера*') ||
            getValue(normalized, 'Модель СШК') ||
            getValue(normalized, 'Модель ПК'),

        equipmentName: getValue(normalized, 'Имя термопринтера'),

        toName: getValue(normalized, 'Название ПВЗ - ТО') || finalStoreTitle,

        toId: getValue(normalized, 'ID ТО'),
        toType: getValue(normalized, 'Тип ТО'),
        shortCostCenter: getValue(normalized, 'Короткий кост-центр'),
        managerName: getValue(normalized, 'ФИО управляющего ТО'),
        managerPhone: getValue(normalized, 'Телефон управляющего ТО'),
        contractor: getValue(normalized, 'Подрядчик'),
        plannedDate: getValue(normalized, 'Плановая дата выезда IT-интегратора'),
        locationType: getValue(normalized, 'Локация оборудования'),
        storeTitle: finalStoreTitle,
        tradeObjectAddress: getValue(normalized, 'Адрес торгового объекта*'),
    };
}
