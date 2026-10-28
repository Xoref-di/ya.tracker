import { useEffect, useState } from 'react';

import { Button, Select, Text, TextArea, TextInput, ThemeProvider } from '@gravity-ui/uikit';
import { trackerApi, useTrackerPluginContext } from '@weavix/tracker-plugin-sdk-react';

import { ThemeSwitcher } from './components/ThemeSwitcher';
import { ReplaceItintForm } from './components/issueForms/ReplaceItintForm';
import { ReplaceNetForm } from './components/issueForms/ReplaceNetForm';
import { ReplaceOnessupForm } from './components/issueForms/ReplaceOnessupForm';
import { ReplacePCForm } from './components/issueForms/ReplacePCForm';
import { ReplacePrinterForm } from './components/issueForms/ReplacePrinterForm';
import { ReplaceShkForm } from './components/issueForms/ReplaceShkForm';
import { ReplaceTsdForm } from './components/issueForms/ReplaceTsdForm';
import { ISSUE_TYPES } from './config/issueTypes';
import { PROJECTS } from './config/projectConfig';
import { THEME_ASSETS } from './config/themeAssets';
import { useTheme } from './hooks/useTheme';
import { parseDescription } from './utils/parseDescription';

// 1. Единый тип для parsed, который используется во всех формах
type ParsedData = {
    employee: string;
    location: string;
    address: string;
    phone: string;
    problem: string;
    serialNumber: string;
    equipmentType: string;
    equipmentModel: string;
    equipmentName: string;
    description: string;
    requestType: string;
    toName: string;
    toId: string;
    toType: string;
    shortCostCenter: string;
    managerName: string;
    managerPhone: string;
    contractor: string;
    plannedDate: string;
    summary: string;
    storeTitle?: string;
};

