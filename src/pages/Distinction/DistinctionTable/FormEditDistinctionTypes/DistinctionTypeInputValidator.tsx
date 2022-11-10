import { Rule } from "antd/lib/form";
import {
  emptyInput,
  inputWhiteSpacesAtTheBeginningAndTheEnd,
  maxLength,
} from "../../../../components/Notifications/Messages";

const inputMaxLenght = 200;

const DistinctionTypeInputValidator: Rule[] = [
  {
    required: true,
    message: emptyInput(),
  },
  {
    pattern: /^\S.*\S$/,
    message: inputWhiteSpacesAtTheBeginningAndTheEnd("Відзначення"),
  },
  {
    max: inputMaxLenght,
    message: maxLength(inputMaxLenght),
  },
];

export default DistinctionTypeInputValidator;
