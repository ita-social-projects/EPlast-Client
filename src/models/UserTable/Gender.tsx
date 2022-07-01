export default class Gender {
  name: string;

  constructor() {
    this.name = "";
  }
}

export enum GenderNameEnum {
  NotSpecified = "Не маю бажання вказувати",
  Male = "Чоловік",
  Female = "Жінка",
  UnwillingToChoose = "Не маю бажання вказувати",
}

export enum GenderIdEnum {
  NotSpecified = 0,
  Male = 1,
  Female = 2,
  UnwillingToChoose = 7
}

export const genderRecords: Record<GenderIdEnum, GenderNameEnum> = {
  [GenderIdEnum.NotSpecified]: GenderNameEnum.NotSpecified,
  [GenderIdEnum.Male]: GenderNameEnum.Male,
  [GenderIdEnum.Female]: GenderNameEnum.Female,
  [GenderIdEnum.UnwillingToChoose]: GenderNameEnum.UnwillingToChoose
};