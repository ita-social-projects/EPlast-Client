import{
    emptyInput,
    maxLength,
    onlyPositiveNumber,
    incorrectPhone,
    incorrectEmail,
    incorrectCityName,
    incorrectClubName,
    incorrectDescription,
    incorrectStreet,
    incorrectHouseNumber,
    incorrectOficeNumber,
    incorrectSlogan,
    incorrectAppeal,
    inputOnlyWhiteSpaces,
  } from "../../components/Notifications/Messages"

 export const descriptionValidation = {
    Appeal: [
        {
            pattern: /^\S*((?=(\S+))\2\s?)+$/,
            message: incorrectAppeal
        },
        {
            max: 1000,
            message: maxLength(1000),
        },    
    ],
    Name: [
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
    Slogan:[
        {
            pattern: /^\S*((?=(\S+))\2\s?)+$/,
            message: incorrectSlogan
        },
        {
            max: 500,
            message: maxLength(500),
        },    
    ],
    Description: [
        {
            pattern: /^\S*((?=(\S+))\2\s?)+$/,
            message: incorrectDescription
        },
        {
            max: 1000,
            message: maxLength(1000),
        },    
    ],
    RegionEmail: [
        {
            pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/,
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
            pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/,
            message: incorrectEmail,
        },
        {
            max: 50,
            message: maxLength(50),
        }
    ],
    Phone: 
        {
            pattern: /^((\+?3)?8)?((0\(\d{2}\)?)|(\(0\d{2}\))|(0\d{2}))-\d{3}-\d{2}-\d{2}$/,
            message: incorrectPhone,
        },
    Link:
        {
            max: 256,
            message: maxLength(256),
        },
    Street:
    [
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
    houseNumber:
    [
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
    officeNumber:
    [
        {
            pattern: /^[1-9]{1}\d*\/?[А-ЯҐЄІЇа-яґєії]?([1-9]{1}\d*)?$/,
            message: incorrectOficeNumber
        },
        {
            required: true,
            max: 5,
            message: maxLength(5),
        },
    ],
    postIndex:
    [
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
    Required:
    {
        required: true,
        message: emptyInput(),
    },
    Inputs: 
    [
        {
            pattern: /^\s*\S.*$/,
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
    DescriptionAndQuestions:
    [
        {
            pattern: /^\s*\S.*$/,
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
  };