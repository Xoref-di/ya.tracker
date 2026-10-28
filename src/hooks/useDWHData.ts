// src/hooks/useDWHData.ts
import { useCallback, useEffect, useState } from 'react';

import dwhLocationsRaw from '../data/dwhLocations.json';
import dwhNetworksRaw from '../data/dwhNetworks.json';

export interface DWHLocation {
    id: string;
    toName: string;
    address: string;
    shortCostCenter: string;
    costCenterTwh: string;
    managerName: string;
    managerPhone: string;
    storeManagerName: string;
    storeManagerPhone: string;
    storeManagerEmail: string;
    toType: string;
}

export interface DWHNetwork {
    pupKeyId: string;
    provider: string;
    ip: string;
    mask: string;
    gate: string;
    dns1: string;
    dns2: string;
    connectionType: string;
}

// Утилита: достать массив из обёртки { result: [...] } или из массива
function extractArray(rawData: unknown): Record<string, unknown>[] {
    if (Array.isArray(rawData)) return rawData;
    if (rawData && typeof rawData === 'object') {
        const firstKey = Object.keys(rawData)[0];
        if (firstKey) {
            const value = (rawData as Record<string, unknown>)[firstKey];
            if (Array.isArray(value)) return value;
        }
    }
    return [];
}

export const useDWHData = () => {
    // ============================================
    // ЛОКАЦИИ
    // ============================================
    const [locations, setLocations] = useState<DWHLocation[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ============================================
    // СЕТИ (ленивая загрузка)
    // ============================================
    const [networks, setNetworks] = useState<DWHNetwork[]>([]);
    const [networksLoaded, setNetworksLoaded] = useState(false);
    const [networksLoading, setNetworksLoading] = useState(false);

    // ============================================
    // Загрузка локаций (при монтировании)
    // ============================================
    const loadData = () => {
        setLoading(true);
        setError(null);

        try {
            const data = extractArray(dwhLocationsRaw);

            // ДЕДУБЛИКАЦИЯ по PUP_KEY_ID + ADDRESS
            const uniqueMap = new Map<string, Record<string, unknown>>();
            data.forEach((row) => {
                const key = `${row.PUP_KEY_ID}_${row.ADDRESS}`;
                if (!uniqueMap.has(key)) {
                    uniqueMap.set(key, row);
                }
            });

            const uniqueData = Array.from(uniqueMap.values());
            console.info('📦 Загружено записей:', data.length, '| Уникальных:', uniqueData.length);

            const mappedData = uniqueData.map((row) => {
                const toType = String(row.PUP_TYPE || '');
                const isStore = toType === 'Store' || toType === 'LaSport';

                return {
                    id: String(row.PUP_KEY_ID || ''),
                    toName: String(row.PUP_TITLE || ''),
                    address: String(row.ADDRESS || ''),
                    shortCostCenter: isStore
                        ? String(row.COST_CENTER || '')
                        : String(row.LEVEL1_NAME || ''),
                    costCenterTwh: String(row.COST_CENTER_TWH || ''),
                    managerName: isStore
                        ? String(row.STORE_MANAGER || '')
                        : String(row.EXECUTIVE_OF_PUP || ''),
                    managerPhone: isStore
                        ? String(row.STORE_MANAGER_PHONE || '')
                        : String(row.EXECUTIVE_PHONE_NUMBER || ''),
                    storeManagerName: String(row.STORE_MANAGER || ''),
                    storeManagerPhone: String(row.STORE_MANAGER_PHONE || ''),
                    storeManagerEmail: String(row.STORE_MANAGER_EMAIL || ''),
                    toType,
                };
            });

            setLocations(mappedData);
        } catch (err) {
            setError('Ошибка загрузки данных из DWH');
            console.error('DWH Error:', err);
        } finally {
            setLoading(false);
        }
    };

    // ============================================
    // Загрузка сетей — вызывается вручную, один раз
    // ============================================
    const loadNetworks = useCallback(() => {
        if (networksLoaded || networksLoading) return;

        setNetworksLoading(true);
        try {
            const data = extractArray(dwhNetworksRaw);

            const mapped: DWHNetwork[] = data.map((row) => ({
                pupKeyId: String(row.PUP_KEY_ID || ''),
                provider: String(row.INTERNET_PROVIDER || ''),
                ip: String(row.IP_ADDRESS || ''),
                mask: String(row.MASK || ''),
                gate: String(row.GATE || ''),
                dns1: String(row.DNS1 || ''),
                dns2: String(row.DNS2 || ''),
                connectionType: String(row.CONNECTION_TYPE || ''),
            }));

            console.info('🌐 Загружено сетевых подключений:', mapped.length);

            setNetworks(mapped);
            setNetworksLoaded(true);
        } catch (err) {
            console.error('DWH Networks Error:', err);
        } finally {
            setNetworksLoading(false);
        }
    }, [networksLoaded, networksLoading]);

    // ============================================
    // ПОИСК ПО ЛОКАЦИЯМ
    // ============================================

    const findLocationByTitle = (title: string): DWHLocation | undefined => {
        if (!title) return undefined;

        const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim();

        const normalized = normalize(title);

        let found = locations.find((loc) => normalize(loc.toName) === normalized);
        if (found) return found;

        found = locations.find((loc) => normalize(loc.toName).startsWith(normalized));
        if (found) return found;

        found = locations.find((loc) => normalized.startsWith(normalize(loc.toName)));

        return found;
    };

    const findLocationByToName = (toName: string): DWHLocation | undefined => {
        return locations.find(
            (loc) => loc.toName.toLowerCase().trim() === toName.toLowerCase().trim(),
        );
    };

    const findLocationByAddress = (address: string): DWHLocation | undefined => {
        if (!address) return undefined;

        const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim();

        const normalized = normalize(address);

        let found = locations.find((loc) => normalize(loc.address) === normalized);
        if (found) return found;

        const shortAddress = normalized.slice(0, 100);
        found = locations.find((loc) => normalize(loc.address).startsWith(shortAddress));

        return found;
    };

    const findLocationById = (id: string): DWHLocation | undefined => {
        return locations.find((loc) => loc.id === String(id));
    };

    // ============================================
    // ПОИСК ПО СЕТЯМ
    // ============================================

    const findNetworksByPupId = useCallback(
        (pupKeyId: string): DWHNetwork[] => {
            const id = String(pupKeyId);
            return networks.filter((n) => n.pupKeyId === id);
        },
        [networks],
    );

    // ============================================
    // Инициализация
    // ============================================
    useEffect(() => {
        loadData();
    }, []);

    return {
        locations,
        loading,
        error,
        findLocationByToName,
        findLocationByTitle,
        findLocationByAddress,
        findLocationById,
        reload: loadData,

        networks,
        networksLoaded,
        networksLoading,
        loadNetworks,
        findNetworksByPupId,
    };
};
