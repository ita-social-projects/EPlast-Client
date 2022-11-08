import { Rule } from "antd/lib/form";
import { 
    emptyInput, 
    inputWhiteSpacesAtTheBeginningAndTheEnd, 
    maxLength 
} from "../../../../components/Notifications/Messages";

const inputMaxLength = 200;

export const eventCategoryInputValidator: Rule[] = [
    {
        required: true,
        message: emptyInput()
    },
    {
        pattern: /^\S.*\S$/,
        message: inputWhiteSpacesAtTheBeginningAndTheEnd("Категорія")
    },
    {
        max: inputMaxLength,
        message: maxLength(inputMaxLength)
    }
];