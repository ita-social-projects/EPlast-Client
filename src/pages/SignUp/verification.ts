import {
  incorrectEmail,
  emptyInput,
  incorrectPhone,
  minLength,
  shouldContain,
} from "../../components/Notifications/Messages";
import UkraineOblasts from "../../models/Oblast/UkraineOblasts";

export const checkEmail = (role: object, value: string, callback: any) => {
  const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (value.length === 0) {
    return callback("");
  }
  if (reg.test(value) === false) {
    return callback(incorrectEmail);
  }
  return callback();
};

export const checkNameSurName = (
  role: object,
  value: string,
  callback: any
) => {
  const reg = /^[а-яА-ЯІіЄєЇїҐґ'-]{1,20}((\s+|-))*$/;

  if (value === null || value === undefined) {
    return callback();
  }
  if (value.length !== 0 && reg.test(value) === false) {
    return callback(
      shouldContain("тільки кириличні літери та бути коротшим за 20 символів")
    );
  }
  return callback();
};

export const checkOblastIsSpecified = (
  role: object,
  value: string,
  callback: any
) => {
  if (Number(value) === UkraineOblasts.NotSpecified) {
    return callback(
      "Оберіть область"
    );
  }
  return callback();
};

export const checkPhone = (role: object, value: string, callback: any) => {
  const reg = /^((\+?3)?8)?((0\(\d{2}\)?)|(\(0\d{2}\))|(0\d{2}))-\d{3}-\d{2}-\d{2}$/;
  if (reg.test(value) === false) {
    return callback(incorrectPhone);
  }
  if (value.length === 0) {
    return callback(emptyInput());
  }
  return callback();
};

export const checkPassword = (role: object, value: string, callback: any) => {
  const reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/;
  if (value.length > 0) {
    if (value.length < 8) {
      return callback(minLength(8));
    }
    if (reg.test(value) === false) {
      return callback(
        shouldContain(
          "хоча б одну велику і малу латинську літери, цифри та знаки"
        )
      );
    }
  }
  return callback();
};

export const checkAddress = (
  role: object,
  value: string,
  callback: any
) => {
  if (value === null || value === undefined) {
    return callback();
  }
  const reg = /^[0-9а-яА-ЯІіЄєЇїҐґ'., -/\\]{1,50}(\s+|-)*$/;
  if ((value.length !== 0 && reg.test(value) === false) || value.trim().length === 0) {
    return callback(
      shouldContain("тільки кириличні літери та бути коротшим за 50 символів")
    );
  }
  return callback();
};

export const checkFacebookLink = (
  role: object,
  value: string,
  callback: any
) => {
  if (value === null || value === undefined) {
    return callback();
  }
  const regNew = /^(https?\:)?(\/\/)(www[\.])?(facebook.com\/)?(?:profile.php\?id=)?([0-9a-zA-Z.]{1,25})[\/]?$/;
  if (value.length !== 0 && regNew.test(value) === false) {
    return callback(
      shouldContain("посилання на особисту сторінку facebook")
    );
  }
  return callback();
};

export const checkTwitterLink = (
  role: object,
  value: string,
  callback: any
) => {
  if (value === null || value === undefined) {
    return callback();
  }
  const reg: RegExp = /^(https?\:)?(\/\/)(www[\.])?(twitter.com\/)([a-zA-Z0-9_.]{1,25})[\/]?$/;
  if ((value.length !== 0 && reg.test(value) === false)) {
    return callback(
      shouldContain("посилання на особисту сторінку twitter")
    );
  }
  return callback();
};

export const checkInstagramLink = (
  role: object,
  value: string,
  callback: any
) => {
  if (value === null || value === undefined) {
    return callback();
  }
  const reg = /^(https?\:)?(\/\/)(www[\.])?(instagram.com\/)([a-zA-Z0-9_.]{1,25})[\/]?$/;
  if ((value.length !== 0 && reg.test(value) === false)) {
    return callback(
      shouldContain("посилання на особисту сторінку instagram")
    );
  }
  return callback();
};