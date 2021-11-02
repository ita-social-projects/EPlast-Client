import{
    emptyInput,
    maxLength,
    onlyPositiveNumber,
    incorrectPhone,
    incorrectEmail,
    incorrectCityName,
    incorrectClubName,
    incorrectStreet,
    incorrectHouseNumber,
    incorrectOficeNumber,
    incorrectSlogan,
    incorrectAppeal,
    inputOnlyWhiteSpaces,
    incorrectName,
} from "../../components/Notifications/Messages"
  
export const descriptionValidation = ({
    Appeal: [
        {
            pattern: /^\S*((?=(\S+))\2\s?)+$/,
            message: incorrectAppeal
        },
        {
            max: 1000,
            message: maxLength(1000),
        }, 
        {
            required: true,
            message: emptyInput(),
        },   
    ],
    Name: [
        {
            pattern: /^\S*((?=(\S+))\2\s?)+$/,
            message: incorrectName
        },
        {
            max: 50,
            message: maxLength(50),
        },    
        {
            required: true,
            message: emptyInput(),
        },   
    ],
    CityName: [
        {
            pattern: /^(([А-ЯҐЄІЇ][а-яґєії]*'?[а-яґєії]*){1}(?:[\s\-])?)*$/,
            message: incorrectCityName
        },
        {
            max: 50,
            message: maxLength(50),
        },
        {
            required: true,
            message: emptyInput(),
        },
    ],
    RegionName: [
        {
            pattern: /^(([А-ЯҐЄІЇ][а-яґєії]*'?[а-яґєії]*){1}(?:[\s\-])?)*$/,
            message: incorrectCityName
        },
        {
            max: 50,
            message: maxLength(50),
        },
        {
            required: true,
            message: emptyInput(),
        }
    ],
    ClubName: [
        {
            pattern: /^\S*((?=([^\sA-Za-z]+))\2\s?)+$/,
            message: incorrectClubName
        },
        {
            required: true,
            message: emptyInput(),
        },
        {
            max: 200,
            message: maxLength(200),
        }
    ],
    Slogan: [
        {
            pattern: /^\S*((?=(\S+))\2\s?)+$/,
            message: incorrectSlogan
        },
        {
            max: 500,
            message: maxLength(500),
        },
    ],
    RegionEmail: [
        {
            pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            message: incorrectEmail,
        },
        {
            max: 50,
            message: maxLength(50),
        },
        {
            required: true,
            message: emptyInput(),
        }
    ],
    Email: [
        {
            pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            message: incorrectEmail,
        },
        {
            max: 50,
            message: maxLength(50),
        },
        {
            required: true,
            message: emptyInput(),
        },   
    ],
    Phone: {
        pattern: /^((\+?3)?8)?((0\(\d{2}\)?)|(\(0\d{2}\))|(0\d{2}))-\d{3}-\d{2}-\d{2}$/,
        message: incorrectPhone,
    },
    Link: {
        max: 256,
        message: maxLength(256),
    },
    Street: [
        {
            pattern: /^\S*((?=([А-ЯҐЄІЇа-яґєії\d]+[\.\-']?))\2\s?)+$/,
            message: incorrectStreet
        },
        {
            required: true,
            message: emptyInput(),
        },
        {
            max: 50,
            message: maxLength(50),
        },
    ],
    houseNumber: [
        {
            pattern: /^[1-9]{1}\d*\/?[А-ЯҐЄІЇа-яґєії]?([1-9]{1}\d*)?$/,
            message: incorrectHouseNumber
        },
        {
            required: true,
            message: emptyInput(),
        },
        {
            max: 5,
            message: maxLength(5),
        },
    ],
    officeNumber: [
        {
            pattern: /^[1-9]{1}\d*\/?[А-ЯҐЄІЇа-яґєії]?([1-9]{1}\d*)?$/,
            message: incorrectOficeNumber
        },
        {
            required: true,
            message: emptyInput(),
        },
        {
            max: 5,
            message: maxLength(5),
        },
    ],
    postIndex: [
        {
            required: true,
            message: emptyInput()
        },
        {
            validator: (_ : object, value : string) => 
            value == undefined || String(value).length == 0
                ? Promise.resolve()
                : String(value).length == 5
                    ? Promise.resolve()
                    : Promise.reject(
                        "Довжина поштового індексу - 5 символів!"
                        )
        },
        {
            validator: (_ : object, value : string) => 
            parseInt(value) >= 0 ||
                value == null ||
                String(value).length == 0
                ? Promise.resolve()
                : Promise.reject(
                    onlyPositiveNumber
                    )
        },
    ],
    Required: {
        required: true,
        message: emptyInput(),
    },
    Inputs: [
        {
            pattern:  /^(\s*\S+\s*){1,50}$/,
            message: inputOnlyWhiteSpaces(),
        },
        { 
            max: 50, 
            message: maxLength(50),
        },
        {
            required: true,
            message: emptyInput(),
        },    
    ],
    DecisionAndDocumentName: [
        {
            pattern: /^\s*\S.*$/,
            message: inputOnlyWhiteSpaces(),
        },
        {
            max: 60, 
            message: maxLength(60),
        },
        {
            required: true,
            message: emptyInput(),
        },    
    ],
    Reporter: [
        {
            pattern: /^\s*\S.*$/,
            message: inputOnlyWhiteSpaces(),
        },
        {
            max: 100, 
            message: maxLength(100),
        },
        {
            required: true,
            message: emptyInput(),
        },    
    ],
    DescriptionAndQuestions: [
        {
            pattern:  /^(\s*\S+\s*){1,200}$/,
            message: inputOnlyWhiteSpaces(),
        },
        {
            max: 200, 
            message: maxLength(200),
        },
        {
            required: true,
            message: emptyInput(),
        },    
    ],
    Reason: [
        {
            pattern:  /^(\s*\S+\s*){1,500}$/,
            message: inputOnlyWhiteSpaces(),
        },
        {
            max: 500, 
            message: maxLength(500),
        },
        {
            required: true,
            message: emptyInput(),
        },    
    ],
    Description: [
        {
            pattern:  /^(\s*\S+\s*){1,1000}$/,
            message: inputOnlyWhiteSpaces(),
        },
        {
            max: 1000, 
            message: maxLength(1000),
        },
        {
            required: true,
            message: emptyInput(),
        },    
    ],
    DescriptionNotOnlyWhiteSpaces: [
        {
            pattern: /^\s*\S.*$/,
            message: inputOnlyWhiteSpaces(),
        },
        { 
            max: 1000, 
            message: maxLength(1000),
        }
    ],
    AdminType: [
        {
            pattern: /^\s*\S.*$/,
            message: inputOnlyWhiteSpaces(),
        },
        { 
            required: true,
            message: emptyInput(),
        },    
    ],
    DecisionTarget: [
        {
            max: 255, 
            message: maxLength(255),
        },
        {
            required: true,
            message: emptyInput(),
        },    
    ],
});

export const sameNameValidator = (org:string, array: string[]) => { 
    let foundString: string | undefined
    return {
        validator: (_ : object, value : string) => 
        value == undefined || String(value).length == 0
            ? Promise.resolve()
            : (foundString = array.find(x => (x.trim().toLowerCase()) === String(value).trim().toLowerCase())) === undefined
                ? Promise.resolve()
                : Promise.reject(org + ' з назвою \"' + String(foundString).trim() + '\" вже існує')
    } 
}
