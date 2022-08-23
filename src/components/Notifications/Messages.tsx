import React from "react";

const wrongFormat = "Вкажіть, будь ласка, правильний формат";
export const incorrectEmail = wrongFormat + " електронної пошти";

export const incorrectUrl = wrongFormat + " URL-посилання";

export const emptyInput = (name?: string) => {
  return name ? `Поле ${name} є обов'язковим` : `Поле є обов'язковим`;
};

export const incorrectStartTime =
  "Час початку події не може бути раніше поточного часу!";

export const incorrectEndTime =
  "Час завершення події не може бути раніше часу початку!";

export const eventTypeIsNotChosen = "Оберіть тип події спочатку!";

export const incorrectSlogan =
  wrongFormat +
  ". Гасло не повинно починатись, закінчуватись пробілом чи містити більше одного пробілу поспіль!";

export const incorrectAppeal =
  wrongFormat +
  ". Заява не повинна починатись, закінчуватись пробілом чи містити більше одного пробілу поспіль!";

export const incorrectName =
  wrongFormat +
  ". Назва не повинна починатись чи закінчуватись пробілом або містити більше одного пробілу поспіль!";

export const incorrectCityName =
  wrongFormat +
  ". Кожне слово назви повинне починатись з великої літери. Назва може містити кириличні літери, пробіл, тире чи апостроф. Назва не повинна починатись, закінчуватись пробілом чи містити більше одного пробілу поспіль!";

export const incorrectClubName =
  wrongFormat +
  ". Назва повинна містити кириличні літери, цифри та знаки пунктуації. Назва не повинна починатись, закінчуватись пробілом чи містити більше одного пробілу поспіль!";

export const incorrectPhone = wrongFormat + "  телефонного номера";

export const incorrectStreet =
  wrongFormat +
  ". Назва може містити лише кириличні літери, цифри, крапку апостроф чи тире. Назва не повинна починатись, закінчуватись пробілом чи містити більше одного пробілу поспіль!";

export const incorrectHouseNumber =
  wrongFormat +
  ". Номер будинку може містити лише цифри, кириличні літери, дріб, та не повинен починатись з нуля чи містити пробілів!";

export const incorrectOficeNumber =
  wrongFormat +
  ". Номер офісу/квартири може містити лише цифри, кириличні літери, дріб, та не повинен починатись з нуля чи містити пробілів!";

export const incorrectData = wrongFormat + "  дати";

export const onlyPositiveNumber = `Поле не може бути від'ємним`;

export const minLength = (len: number) => {
  return `Мінімальна довжина - ${len} символів`;
};

export const maxLength = (len: number) => {
  return `Максимальна довжина - ${len} символів`;
};

export const maxNumber = (maxLen: number) => {
  return `Значення має бути менше або дорівнювати ${maxLen}`;
};

export const minNumber = (minLen: number) => {
  return `Значення має бути більше або дорівнювати ${minLen}`;
};

export const inputOnlyWhiteSpaces = () => {
  return `Поле не може містити лише порожні символи`;
};

export const inputWhiteSpacesAtTheBeginning = (name: string) => {
  return `${name} не може починатися з порожнього символу`;
};

export const tryAgain = "Щось пішло не так. Спробуйте ще раз.";

export const ReportAlreadyExists = "Звіт вже існує.";

export const ReportNotFound =
  "За наданими параметрами не було знайдено жодного звіту.";

export const successfulCreateAction = (name: string, itemName?: string) => {
  return (
    <div style={{ wordBreak: "break-word" }}>
      {itemName
        ? `${name} ${itemName} успішно створено`
        : `${name} успішно створено`}{" "}
    </div>
  );
};

export const successfulEditAction = (name: string, itemName?: string) => {
  return (
    <div style={{ wordBreak: "break-word" }}>
      {itemName
        ? `${name} ${itemName} успішно змінено`
        : `${name} успішно змінено`}{" "}
    </div>
  );
};

export const successfulDeleteAction = (name: string, itemName?: string) => {
  return (
    <div style={{ wordBreak: "break-word" }}>
      {itemName
        ? `${name} ${itemName} успішно видалено`
        : `${name} успішно видалено`}{" "}
    </div>
  );
};

export const successfulUpdateAction = (name: string, itemName?: string) => {
  return (
    <div style={{ wordBreak: "break-word" }}>
      {itemName
        ? `${name} ${itemName} успішно оновлено`
        : `${name} успішно оновлено`}{" "}
    </div>
  );
};

export const successfulConfirmedAction = (name: string, itemName?: string) => {
  return itemName
    ? `${name} ${itemName} успішно затверджено`
    : `${name} успішно затверджено`;
};

export const successfulCancelAction = (name: string, itemName?: string) => {
  return itemName
    ? `${name} ${itemName} скасовано`
    : `${name} успішно скасовано`;
};

export const successfulArchiveAction = (name: string) => {
  return `${name} успішно заархівовано`;
};

export const successfulUnarchiveAction = (name: string) => {
  return `${name} успішно розархівовано`;
};

export const successfulAddDegree = () => {
  return `Ступінь було успішно додано`;
};

export const successfulAddUserToCity = (cityName: string) => {
  return `Користувача було успішно додано до станиці ${cityName}`;
};

export const successfulDeleteDegree = () => {
  return `На жаль ступеня було позбавлено`;
};

export const failArchiveAction = (name: string) => {
  return `Не вдалось архівувати ${name} `;
};

export const failGetAction = (name: string) => {
  return `Не вдалося завантажити ${name}`;
};

export const failApproveAction = () => {
  return `Будь ласка, зачекайте`;
};

export const failCreateAction = (name: string) => {
  return `Не вдалося створити ${name}`;
};

export const failEditAction = (name: string) => {
  return `Не вдалося змінити ${name}`;
};

export const failDeleteAction = (name: string) => {
  return `Не вдалося видалити ${name}`;
};

export const failDeleteUser = `Не вдалося видалити користувача, бо в системі міститься пов'язана з ним важлива інформація.`;

export const failUpdateAction = (name: string) => {
  return `Не вдалося оновити ${name}`;
};

export const shouldContain = (items: string) => {
  return `Поле повинно містити ${items}`;
};

export const fileIsUpload = (name?: string) => {
  return (
    <div style={{ wordBreak: "break-word" }}>
      {name ? `${name} завантажено` : `Файл завантажено`}{" "}
    </div>
  );
};

export const fileIsAdded = (name?: string) => {
  return name ? `${name} завантажено` : `Файл успішно додано`;
};

export const fileIsNotUpload = (name?: string) => {
  return name
    ? `Проблема з завантаженням ${name}`
    : `Проблема з завантаженням файлу`;
};

export const fileIsEmpty = (name?: string) => {
  return name
    ? `Файл порожній ${name}`
    : `Ви намагаєтесь завантажити порожній файл`;
};

export const isNotChosen = (name: string) => {
  return `${name} не вибрано`;
};

export const possibleFileExtensions = (items: string) => {
  return `Можливі розширення файлів: ${items}`;
};

export const fileIsTooBig = (maxSize: number) => {
  return `Розмір файлу перевищує ${maxSize} Мб`;
};
