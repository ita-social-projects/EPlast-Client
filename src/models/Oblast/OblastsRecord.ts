import UkraineOblasts from "./UkraineOblasts";

const OblastsRecord: Record<UkraineOblasts, string> = {
    [UkraineOblasts.NotSpecified]: "Не обрано",
    [UkraineOblasts.Cherkasy]: "Черкаська",
    [UkraineOblasts.Chernihiv]: "Чернігівська",
    [UkraineOblasts.Chernivtsi]: "Чернівецька",
    [UkraineOblasts.Crimea]: "Автономна Республіка Крим",
    [UkraineOblasts.Dnipropetrovsk]: "Дніпропетровська",
    [UkraineOblasts.Donetsk]: "Донецька",
    [UkraineOblasts.IvanoFrankivsk]: "Івано-Франківська",
    [UkraineOblasts.Kharkiv]: "Харківська",
    [UkraineOblasts.Kherson]: "Херсонська",
    [UkraineOblasts.Khmelnytskyi]: "Хмельницька",
    [UkraineOblasts.Kyiv]: "Київська",
    [UkraineOblasts.Kirovohrad]: "Кіровоградська",
    [UkraineOblasts.Luhansk]: "Луганська",
    [UkraineOblasts.Lviv]: "Львівська",
    [UkraineOblasts.Mykolaiv]: "Миколаївська",
    [UkraineOblasts.Odessa]: "Одеська",
    [UkraineOblasts.Poltava]: "Полтавська",
    [UkraineOblasts.Rivne]: "Рівненська",
    [UkraineOblasts.Sumy]: "Сумська",
    [UkraineOblasts.Ternopil]: "Тернопільська",
    [UkraineOblasts.Vinnytsia]: "Вінницька",
    [UkraineOblasts.Volyn]: "Волинська",
    [UkraineOblasts.Zakarpattia]: "Закарпатська",
    [UkraineOblasts.Zaporizhzhia]: "Запорізька",
    [UkraineOblasts.Zhytomyr]: "Житомирська",
}

export const Oblasts: Readonly<[UkraineOblasts, string][]> = Object.entries(OblastsRecord)
    .sort(([key1, value1], [key2, value2]) => value1.localeCompare(value2))
    .map(([key, value]) => {
        const tuple: [UkraineOblasts, string] = [Number(key), value];
        return tuple;
    });

export const OblastsWithoutNotSpecified: Readonly<[UkraineOblasts, string][]>
    = Oblasts.filter(([key, value]) => key !== UkraineOblasts.NotSpecified);

export default OblastsRecord;