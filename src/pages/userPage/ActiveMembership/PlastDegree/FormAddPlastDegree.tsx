import React, { useEffect, useRef, useState } from 'react';
import { Form, Select, Button, DatePicker } from 'antd';
import activeMembershipApi, { PlastDegree, UserPlastDegreePost } from '../../../../api/activeMembershipApi';
import classes from "./FormAddPlastDegree.module.css"
import NotificationBoxApi from '../../../../api/NotificationBoxApi';
import { emptyInput, successfulAddDegree } from "../../../../components/Notifications/Messages"
import notificationLogic from "../../../../components/Notifications/Notification"

type FormAddPlastDegreeProps = {
    availablePlastDegree: Array<PlastDegree>;
    setVisibleModal: (visibleModal: boolean) => void;
    handleAddDegree: () => void;
    resetAvailablePlastDegree: () => Promise<void>;
    userId: string;
    isCityAdmin?: boolean;
    cancel: boolean;
};

const FormAddPlastDegree = ({
    setVisibleModal,
    userId,
    availablePlastDegree,
    handleAddDegree,
    isCityAdmin,
    resetAvailablePlastDegree,
    cancel
}: FormAddPlastDegreeProps) => {
    const [form] = Form.useForm();
    const visiableDegree = useRef<boolean>(false);
    const [filtredDegrees, setFiltredDegrees] = useState<Array<PlastDegree>>([]);

    const handleFinish = async (info: any) => {
        const plastDegreeId = filtredDegrees.find(item => item.name === "Пластприят")?.id;
        info.plastDegree = plastDegreeId ? plastDegreeId : info.plastDegree;
        const userPlastDegreePost: UserPlastDegreePost = {
            plastDegreeId: info.plastDegree,
            dateStart: info.datepickerStart._d,
            userId: userId
        };
        setVisibleModal(false);
        visiableDegree.current = false;
        await activeMembershipApi.postUserPlastDegree(userPlastDegreePost);
        handleAddDegree();
        form.resetFields();
        resetAvailablePlastDegree();
        await NotificationBoxApi.createNotifications(
            [userId],
            `Вам було надано новий ступінь в `,
            NotificationBoxApi.NotificationTypes.UserNotifications,
            `/userpage/activeMembership/${userId}`,
            `Дійсному членстві`
        );
        notificationLogic("success", successfulAddDegree());
    }

    const handleOnChange = (value: any) => {
        if (value === "Пластприят") {
            visiableDegree.current = false;
            setFiltredDegrees(availablePlastDegree.filter(item => item.name === "Пластприят"));
        } else if (value === "Улад Старшого Пластунства") {
            visiableDegree.current = true;
            setFiltredDegrees(availablePlastDegree.filter(item => item.name.includes("Старш")));
        } else {
            visiableDegree.current = true;
            setFiltredDegrees(availablePlastDegree.filter(item => item.name.includes("сеніор")));
        }
    }
    useEffect(() => {
        if (cancel) { form.resetFields(); visiableDegree.current = false; }
    }, [ cancel]);


    return <Form
        name="basic"
        onFinish={handleFinish}
        form={form}>
        <Form.Item
            name="plastUlad"
            rules={[{ required: true, message: emptyInput() }]}>
            <Select
                onChange={(value) => handleOnChange(value)}
                placeholder={"Оберіть Улад"}
            >
                {!isCityAdmin && availablePlastDegree.find(item => item.name === "Пластприят") && <Select.Option value="Пластприят">Пластприят</Select.Option>}
                {availablePlastDegree.find(item => item.name.includes("Старш")) && <Select.Option value="Улад Старшого Пластунства">Улад Старшого Пластунства</Select.Option>}
                {availablePlastDegree.filter(item => item.name.includes("сеніор")) && <Select.Option value="Улад Пластового Сеніорату">Улад Пластового Сеніорату</Select.Option>}
            </Select>
        </Form.Item>
        {visiableDegree.current &&
            <Form.Item
                name="plastDegree"
                rules={[{ required: visiableDegree.current, message: emptyInput() }]}>
                <Select
                    placeholder={"Оберіть ступінь"}
                >{
                        filtredDegrees.map(apd => {
                            if ((isCityAdmin && (apd.id == 1 || apd.id == 7)) || !isCityAdmin)
                                return (<Select.Option key={apd.id} value={apd.id}>{apd.name}</Select.Option>)
                        }
                        )}</Select>
            </Form.Item>}
        <Form.Item
            name="datepickerStart"
            rules={[{ required: true, message: emptyInput() }]}>
            <DatePicker format="DD.MM.YYYY"
                className={classes.selectField}
                placeholder="Дата надання ступеню"
            />
        </Form.Item>
        <Form.Item>
            <Button
                className={classes.cardButton}
                type="primary" htmlType="submit"
            >
                Додати
            </Button>
        </Form.Item>
    </Form>
}
export default FormAddPlastDegree;