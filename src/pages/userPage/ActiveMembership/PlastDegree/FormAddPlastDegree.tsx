import React, { useEffect, useState } from 'react';
import { Form, Select, Button, DatePicker } from 'antd';
import activeMembershipApi, { PlastDegree, UserPlastDegreePost, UserPlastDegree } from '../../../../api/activeMembershipApi';
import classes from "./FormAddPlastDegree.module.css"
import NotificationBoxApi from '../../../../api/NotificationBoxApi';
import { emptyInput } from "../../../../components/Notifications/Messages"

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
    const [isChecked, setIsChecked] = useState<boolean>(false);
    const [visiableDegree, setVisiableDegree] = useState<boolean>(false);
    const [filtredDegrees, setFiltredDegrees] = useState<Array<PlastDegree>>([]);
  
    const handleFinish = async (info: any) => {
        const plastDegreeId=filtredDegrees.find(item => item.name === "Пластприят")?.id;
        info.plastDegree=plastDegreeId? plastDegreeId:info.plastDegree;
        const userPlastDegreePost: UserPlastDegreePost = {
            plastDegreeId: info.plastDegree,
            dateStart: info.datepickerStart._d,
            dateFinish: null,
            isCurrent: isChecked,
            userId: userId
        };
        setVisibleModal(false);
        setVisiableDegree(false);
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
    }

    const handleOnChange = (value: any) => {
        if (value === "Пластприят") {
            setVisiableDegree(false);
            setFiltredDegrees(availablePlastDegree.filter(item => item.name === "Пластприят"));
        } else if (value === "Улад Старшого Пластунства") {
            setVisiableDegree(true);
            setFiltredDegrees(availablePlastDegree.filter(item =>item.name.includes("Старш")));
        } else {
            setVisiableDegree(true);
            setFiltredDegrees(availablePlastDegree.filter(item => item.name.includes("сеніор")));
        }
    }
    useEffect(() => {
        if(cancel) {form.resetFields(); setVisiableDegree(false);}
    }, [filtredDegrees, cancel]);


    return <Form
        name = "basic"
        onFinish = {handleFinish}
        form = {form}>    
        <Form.Item
            name = "plastUlad"
            rules = {[
                { required: true, message: emptyInput() }
                ]}
        >
            <Select
                onChange = {(value) => handleOnChange(value)}
                placeholder = {"Оберіть Улад"}
            >
                { availablePlastDegree.find(item => item.name === "Пластприят") && <Select.Option value="Пластприят">Пластприят</Select.Option>}
                {!isCityAdmin && availablePlastDegree.find(item => item.name.includes("Старш")) && <Select.Option value="Улад Старшого Пластунства">Улад Старшого Пластунства</Select.Option>}
                {!isCityAdmin && availablePlastDegree.filter(item => item.name.includes("сеніор")) && <Select.Option value="Улад Пластового Сеніорату">Улад Пластового Сеніорату</Select.Option>}
            </Select>
        </Form.Item>
        {visiableDegree && 
        <Form.Item
        name = "plastDegree"
        rules = {[{ required: visiableDegree, message: emptyInput() }]}>
        <Select
            placeholder = {"Оберіть ступінь"}
        >{
            filtredDegrees.map(apd => {
            if((isCityAdmin && (apd.id == 1 || apd.id == 7)) || !isCityAdmin)
                return (<Select.Option key = {apd.id} value = {apd.id}>{apd.name}</Select.Option>)
        }
        )}</Select>
    </Form.Item>}
        <Form.Item
            name = "datepickerStart"
            rules = {[{ required: true, message: emptyInput() }]}>
            <DatePicker format = "DD.MM.YYYY"
                className = {classes.selectField}
                placeholder = "Дата надання ступеню"
            />
        </Form.Item>
        <Form.Item>
            <Button
                className = {classes.cardButton}
                type = "primary"  htmlType = "submit"
            >
                Додати
        </Button>
        </Form.Item>
    </Form>
}
export default FormAddPlastDegree;