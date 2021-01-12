import React, { useEffect, useState } from 'react';
import { Form, Select, Button, DatePicker, Checkbox, Switch, AutoComplete } from 'antd';
import activeMembershipApi, { PlastDegree, UserPlastDegreePost, UserPlastDegree } from '../../../../api/activeMembershipApi';
import classes from "./FormAddPlastDegree.module.css"
import NotificationBoxApi from '../../../../api/NotificationBoxApi';
import { emptyInput } from "../../../../components/Notifications/Messages"
import { setNestedObjectValues } from 'formik';
import { info } from 'console';
import { SelectValue } from 'antd/lib/select';
import { OptionsType, OptionData, OptionGroupData } from 'rc-select/lib/interface';

type FormAddPlastDegreeProps = {
    availablePlastDegree: Array<PlastDegree>;
    setVisibleModal: (visibleModal: boolean) => void;
    handleAddDegree: () => void;
    resetAvailablePlastDegree: () => Promise<void>;
    userId: string;
};

const FormAddPlastDegree = ({
    setVisibleModal,
    userId,
    availablePlastDegree,
    handleAddDegree,
    resetAvailablePlastDegree }: FormAddPlastDegreeProps) => {
    const [form] = Form.useForm();
    const [isChecked, setIsChecked] = useState<boolean>(false);
    const [filtredDegrees, setFiltredDegrees] = useState<Array<PlastDegree>>([]);
    const handleFinish = async (info: any) => {
        const userPlastDegreePost: UserPlastDegreePost = {
            plastDegreeId: info.plastDegree,
            dateStart: info.datepickerStart._d,
            dateFinish: null,
            isCurrent: isChecked,
            userId: userId
        };
        await activeMembershipApi.postUserPlastDegree(userPlastDegreePost);
        setVisibleModal(false);

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
    }

    const handleOnChange = (value: any) => {
        if (value === "Пласт прият") {
            setFiltredDegrees(availablePlastDegree.filter(item => item.name === "Пласт прият"));
        } else if (value === "Улад Старшого Пластунства") {
            setFiltredDegrees(availablePlastDegree.filter(item => item.name.includes("Старш")));
        } else {
            setFiltredDegrees(availablePlastDegree.filter(item => item.name.includes("сеніор")));
        }
    }
    useEffect(() => {
    }, [filtredDegrees]);

    const handleSwitchChange = (e: boolean) => setIsChecked(e);
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
                <Select.Option value="Пласт прият">Пласт прият</Select.Option>
                <Select.Option value="Улад Старшого Пластунства">Улад Старшого Пластунства</Select.Option>
                <Select.Option value="Улад Пластового Сеніорату">Улад Пластового Сеніорату</Select.Option>
            </Select>
        </Form.Item>
        <Form.Item
            name="plastDegree"
            rules={[{ required: true, message: emptyInput() }]}>
            <Select
                placeholder={"Оберіть ступінь"}
            >{filtredDegrees.map(apd => (<Select.Option key={apd.id} value={apd.id}>{apd.name}</Select.Option>))}</Select>
        </Form.Item>
        <Form.Item
            className={classes.formField}
            name="datepickerStart"
            rules={[{ required: true, message: emptyInput() }]}>
            <DatePicker format="DD.MM.YYYY"
                className={classes.selectField}
                placeholder="Дата надання ступеню"

            />
        </Form.Item>

        <Form.Item name="isCurrent" label="Обрати поточним" valuePropName="checked">
            <Switch onChange={handleSwitchChange} />
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