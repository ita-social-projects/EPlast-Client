export const checkEmail = (role: object, value: string, callback:any) => {
  const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (value.length === 0) {
    return callback('');
  }
  if (reg.test(value) === false) {
      return callback('Введене поле не є правильним для електронної пошти');
  }
    return callback();
};

export const checkNameSurName = (role: object, value: string, callback:any) => {
  const reg = /^[a-zA-Zа-яА-ЯІіЄєЇїҐґ']{1,20}((\s+|-)[a-zA-Zа-яА-ЯІіЄєЇїҐґ']{1,20})*$/;
    if (value.length === 0) {
      return callback('');
    }
    if (reg.test(value) === false) {
      return callback('Дане поле повинне містити тільки літери');
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

