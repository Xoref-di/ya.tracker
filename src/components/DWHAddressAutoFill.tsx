// src/components/DWHAddressAutoFill.tsx
import { useEffect } from 'react';

import { useDWHData } from '../hooks/useDWHData';

interface Props {
    parsed: any;
    setParsed: React.Dispatch<React.SetStateAction<any>>;
}

export const DWHAddressAutoFill = ({ parsed, setParsed }: Props) => {
    const { locations, findLocationByAddress } = useDWHData();

    useEffect(() => {
        // Ждём загрузки данных из DWH
        if (locations.length === 0) return;
        // Если адрес не заполнен — ничего не делаем
        if (!parsed.address) return;

        // Ищем локацию по адресу
        const locationData = findLocationByAddress(parsed.address);
        if (!locationData) return;

        // Определяем, откуда брать ФИО и телефон
        const isLaSport = locationData.toType === 'LaSport';

        const managerName = isLaSport ? locationData.storeManagerName : locationData.managerName;

        const managerPhone = isLaSport ? locationData.storeManagerPhone : locationData.managerPhone;

        // Подставляем в parsed, только если поля пустые
        // (чтобы не перезаписывать то, что ввёл пользователь вручную)
        setParsed((prev: any) => {
            const updates: any = {};
            if (!prev.employee && managerName) updates.employee = managerName;
            if (!prev.phone && managerPhone) updates.phone = managerPhone;
            return { ...prev, ...updates };
        });
    }, [locations, parsed.address]);

    return null; // компонент ничего не рендерит
};
