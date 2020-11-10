export const checkEmail = (role: object, value: string, callback:any) => {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (value.length === 0) {
      return callback('');
    }
    if (reg.test(value) === false) {
        return callback('Неправильний формат електронної пошти');
    }
      return callback();
  };

  export const checkNameSurName = (role: object, value: string, callback:any) => {
    const reg = /^[a-zA-Zа-яА-ЯІіЄєЇїҐґ']{1,25}((\s+|-)[a-zA-Zа-яА-ЯІіЄєЇїҐґ']{1,25})*$/;
      if (value.length === 0) {
        return callback('');
      }
      if (reg.test(value) === false) {
        return callback('Дане поле повинне містити тільки літери та бути коротшим за 25 символів');
      }
      return callback();
  };
  
  export const checkPhone = (role: object, value: string, callback: any) => {
    const reg = /^((\+?3)?8)?((0\(\d{2}\)?)|(\(0\d{2}\))|(0\d{2}))\d{7}$/;
    if (reg.test(value) === false) {
      return callback('Дане поле не є номером телефону');
    }
    if (value.length === 0) {
        return callback('');
    }
    if (reg.test(value) === false) {
      return callback('Дане поле повинне містити тільки літери');
    }
    return callback();
  };

  
  export const checkPassword = (role: object, value: string, callback:any) => {
    const reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/;
    if(value.length > 0)
    {
      if (value.length < 8)
      {
        return callback('Мінімальна допустима довжина - 8 символів');
      }
      if (reg.test(value) === false) 
      {
        return callback('Пароль повинен містити літери, цифри та знаки');
      }
    }
      return callback();
  };