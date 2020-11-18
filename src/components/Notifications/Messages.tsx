import React from 'react';

export const incorrectEmail = 'Неправильний формат електронної пошти'; 

export const emptyInput = 'Поле не може бути пустим'; 

export const incorrectPhone = 'Дане поле не є номером телефону'; 

export const minLength = (len:number)=>{
    return `Мінімальна допустима довжина - ${len} символів`
}; 

export const tryAgain = 'Спробуйте ще раз'; 

export const successfulCreateAction = (name:string, itemName?:string)=>{
    return itemName ? `${name} ${itemName} успішно створено` : `${name} успішно створено`;
}; 
export const successfulEditAction = (name:string, itemName?:string)=>{
    return itemName ? `${name} ${itemName} успішно змінено` : `${name} успішно змінено`;
}; 
export const successfulDeleteAction = (name:string, itemName?:string)=>{
    return itemName ? `${name} ${itemName} успішно видалено` : `${name} успішно видалено`;
}; 