import UkraineOblasts, { UkraineOblastsWithoutNotSpecified } from "./UkraineOblasts";

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

const { 0: notSpecified, ...otherProps } = OblastsRecord;
export const OblastsWithoutNotSpecifiedRecord: Record<UkraineOblastsWithoutNotSpecified, string>
    = { ...otherProps };

export default OblastsRecord;