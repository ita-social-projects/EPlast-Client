import {
  emptyInput,
  inputWhiteSpacesAtTheBeginning,
  maxLength,
} from "../../../../components/Notifications/Messages";

const inputMaxLenght = 200;

const DistinctionTypeInputValidator = [
  {
    required: true,
    message: emptyInput(),
  },
  {
    pattern: /^\S.*$/,
    message: inputWhiteSpacesAtTheBeginning("Відзначення"),
  },
  {
    max: inputMaxLenght,
    message: maxLength(inputMaxLenght),
  },
];

export default DistinctionTypeInputValidator;
