import { checkEmail } from "../SignUp/verification";
import { emptyInput } from "../../components/Notifications/Messages";
import { Form, Steps, Button, Input, Select } from 'antd';
import { getCities } from "../../api/citiesApi";
import { NotificationType } from "../../api/NotificationBoxApi";
import { showUserFormerInfoModal } from "./UserRenewalModals";
import { useState, useEffect } from "react";
import Api from "../../api/api";
import City from "./Types/CityForRenewal";
import NotificationBoxApi from "../../api/NotificationBoxApi";
import notificationLogic from "../../components/Notifications/Notification";
import React from "react";
import Spinner from "../Spinner/Spinner";
import styles from "../UserRenewal/UserRenewal.module.css";
import UserRenewal from "./Types/UserRenewal";
import userRenewalsApi from "../../api/userRenewalsApi";

const { Step } = Steps;

const timeElapsed = Date.now();
const today = new Date(timeElapsed);

export default function () {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [current, setCurrent] = useState(0);
    const [userId, setUserId] = useState('');
    const [email, setEmail] = useState('');
    const [cities, setCities] = useState<City[]>([]);
    const [notificationTypes, setNotificationTypes] = useState<NotificationType[]>([]);
    const [cityId, setCityId] = useState(0);
    const [adminsIds, setAdminsIds] = useState<string[]>([]);
    const renewal: UserRenewal = ({
        id: 0,
        userId: userId,
        cityId: cityId,
        requestDate: today,
        approved: false
    });

    const next = () => {
        setCurrent(current + 1);
    };
    
    const validationSchema = {
        Email: [
            { required: true, message: emptyInput() },
            { validator: checkEmail },
        ]
    };

    const getNotificationTypes = async () => {
        setNotificationTypes(await NotificationBoxApi.getAllNotificationTypes());
    }

    const getCity = async () => {
        setLoading(true);
        try {
            const response = await getCities();
            let filteredCities = response.data.filter((item: City) => {
                return item.isActive === true;
            }).map((data: City) => {
                return data;
            });
            setCities(filteredCities);
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getNotificationTypes();
        getCity();
    }, []);

    const checkFormer = async (data: string) => {
        const response = await userRenewalsApi.checkFormer(data);
        if (response !== "") {
            setUserId(response)
            next();
        };
    };

    const handleCheckFormer = async () => {
        await checkFormer(email);
    };

    const handleSelectChange = (value: any) => {
        setCityId(value);
    };

    const sendRenewal = async (data: any) => {
        await userRenewalsApi.sendUserRenewal(data)
            .then(() => {
                if (adminsIds.length > 0) {
                    NotificationBoxApi.createNotifications(
                        adminsIds,
                        "Користувач надіслав запит на відновлення статусу",
                        notificationTypes[0].id,
                        "/renewals",
                        `${email}`
                    )
                };
                showUserFormerInfoModal("Запит надіслано!", "/signin");
            })
            .catch((error) => {
                if (error.response.data == "Cannot create renewal") {
                    showUserFormerInfoModal(`Неможливо надіслати запит! Зважте, що запит 
                    можна надсилати не частіше, ніж один раз на 10 днів!`, "/signin");
                } else {
                    showUserFormerInfoModal("Сталася помилка при надсиланні запиту. Спробуйте пізніше.", "/signin");
                }
            });
    };

    const handleSendRenewal = async () => {
        await sendRenewal(renewal);
    };

    const getAdminsIds = async (id: number) => {
        await Api.get(`Cities/AdminsIds/${id}`)
            .then((response) => {
                if (response.data !== "No Id,No Id") {
                    let admins: string[] = response.data.split(',');
                    for (let i = 0; i < admins.length; i++) {
                        if (admins[i] === "No Id") admins.splice(i, 1);
                    };
                    setAdminsIds(admins);
                };
            })
            .catch((error) => {
                notificationLogic("info", "Сталася помилка при зверненні до адміністрації міста");
            });
    };

    const handleCityChange = async () => {
        setLoading(true);
        try {
            await getAdminsIds(cityId);
            next();
        }
        finally {
            setLoading(false);
        }
    };

    const steps = [
        {
            title: 'Підтвердження',
            content:
                <div>
                    <div className={styles.renewalPasswordContainer}>
                        <h1>Відновлення статусу</h1>
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <h3>Введіть адресу електронної пошти, за якою ви мали доступ до сайту,
                            щоб підтвердити свій статус.</h3>
                    </div>
                    <Form
                        name="UserRenewalForm"
                        form={form}
                        onFinish={handleCheckFormer}
                    >
                        <Form.Item
                            name="Email"
                            rules={validationSchema.Email}
                        >
                            <Input
                                className={styles.renewalPasswordInput}
                                defaultValue={email}
                                placeholder="Електронна пошта"
                                onChange={e => setEmail(e.target.value)}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button htmlType="submit" id={styles.confirmButton}>
                                Надіслати
                            </Button>
                        </Form.Item>
                    </Form>
                </div>,
        },
        {
            title: 'Вибір станиці',
            content:
                <div>
                    <div className={styles.renewalPasswordContainer}>
                        <h1>Відновлення статусу</h1>
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <h3>Статус успішно підтверджено!</h3>
                        <h3>Оберіть станицю, до якої бажаєте доєднатися.</h3>
                    </div>
                    <Form
                        name="UserRenewalForm"
                        form={form}
                        onFinish={handleCityChange}
                    >
                        <Form.Item name="CityId" rules={[{ required: true, message: emptyInput() }]}>
                            <Select
                                placeholder="Станиця"
                                notFoundContent="Оберіть станицю"
                                showSearch
                                optionFilterProp="children"
                                onChange={handleSelectChange}
                                getPopupContainer={(triggerNode) => triggerNode.parentNode}>
                                {cities.map((item: any) => (<Select.Option key={item.id} value={item.id}> {item.name} </Select.Option>))}
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <Button htmlType="submit" id={styles.confirmButton}>
                                Обрати
                            </Button>
                        </Form.Item>
                    </Form>
                </div>,
        },
        {
            title: 'Завершення',
            content:
                <div>
                    <div className={styles.renewalPasswordContainer}>
                        <h1>Відновлення статусу</h1>
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <h3>Ви надсилаєте запит на відновлення статусу у Пласті! Процедура відновлення може тривати до 10 днів.
                            Протягом цього терміну надіслати новий запит буде неможливо!</h3>
                    </div>
                    <Form
                        name="UserRenewalForm"
                        form={form}
                        onFinish={handleSendRenewal}
                    >
                        <Button htmlType="submit" id={styles.confirmButton}>
                            Надіслати запит
                        </Button>
                    </Form>
                </div>,
        },
    ];

    return loading ? (<Spinner />) : (
        <div className={styles.mainContainerRenewal}>
            <Steps current={current}>
                {steps.map(item => (
                    <Step key={item.title} title={item.title} />
                ))}
            </Steps>
            <div className="steps-content">{steps[current].content}</div>
        </div>
    );
};