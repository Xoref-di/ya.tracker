import { useEffect, useState } from 'react';

import { Button, Card, Select, Text, TextArea, TextInput, ThemeProvider } from '@gravity-ui/uikit';
import { trackerApi, useTrackerPluginContext } from '@weavix/tracker-plugin-sdk-react';

import { ReplaceNetForm } from './components/issueForms/ReplaceNetForm';
import { ReplacePCForm } from './components/issueForms/ReplacePCForm';
import { ReplacePrinterForm } from './components/issueForms/ReplacePrinterForm';
import { ReplaceShkForm } from './components/issueForms/ReplaceShkForm';
import { ReplaceTsdForm } from './components/issueForms/ReplaceTsdForm';
import { ISSUE_TYPES } from './config/issueTypes';
import { PROJECTS } from './config/projectConfig';
import { parseDescription } from './utils/parseDescription';
// ⚠️ ВАЖНО: Проверь, что в ReplaceTsdForm.tsx и ReplaceShkForm.tsx стоит export function ... (именованный экспорт).
// Если там export default, то нужно убрать фигурные скобки здесь: import ReplaceTsdForm from ...

const App = () => {
    const { theme, slotContext } = useTrackerPluginContext<'issue.action'>('full');

    const [project, setProject] = useState<string[]>([]);
    const [issueType, setIssueType] = useState<string[]>([]);

    const getIssueTypes = (projectKey: string) => {
        const types = ISSUE_TYPES[projectKey as keyof typeof ISSUE_TYPES];
        return types ? [...types] : [];
    };

    type TrackerAttachment = {
        id: string;
        name: string;
        thumbnail?: string;
        content?: string;
    };

    const [attachments] = useState<TrackerAttachment[]>([]);
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
    const [parsed, setParsed] = useState({
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
    };

    const getNewIssueLocation = (location: string) => {
        return locationMap[location] ?? location;
    };

    const EQUIPMENT_TYPE_MAP: Record<string, string> = {
        Термопринтер: 'Принтер этикеток',
        СШК: 'Сканер штрих кода',
        ПК: 'Неттоп',
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

        if (isReplaceTsd || isReplaceShk || isReplacePC || isReplacePrinter || isReplaceNet) {
            // ✅ Исправлен синтаксис шаблонной строки (добавлен пробел после return)
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
                console.error(`=== ПОЛУЧАЕМ ПОЛЕ ${fieldKey} ===`);

                const response = await trackerApi.v3.get['/fields/{id}']({
                    pathParams: {
                        id: fieldKey,
                    },
                    queryParams: {},
                });

                // Type guard для проверки наличия optionsProvider и values
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

        console.error('=== НАЧИНАЕМ ЗАКРЫТИЕ РОДИТЕЛЬСКОЙ ЗАДАЧИ ===');

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

        console.error('=== НАЙДЕН ПЕРЕХОД В CLOSED ===', closeTransition);

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

        console.error('=== РОДИТЕЛЬСКАЯ ЗАДАЧА УСПЕШНО ЗАКРЫТА ===');
    };
    if (!slotContext) {
        return null;
    }

    if (createdIssue) {
        return (
            <ThemeProvider theme={theme}>
                <div style={{ padding: 24 }}>
                    <Card style={{ padding: 32, textAlign: 'center' }}>
                        <Text variant="header-2">✅ Заявка успешно создана</Text>

                        <div style={{ marginTop: 20 }}>
                            <Text variant="body-2">Номер задачи: </Text>

                            <a
                                href={`https://tracker.yandex.ru/${createdIssue.key}`}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {createdIssue.key}
                            </a>
                        </div>

                        {showEquipmentFieldsModal && (
                            <Card
                                style={{
                                    marginBottom: 24,
                                    padding: 20,
                                    border: '2px solid #ffb300',
                                }}
                            >
                                <Text variant="header-2">⚠️ Заполните обязательные поля</Text>

                                <div style={{ marginTop: 12 }}>
                                    <Text color="secondary">
                                        В родительской задаче не заполнены следующие поля:
                                    </Text>
                                </div>

                                <div style={{ marginTop: 20 }}>
                                    {equipmentFieldsToFill.map((field) => (
                                        <div
                                            key={field.key}
                                            style={{
                                                marginBottom: 20,
                                            }}
                                        >
                                            <Text variant="subheader-2">{field.name}</Text>

                                            <div style={{ marginTop: 8 }}>
                                                {equipmentFieldOptions[field.key]?.length > 0 ? (
                                                    <Select
                                                        value={
                                                            equipmentFieldValues[field.key]
                                                                ? [equipmentFieldValues[field.key]]
                                                                : []
                                                        }
                                                        options={equipmentFieldOptions[
                                                            field.key
                                                        ].map((option) => ({
                                                            value: option,
                                                            content: option,
                                                        }))}
                                                        onUpdate={(values) => {
                                                            setEquipmentFieldValues((prev) => ({
                                                                ...prev,
                                                                [field.key]: values[0] ?? '',
                                                            }));
                                                        }}
                                                        placeholder={`Выберите: ${field.name}`}
                                                    />
                                                ) : (
                                                    <Text color="secondary">
                                                        Для этого поля список вариантов не найден
                                                    </Text>
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
                                                console.error(
                                                    '=== СОХРАНЯЕМ ПОЛЯ ===',
                                                    equipmentFieldValues,
                                                );

                                                // 1. Сохраняем обязательные поля
                                                await trackerApi.v3.patch['/issues/{id}']({
                                                    pathParams: {
                                                        id: slotContext.key,
                                                    },
                                                    bodyParams: equipmentFieldValues,
                                                });

                                                console.error(
                                                    '=== ПОЛЯ РОДИТЕЛЬСКОЙ ЗАДАЧИ СОХРАНЕНЫ ===',
                                                );

                                                // 2. Повторно получаем родительскую задачу
                                                //    и проверяем, что поля действительно заполнены
                                                const parentCheckResp = await trackerApi.v3.get[
                                                    '/issues/{id}'
                                                ]({
                                                    pathParams: {
                                                        id: slotContext.key,
                                                    },
                                                    queryParams: {
                                                        staleOk: false,
                                                        withFailIn: false,
                                                    },
                                                });

                                                const parentCheckIssue = parentCheckResp.data;

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

                                                console.error(
                                                    '=== ПРОВЕРКА ПОЛЕЙ ПОСЛЕ СОХРАНЕНИЯ ===',
                                                    requiredFields,
                                                );

                                                console.error(
                                                    '=== ЕСТЬ ЕЩЁ НЕЗАПОЛНЕННЫЕ ===',
                                                    stillMissing,
                                                );

                                                // Если API не сохранил что-то — родителя пока не закрываем
                                                if (stillMissing) {
                                                    console.error(
                                                        '=== НЕ ВСЕ ОБЯЗАТЕЛЬНЫЕ ПОЛЯ СОХРАНИЛИСЬ ===',
                                                    );

                                                    alert(
                                                        'Не все обязательные поля удалось сохранить. Проверьте заполнение.',
                                                    );

                                                    return;
                                                }

                                                // 3. Все поля заполнены — закрываем родительскую задачу
                                                if (createdIssue?.key) {
                                                    await closeParentIssue(createdIssue.key);
                                                }

                                                console.error(
                                                    '=== РОДИТЕЛЬСКАЯ ЗАДАЧА УСПЕШНО ЗАКРЫТА ПОСЛЕ ЗАПОЛНЕНИЯ ПОЛЕЙ ===',
                                                );

                                                // 4. Закрываем окно обязательных полей
                                                setShowEquipmentFieldsModal(false);
                                                setEquipmentFieldsToFill([]);
                                                setEquipmentFieldValues({});

                                                // createdIssue НЕ сбрасываем!
                                                // Благодаря этому остаётся экран:
                                                // "Заявка успешно создана"
                                            } catch (e) {
                                                console.error('=== ОШИБКА СОХРАНЕНИЯ ПОЛЕЙ ===');
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
                            </Card>
                        )}

                        <div style={{ marginTop: 30 }}>
                            <Text color="secondary">Теперь можно закрыть это окно.</Text>
                        </div>
                    </Card>
                </div>
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider theme={theme}>
            <div style={{ padding: 20 }}>
                <Card style={{ padding: 24 }}>
                    <Text variant="header-2">Создание связанной задачи</Text>

                    {/* Блок родительской задачи */}
                    <div
                        style={{
                            marginTop: 16,
                            marginBottom: 24,
                            padding: '12px 16px',
                            border: '1px solid var(--g-color-line-generic)',
                            borderRadius: 6,
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Text variant="caption-1" color="secondary">
                                От:
                            </Text>
                            <a
                                href={`https://tracker.yandex.ru/${slotContext.key}`}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                    fontWeight: 500,
                                    color: 'var(--g-color-text-link)',
                                    textDecoration: 'none',
                                }}
                            >
                                {slotContext.key}
                            </a>
                            <Text variant="body-2" color="secondary">
                                {String(slotContext.summary)}
                            </Text>
                        </div>
                    </div>

                    {/*<Button
                        view="outlined"
                        onClick={async () => {
                            try {
                                const fieldsResp =
                                    await trackerApi.v3.get["/queues/{queueId}/localFields"]({
                                        pathParams: {
                                            queueId: 'ITEQUIPHO',
                                        },
                                        queryParams: {},
                                    });
                                console.log("=== LOCAL FIELDS SUPTOS ===");
                                console.dir(fieldsResp.data, { depth: null });

                                console.log("=== ЛОКАЛЬНЫЕ ПОЛЯ ITEQUIPHO ===");
                                console.log(fieldsResp.data);
                                console.dir(fieldsResp.data);
                            } catch (e) {
                                console.error("=== ОШИБКА ПОЛУЧЕНИЯ ЛОКАЛЬНЫХ ПОЛЕЙ ===");
                                console.error(e);
                            }
                        }}
                    >
                        Проверить поля
                    </Button> */}

                    {/* <Button
                        view="outlined"
                        onClick={async () => {
                            try {
                                const parentIssue =
                                    await trackerApi.v3.get["/issues/{id}"]({
                                        pathParams: {
                                            id: slotContext.key,
                                        },
                                        queryParams: {},
                                    });

                                const isEquipment =
                                    parentIssue.data.type?.key === "oborudovanie";

                                console.log("ТИП ЗАДАЧИ:", parentIssue.data.type?.key);
                                console.log("ЭТО ОБОРУДОВАНИЕ:", isEquipment);

                                if (isEquipment) {
                                    const equipmentFields = [
                                        {
                                            key: "sdLocation",
                                            name: "Локация",
                                            value: parentIssue.data.sdLocation,
                                        },
                                        {
                                            key: "sdEquipmentType",
                                            name: "Тип оборудования",
                                            value: parentIssue.data.sdEquipmentType,
                                        },
                                        {
                                            key: "tosEquipmentModel",
                                            name: "Модель оборудования",
                                            value: parentIssue.data.tosEquipmentModel,
                                        },
                                        {
                                            key: "causeEquipmentMalfunction",
                                            name: "Причина неисправности оборудования",
                                            value: parentIssue.data.causeEquipmentMalfunction,
                                        },
                                        {
                                            key: "influenceequipment",
                                            name: "Влияние (оборудование)",
                                            value: parentIssue.data.influenceequipment,
                                        },
                                    ];

                                    const emptyFields = equipmentFields.filter(
                                        field =>
                                            field.value === undefined ||
                                            field.value === null ||
                                            field.value === ""
                                    );

                                    console.log("=== ПОЛЯ ОБОРУДОВАНИЯ ===");
                                    console.dir(equipmentFields, { depth: null });

                                    console.log("=== НЕЗАПОЛНЕННЫЕ ===");
                                    console.dir(emptyFields, { depth: null });
                                }

                                console.log("=== TYPE ===");
                                console.dir(parentIssue, { depth: null });

                                console.log("TYPE KEY:", parentIssue?.key);
                                console.log("TYPE ID:", parentIssue?.id);
                                console.log("TYPE DISPLAY:", parentIssue?.display);

                                console.log("=== ПОЛНАЯ РОДИТЕЛЬСКАЯ ЗАДАЧА ===");
                                console.dir(parentIssue.data, { depth: null });

                                console.log("=== ПРОВЕРКА СИСТЕМНЫХ ПОЛЕЙ ===");

                                console.log(
                                    "sdLocation:",
                                    parentIssue.data.sdLocation
                                );

                                console.log(
                                    "sdEquipmentType:",
                                    parentIssue.data.sdEquipmentType
                                );

                                console.log(
                                    "tosEquipmentModel:",
                                    parentIssue.data.tosEquipmentModel
                                );

                                console.log(
                                    "causeEquipmentMalfunction:",
                                    parentIssue.data.causeEquipmentMalfunction
                                );

                                console.log(
                                    "influenceequipment:",
                                    parentIssue.data.influenceequipment
                                );

                            } catch (e) {
                                console.error("=== ОШИБКА ===");
                                console.error(e);
                            }
                        }}
                    >
                        Проверить системные поля
                    </Button> */}

                    <div style={{ marginTop: 24 }}>
                        <Select
                            width={370}
                            label=""
                            value={project}
                            options={options}
                            onUpdate={setProject}
                            placeholder="Выберите проект"
                        />

                        {project.length > 0 && (
                            <div style={{ marginTop: 20 }}>
                                <Select
                                    width={370}
                                    value={issueType}
                                    options={getIssueTypes(project[0])}
                                    onUpdate={setIssueType}
                                    placeholder="Выберите тип заявки"
                                />
                            </div>
                        )}
                    </div>

                    {project[0] === 'ITEQUIPHO' && issueType[0] === 'replace-tsd' && (
                        <ReplaceTsdForm parsed={parsed} setParsed={setParsed} />
                    )}

                    {project[0] === 'ITEQUIPHO' && issueType[0] === 'replace-shk' && (
                        <ReplaceShkForm parsed={parsed} setParsed={setParsed} />
                    )}

                    {project[0] === 'ITEQUIPHO' && issueType[0] === 'replace-pc' && (
                        <ReplacePCForm parsed={parsed} setParsed={setParsed} />
                    )}

                    {project[0] === 'ITEQUIPHO' && issueType[0] === 'replace-printer' && (
                        <ReplacePrinterForm parsed={parsed} setParsed={setParsed} />
                    )}

                    {project[0] === 'ITEQUIPHO' && issueType[0] === 'replace-net' && (
                        <ReplaceNetForm parsed={parsed} setParsed={setParsed} />
                    )}

                    {project[0] === 'NET' && (
                        <div style={{ marginTop: 20 }}>
                            <Text variant="subheader-2">Тема обращения</Text>

                            <div style={{ marginTop: 8 }}>
                                <TextInput
                                    value={requestSubject}
                                    onUpdate={setRequestSubject}
                                    placeholder="Например: Требуется проверить роутер"
                                />
                            </div>

                            <div style={{ marginTop: 20 }}>
                                <Text variant="subheader-2">Описание</Text>

                                <div style={{ marginTop: 8 }}>
                                    <TextArea
                                        minRows={10}
                                        value={description}
                                        onUpdate={setDescription}
                                        placeholder="Опишите проблему или задачу"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div style={{ marginTop: 32 }}>
                        {/* Блок вложений: только если есть файлы */}
                        {attachments.length > 0 && (
                            <div style={{ marginTop: 24 }}>
                                <Text variant="subheader-2">Вложения</Text>

                                <div
                                    style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: 16,
                                        marginTop: 16,
                                    }}
                                ></div>
                            </div>
                        )}

                        {/* Кнопка "Создать" — всегда отображается, если выбран проект */}
                        <Button
                            view="action"
                            disabled={!project.length}
                            onClick={async () => {
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

                                if (project[0] !== 'ITEQUIPHO') {
                                    issueTitle = `${issueTypeName} - ${requestSubject}`.trim();
                                }

                                console.error('DESCRIPTION STATE:', description);
                                console.error('PARSED PROBLEM:', parsed.problem);

                                const newDescription = buildDescription();

                                //const locationMap: Record<string, string> = {
                                // ПВЗ: 'Pup',
                                // ТВХ: 'TWH',
                                //};

                                try {
                                    const body: any = {
                                        queue: project[0],
                                        summary: issueTitle,
                                        description: newDescription,
                                        '6942f107c0abca1bb0703d0d--requestType': issueTitle,
                                    };

                                    // Кастомные поля — только если они есть
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
                                            body['6942f107c0abca1bb0703d0d--sn'] =
                                                parsed.serialNumber;
                                        }

                                        if (parsed.employee) {
                                            body.fioupravljajuschegoto = parsed.employee;
                                        }

                                        if (getEquipmentName()) {
                                            body['6942f107c0abca1bb0703d0d--equipmentName'] =
                                                getEquipmentName();
                                        }

                                        if (parsed.equipmentType) {
                                            body['6942f107c0abca1bb0703d0d--typeOfEquipment'] =
                                                EQUIPMENT_TYPE_MAP[parsed.equipmentType] ??
                                                parsed.equipmentType;
                                        }

                                        const issueData = issue.data as {
                                            createdBy?: {
                                                id?: string;
                                            };
                                            followers?: Array<{
                                                id?: string;
                                            }>;
                                        };
                                        // Автор
                                        if (issueData.createdBy?.id) {
                                            body.author = {
                                                id: issueData.createdBy.id,
                                            };
                                        }

                                        // Наблюдатели
                                        if (issueData.followers?.length) {
                                            body.followers = issueData.followers.map((user) => ({
                                                id: user.id,
                                            }));
                                        }
                                    }

                                    // ==========================================
                                    // ВСЕ ОСТАЛЬНЫЕ ПРОЕКТЫ
                                    // ==========================================

                                    if (project[0] !== 'ITEQUIPHO') {
                                        // Автор = исполнитель родительской задачи
                                        if (issue.data.assignee?.id) {
                                            body.author = {
                                                id: issue.data.assignee.id,
                                            };
                                        }

                                        // followers НЕ добавляем
                                    }

                                    console.error('=== ЧТО ОТПРАВЛЯЕМ В CREATE ISSUE ===');
                                    console.error('PROJECT:', project[0]);
                                    console.error('BODY:', body);
                                    console.error('sn:', body.sn);
                                    console.error(
                                        'fioupravljajuschegoto:',
                                        body.fioupravljajuschegoto,
                                    );

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
                                    // 2. Получаем РОДИТЕЛЬСКУЮ задачу заново
                                    // ======================================================
                                    if (project[0] === 'ITEQUIPHO') {
                                        const parentCheckResp = await trackerApi.v3.get[
                                            '/issues/{id}'
                                        ]({
                                            pathParams: {
                                                id: slotContext.key,
                                            },
                                            queryParams: {
                                                staleOk: false,
                                                withFailIn: false,
                                            },
                                        });

                                        const parentCheckIssue = parentCheckResp.data;

                                        // ======================================================
                                        // 3. Проверяем обязательные поля ТОЛЬКО для Оборудования
                                        // ======================================================

                                        const isEquipment =
                                            (parentCheckIssue.type as { key?: string } | undefined)
                                                ?.key === 'oborudovanie';

                                        console.error('ЭТО ОБОРУДОВАНИЕ:', isEquipment);

                                        if (isEquipment) {
                                            const requiredEquipmentFields: EquipmentField[] = [
                                                {
                                                    key: 'sdLocation',
                                                    name: 'Локация SD',
                                                    value: getStringValue(
                                                        parentCheckIssue.sdLocation ?? '',
                                                    ),
                                                },
                                                {
                                                    key: 'sdEquipmentType',
                                                    name: 'Тип оборудования SD',
                                                    value: getStringValue(
                                                        parentCheckIssue.sdEquipmentType ?? '',
                                                    ),
                                                },
                                                {
                                                    key: 'tosEquipmentModel',
                                                    name: 'Модель оборудования TOS',
                                                    value: getStringValue(
                                                        parentCheckIssue.tosEquipmentModel ?? '',
                                                    ),
                                                },
                                                {
                                                    key: 'causeEquipmentMalfunction',
                                                    name: 'Причина неисправности оборудования',
                                                    value: getStringValue(
                                                        parentCheckIssue.causeEquipmentMalfunction ??
                                                            '',
                                                    ),
                                                },
                                                {
                                                    key: 'influenceequipment',
                                                    name: 'Влияние (оборудование)',
                                                    value: getStringValue(
                                                        parentCheckIssue.influenceequipment ?? '',
                                                    ),
                                                },
                                            ];

                                            const missingEquipmentFields =
                                                requiredEquipmentFields.filter(
                                                    (field) => !field.value.trim(),
                                                );

                                            console.error('=== ОБЯЗАТЕЛЬНЫЕ ПОЛЯ ===');
                                            console.error(requiredEquipmentFields);

                                            console.error('=== НЕЗАПОЛНЕННЫЕ ПОЛЯ ===');
                                            console.error(missingEquipmentFields);

                                            // ----------------------------------------------
                                            // Если есть пустые — останавливаем закрытие
                                            // ----------------------------------------------

                                            if (missingEquipmentFields.length > 0) {
                                                console.error('=== ЕСТЬ НЕЗАПОЛНЕННЫЕ ПОЛЯ ===');

                                                setEquipmentFieldsToFill(missingEquipmentFields);

                                                setEquipmentFieldValues({
                                                    sdLocation: getStringValue(
                                                        parentCheckIssue.sdLocation,
                                                    ),
                                                    sdEquipmentType: getStringValue(
                                                        parentCheckIssue.sdEquipmentType,
                                                    ),
                                                    tosEquipmentModel: getStringValue(
                                                        parentCheckIssue.tosEquipmentModel,
                                                    ),
                                                    causeEquipmentMalfunction: getStringValue(
                                                        parentCheckIssue.causeEquipmentMalfunction,
                                                    ),
                                                    influenceequipment: getStringValue(
                                                        parentCheckIssue.influenceequipment,
                                                    ),
                                                });

                                                await loadEquipmentFieldOptions();
                                                setCreatedIssue(newIssue.data);
                                                setShowEquipmentFieldsModal(true);

                                                // НЕ закрываем окно
                                                return;
                                            }
                                        }

                                        await closeParentIssue(newIssueKey);

                                        console.error('=== РОДИТЕЛЬСКАЯ ЗАДАЧА ЗАКРЫТА ===');
                                    }

                                    // Показываем экран "Заявка успешно создана"
                                    setCreatedIssue(newIssue.data);

                                    // trackerApi.v3.post["/issues/{id}/attachments"]
                                } catch (e) {
                                    if (e instanceof Error) {
                                        console.error('message', e.message);
                                    } else {
                                        console.error('error', e);
                                    }
                                }
                            }}
                        >
                            Создать
                        </Button>
                    </div>
                </Card>
            </div>
        </ThemeProvider>
    );
};

export default App;
