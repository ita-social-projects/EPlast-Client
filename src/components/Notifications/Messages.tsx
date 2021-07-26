import React from 'react';

export const incorrectEmail = 'Неправильний формат електронної пошти'; 

export const emptyInput = (name?:string)=>{
    return name ? `Поле ${name} є обов'язковим` : `Поле є обов'язковим`;
}; 

export const incorrectPhone = 'Неправильний формат телефонного номера';

export const incorrectData = 'Ви вказали неправильний формат дати'; 

export const onlyPositiveNumber = `Поле не може бути від'ємним`; 

export const minLength = (len:number)=>{
    return `Мінімальна довжина - ${len} символів`
}; 

export const maxLength = (len:number)=>{
    return `Максимальна довжина - ${len} символів`
};

export const maxNumber = (maxLen:number)=>{
    return `Значення має бути менше або дорівнювати ${maxLen}`
}; 

export const minNumber = (minLen:number)=>{
    return `Значення має бути більше або дорівнювати ${minLen}`
};

export const tryAgain = 'Щось пішло не так. Спробуйте ще раз.'; 

export const ReportAlreadyExists = 'Звіт вже існує.';

export const successfulCreateAction = (name:string, itemName?:string)=>{
    return itemName ? `${name} ${itemName} успішно створено` : `${name} успішно створено`;
}; 

export const successfulEditAction = (name:string, itemName?:string)=>{
    return itemName ? `${name} ${itemName} успішно змінено` : `${name} успішно змінено`;
}; 

export const successfulDeleteAction = (name:string, itemName?:string)=>{
    return itemName ? `${name} ${itemName} успішно видалено` : `${name} успішно видалено`;
}; 

export const successfulUpdateAction = (name:string, itemName?:string)=>{
    return itemName ? `${name} ${itemName} успішно оновлено` : `${name} успішно оновлено`;
}; 

export const successfulConfirmedAction = (name:string, itemName?:string)=>{
    return itemName ? `${name} ${itemName} успішно затверджено` : `${name} успішно затверджено`;
}; 

export const successfulCancelAction = (name:string, itemName?:string)=>{
    return itemName ? `${name} ${itemName} скасовано` : `${name} скасовано`;
}; 

export const successfulAddDegree = ()=>{
    return `Вам було надано новий ступінь `;
}; 

export const successfulDeleteDegree = ()=>{
    return `На жаль Ваc було позбавлено ступеня `;
};

export const failCreateAction = (name:string)=>{
    return `Не вдалося створити ${name}`;
}; 

export const failEditAction = (name:string)=>{
    return `Не вдалося змінити ${name}`;
}; 

export const failDeleteAction = (name:string)=>{
    return `Не вдалося видалити ${name}`;
}; 

export const failUpdateAction = (name:string)=>{
    return `Не вдалося оновити ${name}`;
}; 

export const shouldContain = (items:string)=>{
    return `Поле повинно містити ${items}`;
};

export const fileIsUpload = (name?:string)=>{
    return name ? `${name} завантажено` : `Файл завантажено`;
}; 

export const fileIsAdded= (name?:string)=>{
    return name ? `${name} завантажено` : `Файл успішно додано`;
}; 

export const fileIsNotUpload = (name?:string)=>{
    return name ? `Проблема з завантаженням ${name}` : `Проблема з завантаженням файлу`;
}; 

export const fileIsEmpty = (name?:string)=>{
    return name ? `Файл порожній ${name}` : `Ви намагаєтесь завантажити порожній файл`;
};

export const isNotChosen = (name:string)=>{
    return `${name} не вибрано`;
}; 

export const possibleFileExtensions = (items:string)=>{
    return `Можливі розширення файлів: ${items}`;
}; 

export const fileIsTooBig = (maxSize:number)=>{
    return `Розмір файлу перевищує ${maxSize} Мб`
}; 