const App = () => {
    const { theme, slotContext } = useTrackerPluginContext<'issue.action'>('full');

    const { theme: userTheme, setTheme: setUserTheme } = useTheme();

    useEffect(() => {
        document.body.setAttribute('data-theme', userTheme);
        return () => {
            document.body.removeAttribute('data-theme');
        };
    }, [userTheme]);

    const assets = THEME_ASSETS[userTheme] ?? THEME_ASSETS.classic;

    const [project, setProject] = useState<string[]>([]);
    const [issueType, setIssueType] = useState<string[]>([]);

    const getIssueTypes = (projectKey: string) => {
        const types = ISSUE_TYPES[projectKey as keyof typeof ISSUE_TYPES];
        return types ? [...types] : [];
    };

    type EquipmentField = {
        key: string;
        name: string;
        value: string;
    };

    type CreatedIssue = {
        key: string;
    };

    const [equipmentFieldsToFill, setEquipmentFieldsToFill] = useState<EquipmentField[]>([]);
    const [equipmentFieldValues, setEquipmentFieldValues] = useState<Record<string, string>>({});
    const [equipmentFieldOptions, setEquipmentFieldOptions] = useState<Record<string, string[]>>(
        {},
    );
    const [showEquipmentFieldsModal, setShowEquipmentFieldsModal] = useState(false);
    const [createdIssue, setCreatedIssue] = useState<CreatedIssue | null>(null);

    // 2. Явно указываем тип ParsedData
    const [parsed, setParsed] = useState<ParsedData>({
        employee: '',
        location: '',
        address: '',
        phone: '',
        problem: '',
        serialNumber: '',
        equipmentType: '',
        equipmentModel: '',
        equipmentName: '',
        description: '',
        requestType: '',
        toName: '',
        toId: '',
        toType: '',
        shortCostCenter: '',
        managerName: '',
        managerPhone: '',
        contractor: '',
        plannedDate: '',
        summary: '',
    });
    const [requestSubject, setRequestSubject] = useState('');

    type FieldOption = {
        value?: string;
        name?: string;
        display?: string;
    };

    const getFieldValues = (optionsProvider: unknown): FieldOption[] | string[] => {
        if (!optionsProvider || typeof optionsProvider !== 'object') {
            return [];
        }

        const provider = optionsProvider as {
            values?: unknown;
        };

        if (!Array.isArray(provider.values)) {
            return [];
        }

        return provider.values as FieldOption[] | string[];
    };

    const [description, setDescription] = useState('');

    useEffect(() => {
        if (!slotContext) {
            return;
        }

        const slotDescription =
            slotContext.description !== undefined && slotContext.description !== null
                ? String(slotContext.description)
                : '';

        const parsedDescription = parseDescription(slotDescription);

        setParsed({
            employee: parsedDescription.employee ?? '',
            location: parsedDescription.location ?? '',
            address: parsedDescription.address ?? '',
            phone: parsedDescription.phone ?? '',
            problem: parsedDescription.problem ?? '',
            equipmentModel: parsedDescription.equipmentModel ?? '',
            serialNumber: parsedDescription.serialNumber ?? '',
            equipmentType: parsedDescription.equipmentType ?? '',
            equipmentName: parsedDescription.equipmentName ?? '',
            description: slotDescription,
            requestType: parsedDescription.requestType ?? '',
            toName: parsedDescription.toName ?? '',
            toId: parsedDescription.toId ?? '',
            toType: parsedDescription.toType ?? '',
            shortCostCenter: parsedDescription.shortCostCenter ?? '',
            managerName: parsedDescription.managerName ?? '',
            managerPhone: parsedDescription.managerPhone ?? '',
            contractor: parsedDescription.contractor ?? '',
            plannedDate: parsedDescription.plannedDate ?? '',
            summary: parsedDescription.summary ?? '',
        });
    }, [slotContext]);

    useEffect(() => {
        setIssueType([]);
    }, [project]);

    const options = PROJECTS.map((projectItem) => ({
        value: projectItem.queue,
        content: projectItem.queue,
    }));

    const locationMap: Record<string, string> = {
        ПВЗ: 'Pup',
        LaSport: 'Shop',
        PuP: 'Pup',
        СЦ: 'TWH',
    };

    const getNewIssueLocation = (location: string) => {
        return locationMap[location] ?? location;
    };

    const EQUIPMENT_TYPE_MAP: Record<string, string> = {
        Термопринтер: 'Принтер этикеток',
        СШК: 'Сканер штрих кода',
        ПК: 'Неттоп',
        'Принтер А4/МФУ': 'МФУ',
        'Ридер\\Платежный терминал': 'Ридер',
        Смартфон: 'Телефон',
        Маршрутизатор: 'Сетевое оборудование',
        Коммутатор: 'Cетевое оборудование',
        'Wi-Fi AP (точка доступа)': 'Сетевое оборудование',
    };

    const getEquipmentName = () => {
        const equipmentType = EQUIPMENT_TYPE_MAP[parsed.equipmentType] ?? parsed.equipmentType;

        return [equipmentType, parsed.equipmentModel].filter(Boolean).join(' ');
    };

    const getStringValue = (value: unknown): string => {
        if (typeof value === 'string') {
            return value;
        }

        if (value && typeof value === 'object') {
            const field = value as {
                value?: unknown;
                name?: unknown;
                display?: unknown;
            };

            if (typeof field.value === 'string') {
                return field.value;
            }

            if (typeof field.name === 'string') {
                return field.name;
            }

            if (typeof field.display === 'string') {
                return field.display;
            }
        }

        return '';
    };

    const buildDescription = () => {
        const isReplaceTsd = project[0] === 'ITEQUIPHO' && issueType[0] === 'replace-tsd';
        const isReplaceShk = project[0] === 'ITEQUIPHO' && issueType[0] === 'replace-shk';
        const isReplacePC = project[0] === 'ITEQUIPHO' && issueType[0] === 'replace-pc';
        const isReplacePrinter = project[0] === 'ITEQUIPHO' && issueType[0] === 'replace-printer';
        const isReplaceNet = project[0] === 'ITEQUIPHO' && issueType[0] === 'replace-net';

        if (project[0] === 'ITINT') {
            return parsed.description || '';
        }

        if (project[0] === 'ONESSUP') {
            return parsed.description || '';
        }

        if (isReplaceTsd || isReplaceShk || isReplacePC || isReplacePrinter || isReplaceNet) {
            return `
${parsed.description}
----------------------------------------
Наименование оборудования: ${getEquipmentName()}
SN: ${parsed.serialNumber}
Локация: ${getNewIssueLocation(parsed.location)}
Адрес отправителя: ${parsed.address}
Телефон: ${parsed.phone}
ФИО Управляющего объекта: ${parsed.employee}
----------------------------------------
Вложения:
            `.trim();
        }

        return description;
    };

    const loadEquipmentFieldOptions = async () => {
        const fieldKeys = [
            'sdLocation',
            'sdEquipmentType',
            'tosEquipmentModel',
            'causeEquipmentMalfunction',
            'influenceequipment',
        ];

        const optionsMap: Record<string, string[]> = {};

        for (const fieldKey of fieldKeys) {
            try {
                const response = await trackerApi.v3.get['/fields/{id}']({
                    pathParams: {
                        id: fieldKey,
                    },
                    queryParams: {},
                });

                const values = getFieldValues(response.data?.optionsProvider);

                optionsMap[fieldKey] = values.map((value) => {
                    if (typeof value === 'string') {
                        return value;
                    }

                    return value?.value ?? value?.name ?? value?.display ?? String(value);
                });
            } catch (e) {
                console.error(`=== ОШИБКА ПОЛУЧЕНИЯ ПОЛЯ ${fieldKey} ===`, e);
                optionsMap[fieldKey] = [];
            }
        }

        setEquipmentFieldOptions(optionsMap);

        return optionsMap;
    };

    const closeParentIssue = async (newIssueKey: string) => {
        if (!slotContext) return;

        const newIssueUrl = `https://tracker.yandex.ru/${newIssueKey}`;

        const comment =
            `Создана задача на замену: [${newIssueKey}](${newIssueUrl}).\n` +
            `Далее работа будет вестись в рамках вышеуказанной заявки.\n` +
            `Данную задачу закрываем.\n` +
            `Хорошего дня!`;

        const transitions = await trackerApi.v3.get['/issues/{id}/transitions']({
            pathParams: {
                id: slotContext.key,
            },
        });

        const closeTransition = transitions.data.find(
            (transition) => transition.to?.key === 'closed',
        );

        if (!closeTransition) {
            throw new Error('Переход в статус «Закрыт» не найден');
        }

        await trackerApi.v3.post['/issues/{id}/transitions/{transitionId}/_execute']({
            pathParams: {
                id: slotContext.key,
                transitionId: closeTransition.id,
            },
            queryParams: {
                notify: false,
                notifyAuthor: false,
            },
            bodyParams: {
                comment,
            },
        });
    };

    const handleCreateIssue = async () => {
        if (!slotContext) return;

        const issue = await trackerApi.v3.get['/issues/{id}']({
            pathParams: {
                id: slotContext.key,
            },
        });

        const issueTypeName =
            ISSUE_TYPES[project[0] as keyof typeof ISSUE_TYPES]?.find(
                (item) => item.value === issueType[0],
            )?.content ?? 'Новая задача';

        let issueTitle = issueTypeName;

        if (project[0] === 'ITINT') {
            issueTitle = parsed.summary || issueTypeName;
        } else if (project[0] === 'ONESSUP') {
            issueTitle = parsed.summary || issueTypeName;
        } else if (project[0] !== 'ITEQUIPHO') {
            issueTitle = `${issueTypeName} - ${requestSubject}`.trim();
        }

        const newDescription = buildDescription();

        try {
            const body: any = {
                queue: project[0],
                summary: issueTitle,
                description: newDescription,
            };

            // ==========================================
            // ITEQUIPHO
            // ==========================================
            if (project[0] === 'ITEQUIPHO') {
                if (parsed.location) {
                    body['6942f107c0abca1bb0703d0d--locationeq'] =
                        locationMap[parsed.location] ?? parsed.location;
                }

                if (parsed.phone) {
                    body.telefon = parsed.phone;
                }

                if (parsed.address) {
                    body.adrespoluchatelja = parsed.address;
                }

                if (parsed.serialNumber) {
                    body['6942f107c0abca1bb0703d0d--sn'] = parsed.serialNumber;
                }

                if (parsed.employee) {
                    body.fioupravljajuschegoto = parsed.employee;
                }

                if (getEquipmentName()) {
                    body['6942f107c0abca1bb0703d0d--equipmentName'] = getEquipmentName();
                }

                if (parsed.equipmentType) {
                    body['6942f107c0abca1bb0703d0d--typeOfEquipment'] =
                        EQUIPMENT_TYPE_MAP[parsed.equipmentType] ?? parsed.equipmentType;
                }

                const issueData = issue.data as {
                    createdBy?: {
                        id?: string;
                    };
                    followers?: Array<{
                        id?: string;
                    }>;
                };

                if (issueData.createdBy?.id) {
                    body.author = { id: issueData.createdBy.id };
                }

                if (issueData.followers?.length) {
                    body.followers = issueData.followers.map((user) => ({
                        id: user.id,
                    }));
                }
            }

            // ==========================================
            // ITINT
            // ==========================================
            if (project[0] === 'ITINT') {
                if (parsed.requestType) {
                    body['6936d50b961d1d366df2cd6f--requestType'] = parsed.requestType;
                }

                if (parsed.plannedDate) {
                    body['6936d50b961d1d366df2cd6f--scheduledDateIntegrator'] = parsed.plannedDate;
                }

                if (parsed.toName) {
                    body.nazvaniepvzto = parsed.toName;
                }

                if (parsed.toId) {
                    body['6936d50b961d1d366df2cd6f--idTo'] = parsed.toId;
                }

                if (parsed.toType) {
                    body['6936d50b961d1d366df2cd6f--typeTo'] = parsed.toType;
                }

                if (parsed.address) {
                    body['6936d50b961d1d366df2cd6f--addressTo'] = parsed.address;
                }

                if (parsed.shortCostCenter) {
                    body['6936d50b961d1d366df2cd6f--costCenter'] = parsed.shortCostCenter;
                }

                if (parsed.managerName) {
                    body['6936d50b961d1d366df2cd6f--fullNameOfTheManagerTo'] = parsed.managerName;
                }

                if (parsed.managerPhone) {
                    body['6936d50b961d1d366df2cd6f--managersPhoneNumberTo'] = parsed.managerPhone;
                }

                if (parsed.contractor) {
                    body.components = [parsed.contractor];
                }

                if (issue.data.assignee?.id) {
                    body.author = { id: issue.data.assignee.id };
                }
            }

            // ==========================================
            // ONESSUP
            // ==========================================
            if (project[0] === 'ONESSUP') {
                if (issue.data.assignee?.id) {
                    body.author = { id: issue.data.assignee.id };
                }
            }

            if (project[0] !== 'ITEQUIPHO' && project[0] !== 'ITINT' && project[0] !== 'ONESSUP') {
                if (issue.data.assignee?.id) {
                    body.author = { id: issue.data.assignee.id };
                }
            }

            console.error('=== ЧТО ОТПРАВЛЯЕМ В CREATE ISSUE ===');
            console.error('PROJECT:', project[0]);
            console.error('BODY:', body);

            const newIssue = await trackerApi.v3.post['/issues']({
                queryParams: {
                    notify: false,
                    notifyAuthor: false,
                    staleOk: false,
                },
                bodyParams: body,
            });
            const newIssueKey = newIssue.data.key;

            console.error('=== НОВАЯ ЗАДАЧА СОЗДАНА ===');
            console.error('NEW ISSUE:', newIssueKey);

            await trackerApi.v3.post['/issues/{id}/links']({
                pathParams: {
                    id: slotContext.key,
                },
                bodyParams: {
                    issue: newIssueKey,
                    relationship: 'RELATES',
                },
            });

            setCreatedIssue(newIssue.data);

            // ======================================================
            // Проверка обязательных полей + закрытие родительской задачи
            // ======================================================
            if (project[0] === 'ITEQUIPHO') {
                const parentCheckResp = await trackerApi.v3.get['/issues/{id}']({
                    pathParams: {
                        id: slotContext.key,
                    },
                    queryParams: {
                        staleOk: false,
                        withFailIn: false,
                    },
                });

                const parentCheckIssue = parentCheckResp.data;

                const isEquipment =
                    (parentCheckIssue.type as { key?: string } | undefined)?.key === 'oborudovanie';

                console.error('ЭТО ОБОРУДОВАНИЕ:', isEquipment);

                if (isEquipment) {
                    const requiredEquipmentFields: EquipmentField[] = [
                        {
                            key: 'sdLocation',
                            name: 'Локация SD',
                            value: getStringValue(parentCheckIssue.sdLocation ?? ''),
                        },
                        {
                            key: 'sdEquipmentType',
                            name: 'Тип оборудования SD',
                            value: getStringValue(parentCheckIssue.sdEquipmentType ?? ''),
                        },
                        {
                            key: 'tosEquipmentModel',
                            name: 'Модель оборудования TOS',
                            value: getStringValue(parentCheckIssue.tosEquipmentModel ?? ''),
                        },
                        {
                            key: 'causeEquipmentMalfunction',
                            name: 'Причина неисправности оборудования',
                            value: getStringValue(parentCheckIssue.causeEquipmentMalfunction ?? ''),
                        },
                        {
                            key: 'influenceequipment',
                            name: 'Влияние (оборудование)',
                            value: getStringValue(parentCheckIssue.influenceequipment ?? ''),
                        },
                    ];

                    const missingEquipmentFields = requiredEquipmentFields.filter(
                        (field) => !field.value.trim(),
                    );

                    if (missingEquipmentFields.length > 0) {
                        setEquipmentFieldsToFill(missingEquipmentFields);

                        setEquipmentFieldValues({
                            sdLocation: getStringValue(parentCheckIssue.sdLocation),
                            sdEquipmentType: getStringValue(parentCheckIssue.sdEquipmentType),
                            tosEquipmentModel: getStringValue(parentCheckIssue.tosEquipmentModel),
                            causeEquipmentMalfunction: getStringValue(
                                parentCheckIssue.causeEquipmentMalfunction,
                            ),
                            influenceequipment: getStringValue(parentCheckIssue.influenceequipment),
                        });

                        await loadEquipmentFieldOptions();
                        setCreatedIssue(newIssue.data);
                        setShowEquipmentFieldsModal(true);

                        return;
                    }
                }

                await closeParentIssue(newIssueKey);
            }

            setCreatedIssue(newIssue.data);
        } catch (e: unknown) {
            // 4. Заменили any на unknown
            console.error('=== ОШИБКА СОЗДАНИЯ ЗАДАЧИ ===');
            if (e instanceof Error) {
                console.error('message', e.message);
            } else {
                console.error('error', e);
            }

            // 5. Безопасное извлечение данных ошибки
            const errorData =
                (e as { errorData?: unknown })?.errorData ||
                (e as { response?: { data?: unknown } })?.response?.data;
            console.error('errorData:', errorData);
        }
    };

    if (!slotContext) {
        return null;
    }

    // ================================================================
    // ЭКРАН УСПЕХА
    // ================================================================
    if (createdIssue) {
        return (
            <ThemeProvider theme={theme}>
                <div style={{ padding: 0 }}>
                    <div className="theme-form" data-theme={userTheme}>
                        <div className="theme-banner">
                            <span className="theme-banner-emoji">✅</span>
                            <span>Заявка успешно создана</span>
                            <div
                                style={{
                                    marginLeft: 'auto',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                }}
                            >
                                <span className="theme-banner-right" style={{ marginLeft: 0 }}>
                                    {assets.bannerRight}
                                </span>
                                <ThemeSwitcher theme={userTheme} onThemeChange={setUserTheme} />
                            </div>
                        </div>

                        <div className="theme-card">
                            <div className="theme-bg-glow" aria-hidden="true" />

                            <div className="theme-header">
                                <span className="theme-header-emoji">{assets.cardHeaderEmoji}</span>
                                <span className="theme-header-title">Готово</span>
                                <span className="theme-header-badge" style={{ marginLeft: 'auto' }}>
                                    Шаг 2
                                </span>
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    textAlign: 'center',
                                    padding: '40px 20px',
                                    position: 'relative',
                                    zIndex: 3,
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8,
                                        marginBottom: 12,
                                        fontSize: 13,
                                        fontWeight: 700,
                                        letterSpacing: '0.15em',
                                        textTransform: 'uppercase',
                                        color: 'var(--theme-label)',
                                        opacity: 0.85,
                                    }}
                                >
                                    <span
                                        style={{
                                            display: 'inline-block',
                                            width: 6,
                                            height: 6,
                                            background: 'var(--theme-label-mark)',
                                            borderRadius: '50%',
                                        }}
                                    />
                                    <span>Номер задачи</span>
                                </div>

                                <a
                                    href={`https://tracker.yandex.ru/${createdIssue.key}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                        fontSize: 48,
                                        fontWeight: 700,
                                        letterSpacing: '0.02em',
                                        lineHeight: 1.1,
                                        color: 'var(--theme-text-bright)',
                                        textDecoration: 'none',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {createdIssue.key}
                                </a>

                                <div
                                    style={{
                                        marginTop: 24,
                                        fontSize: 12,
                                        color: 'var(--theme-hint)',
                                        fontStyle: 'italic',
                                    }}
                                >
                                    Нажмите на номер, чтобы открыть задачу в трекере
                                </div>
                            </div>

                            {showEquipmentFieldsModal && (
                                <div className="theme-full-width">
                                    <div
                                        style={{
                                            marginTop: 16,
                                            padding: 20,
                                            border: '2px solid var(--theme-accent)',
                                            borderRadius: 12,
                                            background: 'var(--theme-accent-soft)',
                                        }}
                                    >
                                        <Text variant="header-2">
                                            ⚠️ Заполните обязательные поля
                                        </Text>

                                        <div style={{ marginTop: 12 }}>
                                            <Text color="secondary">
                                                В родительской задаче не заполнены следующие поля:
                                            </Text>
                                        </div>

                                        <div style={{ marginTop: 20 }}>
                                            {equipmentFieldsToFill.map((field) => (
                                                <div key={field.key} style={{ marginBottom: 20 }}>
                                                    <div className="theme-label">
                                                        <span>{field.name}</span>
                                                    </div>

                                                    <div className="theme-field">
                                                        {equipmentFieldOptions[field.key]?.length >
                                                        0 ? (
                                                            <Select
                                                                value={
                                                                    equipmentFieldValues[field.key]
                                                                        ? [
                                                                              equipmentFieldValues[
                                                                                  field.key
                                                                              ],
                                                                          ]
                                                                        : []
                                                                }
                                                                options={equipmentFieldOptions[
                                                                    field.key
                                                                ].map((option) => ({
                                                                    value: option,
                                                                    content: option,
                                                                }))}
                                                                onUpdate={(values) => {
                                                                    setEquipmentFieldValues(
                                                                        (prev) => ({
                                                                            ...prev,
                                                                            [field.key]:
                                                                                values[0] ?? '',
                                                                        }),
                                                                    );
                                                                }}
                                                                placeholder={`Выберите: ${field.name}`}
                                                            />
                                                        ) : (
                                                            <div
                                                                style={{
                                                                    padding: '10px 16px',
                                                                }}
                                                            >
                                                                <Text color="secondary">
                                                                    Для этого поля список вариантов
                                                                    не найден
                                                                </Text>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div
                                            style={{
                                                display: 'flex',
                                                gap: 12,
                                                marginTop: 24,
                                            }}
                                        >
                                            <Button
                                                view="action"
                                                onClick={async () => {
                                                    try {
                                                        await trackerApi.v3.patch['/issues/{id}']({
                                                            pathParams: {
                                                                id: slotContext.key,
                                                            },
                                                            bodyParams: equipmentFieldValues,
                                                        });

                                                        const parentCheckResp =
                                                            await trackerApi.v3.get['/issues/{id}'](
                                                                {
                                                                    pathParams: {
                                                                        id: slotContext.key,
                                                                    },
                                                                    queryParams: {
                                                                        staleOk: false,
                                                                        withFailIn: false,
                                                                    },
                                                                },
                                                            );

                                                        const parentCheckIssue =
                                                            parentCheckResp.data;

                                                        const requiredFields = [
                                                            parentCheckIssue.sdLocation,
                                                            parentCheckIssue.sdEquipmentType,
                                                            parentCheckIssue.tosEquipmentModel,
                                                            parentCheckIssue.causeEquipmentMalfunction,
                                                            parentCheckIssue.influenceequipment,
                                                        ];

                                                        const stillMissing = requiredFields.some(
                                                            (value) =>
                                                                value === undefined ||
                                                                value === null ||
                                                                String(value).trim() === '',
                                                        );

                                                        if (stillMissing) {
                                                            alert(
                                                                'Не все обязательные поля удалось сохранить.',
                                                            );
                                                            return;
                                                        }

                                                        if (createdIssue?.key) {
                                                            await closeParentIssue(
                                                                createdIssue.key,
                                                            );
                                                        }

                                                        setShowEquipmentFieldsModal(false);
                                                        setEquipmentFieldsToFill([]);
                                                        setEquipmentFieldValues({});
                                                    } catch (e) {
                                                        console.error(e);
                                                    }
                                                }}
                                            >
                                                Сохранить поля
                                            </Button>

                                            <Button
                                                view="flat"
                                                onClick={() => {
                                                    setShowEquipmentFieldsModal(false);
                                                    setEquipmentFieldsToFill([]);
                                                    setEquipmentFieldValues({});
                                                }}
                                            >
                                                Отмена
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </ThemeProvider>
        );
    }

    // ================================================================
    // ОСНОВНАЯ ФОРМА
    // ================================================================
    return (
        <ThemeProvider theme={theme}>
            <div style={{ padding: 0 }}>
                <div className="theme-form" data-theme={userTheme}>
                    <div className="theme-banner">
                        <span className="theme-banner-emoji">{assets.bannerEmoji}</span>
                        <span>{assets.bannerText}</span>
                        <div
                            style={{
                                marginLeft: 'auto',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                            }}
                        >
                            <span className="theme-banner-right" style={{ marginLeft: 0 }}>
                                {assets.bannerRight}
                            </span>
                            <ThemeSwitcher theme={userTheme} onThemeChange={setUserTheme} />
                        </div>
                    </div>

                    {assets.decor.length > 0 && (
                        <div className="theme-decor" aria-hidden="true">
                            {assets.decor.map((item, i) => (
                                <span
                                    key={i}
                                    className="theme-decor-item"
                                    style={
                                        {
                                            left: `${10 + i * 25}%`,
                                            fontSize: 18,
                                            ['--decor-delay' as string]: `${i}s`,
                                            ['--decor-duration' as string]: `${14 + i * 2}s`,
                                        } as React.CSSProperties
                                    }
                                >
                                    {item.char}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="theme-card">
                        <div className="theme-bg-glow" aria-hidden="true" />

                        <div className="theme-header">
                            <span className="theme-header-emoji">{assets.cardHeaderEmoji}</span>
                            <span className="theme-header-title">Новая задача</span>
                            <span className="theme-header-badge" style={{ marginLeft: 'auto' }}>
                                Шаг 1
                            </span>
                        </div>

                        <div className="theme-label theme-label-prominent">
                            <span>Проект</span>
                            <span className="theme-required">*</span>
                        </div>
                        <div className="theme-field theme-field-prominent">
                            <Select
                                size="l"
                                value={project}
                                options={options}
                                onUpdate={setProject}
                                placeholder="Выберите проект"
                            />
                        </div>

                        {project.length > 0 && (
                            <>
                                <div className="theme-label theme-label-prominent theme-field-gap">
                                    <span>Тип заявки</span>
                                    <span className="theme-required">*</span>
                                </div>
                                <div className="theme-field theme-field-prominent">
                                    <Select
                                        size="l"
                                        value={issueType}
                                        options={getIssueTypes(project[0])}
                                        onUpdate={setIssueType}
                                        placeholder="Выберите тип заявки"
                                    />
                                </div>
                            </>
                        )}

                        {project[0] === 'ITEQUIPHO' && issueType[0] === 'replace-tsd' && (
                            <ReplaceTsdForm
                                parsed={parsed}
                                setParsed={setParsed}
                                theme={userTheme}
                            />
                        )}
                        {project[0] === 'ITEQUIPHO' && issueType[0] === 'replace-shk' && (
                            <ReplaceShkForm
                                parsed={parsed}
                                setParsed={setParsed}
                                theme={userTheme}
                            />
                        )}
                        {project[0] === 'ITEQUIPHO' && issueType[0] === 'replace-pc' && (
                            <ReplacePCForm
                                parsed={parsed}
                                setParsed={setParsed}
                                theme={userTheme}
                            />
                        )}
                        {project[0] === 'ITEQUIPHO' && issueType[0] === 'replace-printer' && (
                            <ReplacePrinterForm
                                parsed={parsed}
                                setParsed={setParsed}
                                theme={userTheme}
                            />
                        )}
                        {project[0] === 'ITEQUIPHO' && issueType[0] === 'replace-net' && (
                            <ReplaceNetForm
                                parsed={parsed}
                                setParsed={setParsed}
                                theme={userTheme}
                            />
                        )}

                        {project[0] === 'NET' && (
                            <>
                                <div className="theme-label theme-field-gap">
                                    <span>Тема обращения</span>
                                    <span className="theme-required">*</span>
                                </div>
                                <div className="theme-field">
                                    <TextInput
                                        value={requestSubject}
                                        onUpdate={setRequestSubject}
                                        placeholder="Например: Требуется проверить роутер"
                                    />
                                </div>

                                <div className="theme-label theme-field-gap">
                                    <span>Описание</span>
                                </div>
                                <div className="theme-field">
                                    <TextArea
                                        minRows={10}
                                        value={description}
                                        onUpdate={setDescription}
                                        placeholder="Опишите проблему или задачу"
                                    />
                                </div>
                            </>
                        )}

                        {project[0] === 'ITINT' && issueType[0] === 'itint-integrator' && (
                            <ReplaceItintForm
                                parsed={parsed}
                                setParsed={setParsed}
                                theme={userTheme}
                            />
                        )}

                        {project[0] === 'ONESSUP' && (
                            <ReplaceOnessupForm
                                parsed={parsed}
                                setParsed={setParsed}
                                theme={userTheme}
                            />
                        )}

                        <div className="theme-full-width" style={{ marginTop: 32 }}>
                            <Button
                                view="action"
                                size="l"
                                disabled={!project.length}
                                onClick={handleCreateIssue}
                            >
                                Создать задачу
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </ThemeProvider>
    );
};

export default App;
