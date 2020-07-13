export const checkField = (role: object, value: string, callback:any) => {
    const reg = /^[a-zA-Zа-яА-ЯІіЄєЇїҐґ'.` ]{0,30}((\s+|-)[a-zA-Zа-яА-ЯІіЄєЇїҐґ'.` ]{0,30})*$/;
      if (value.length === 0) {
        return callback('');
      }
      if (reg.test(value) === false) {
        return callback('Дане поле повинне містити тільки літери');
      }
      return callback();
  };
  
export const checkAdress = (role: object, value: string, callback:any) => {
    const reg = /^[a-zA-Zа-яА-ЯІіЄєЇїҐґ'.`0-9.-]{0,30}((\s+|-)[a-zA-Zа-яА-ЯІіЄєЇїҐґ'.`0-9.-]{0,30})*$/;
      if (value.length === 0) {
        return callback('');
      }
      if (reg.test(value) === false) {
        return callback('Дане поле повинне містити тільки літери та цифри');
      }
      return callback();
  };