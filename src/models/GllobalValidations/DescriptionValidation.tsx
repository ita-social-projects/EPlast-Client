  export const descriptionValidation = {
    Name: [
        {
            required: true,
            message: "Це поле є обов'язковим",
        },
        {
            max: 50,
            message: "Максимальна довжина - 50 символів!",
        }
    ],
    Description:
    {
        max: 1000,
        message: "Максимальна довжина - 1000 символів!",
    },
    RegionEmail: [
        {
            pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/,
            message: "Неправильний формат електронної пошти!",
        },
        {
            max: 50,
            message: "Максимальна довжина - 50 символів!",
        },
        {
            required: true,
            message: "Це поле має бути заповненим",
        }
    ],
    Email: [
        {
            pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/,
            message: "Неправильний формат електронної пошти!",
        },
        {
            max: 50,
            message: "Максимальна довжина - 50 символів!",
        }
    ],
    Phone: 
        {
            pattern: /^((\+?3)?8)?((0\(\d{2}\)?)|(\(0\d{2}\))|(0\d{2}))-\d{3}-\d{2}-\d{2}$/,
            message: "Невірно вказаний номер",
        },
    Link:
        {
            max: 256,
            message: "Максимальна довжина - 256 символів!",
        },
    Street:
    [
        {
            required: true,
            message: "Це поле має бути заповненим",
        },
        {
            max: 50,
            message: "Максимальна довжина - 50 символів!",
        },
    ],
    houseNumber:
    [
        {
            required: true,
            message: "Це поле має бути заповненим",
        },
        {
            max: 5,
            message: "Максимальна довжина - 5 символів!",
        },
    ],
    officeNumber:
    [
        {
            max: 5,
            message: "Максимальна довжина - 5 символів!",
        },
    ],
    postIndex:
    [
        {
            validator: (_ : object, value : string) => 
            String(value).length == 5
                ? Promise.resolve()
                : Promise.reject(
                    `Довжина поштового індексу - 5 символів!`
                    )
        },
        {
            validator: (_ : object, value : string) => 
            parseInt(value) >= 0 ||
                value == null ||
                String(value).length == 0
                ? Promise.resolve()
                : Promise.reject(
                    `Поле не може бути від'ємним`
                    )
        },
    ],
    Required:
    {
        required: true,
        message: "Це поле має бути заповненим",
    }
    
  };