import{
    emptyInput,
    maxLength,
    onlyPositiveNumber,
    incorrectPhone,
    incorrectEmail,
    onlyWhiteSpaces,
  } from "../../components/Notifications/Messages"
  
  const notOnlyWhiteSpaces = /^\s*\S.*$/;

 export const descriptionValidation = {
    Name: [
        {
            required: true,
            message: emptyInput(),
        },
        {
            max: 50,
            message: maxLength(50),
        },
        { 
            pattern: notOnlyWhiteSpaces, 
            message:onlyWhiteSpaces() 
        },
    ],
    ClubName: [
        {
            required: true,
            message: emptyInput(),
        },
        {
            max: 200,
            message: maxLength(200),
        }
    ],
    Slogan:
    {
        max: 500,
        message: maxLength(500),
    },
    Description:
    {
        max: 1000,
        message: maxLength(1000),
    },
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
    }
    
  };