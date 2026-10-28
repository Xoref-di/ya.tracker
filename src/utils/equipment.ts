// src/utils/equipment.ts
export function getEquipmentName(type: string): string {
    const map: Record<string, string> = {
        Термопринтер: 'Принтер этикеток',
        СШК: 'Сканер штрих‑кода',
        ПВЗ: 'Пункт выдачи заказов',
    };
    return map[type] ?? type; // fallback на сам тип, если нет маппинга
}
