import React, { useEffect, useState } from "react";
import {
    Form,
    DatePicker,
    Select,
    Input,
    Button,
    Row,
    Col,
    Space,
} from "antd";
import SubSectionModel from '../../models/AboutBase/SubsectionModel';
import aboutBase from '../../api/aboutBase';
import formclasses from "./Form.module.css";
import NotificationBoxApi from "../../api/NotificationBoxApi";
import {
    emptyInput,
    maxNumber,
    minNumber,
    incorrectData
} from "../../components/Notifications/Messages"
import precautionApi from "../../api/precautionApi";
import { descriptionValidation } from "../../models/GllobalValidations/DescriptionValidation";
import styles from './FormAskQuestion.css';
import notificationLogic from "../../components/Notifications/Notification";

type FormAddSubsectionProps = {
    setVisibleModal: (visibleModal: boolean) => void;
    sectId: number;
    fetchSubData: Function
    //onAdd: () => void;
};

const FormAddSubsection: React.FC<FormAddSubsectionProps> = (props: any) => {
    const { setVisibleModal, onAdd, sectId, fetchSubData } = props;
    const [form] = Form.useForm();
    
    useEffect(() => {
        fetchSubData();
    }, []);

    const handleCancel = () => {
        form.resetFields();
        setVisibleModal(false);
    };

    const backgroundColor = (user: any) => {
        return user.isInLowerRole ? { backgroundColor: '#D3D3D3' } : { backgroundColor: 'white' };
    }
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    let defaultSubSect: SubSectionModel = {
        id: 0,
        sectionId: sectId,
        title: "",
        description: ""
    };
    const [subsectData, setSubsectData] = useState<SubSectionModel[]>([defaultSubSect]);
    const [visRule, setVisRule] = useState(false);

    const handleSubmit = async (/*values: any*/) => {
        const newSubSection: SubSectionModel = {
            id: 0,
            sectionId: sectId,
            title: title,
            description: description
        };
        if (title.length != 0 && description.length != 0) {
            await aboutBase.addAboutBaseSubsection(newSubSection);
            const res: SubSectionModel[] = (await aboutBase.getAboutBaseSubsections()).data;
            setSubsectData(res);
            setTitle("");
            setDescription("");
            notificationLogic("success", "Підрозділ додано!");
        } else {
            notificationLogic("error", "Хибні дані");
        }
        setVisibleModal(false);
        form.resetFields();
        fetchSubData();
        
        /*const newSubSection: SubSectionModel = {
            id: 0,
            sectionId: JSON.parse(values.section).id,
            title: JSON.parse(values.title),
            description: JSON.parse(values.description),
        };

        await aboutBase.addAboutBaseSubsection(newSubSection);
        setVisibleModal(false);
        form.resetFields();*/
        //onAdd();
        //await createNotifications(newDistinction);
    };

    return (
        <Form name="basic" layout="vertical" onFinish={handleSubmit} form={form} id='area'>
            <Row justify="start" gutter={[12, 0]}>
                <Col md={24} xs={24}>
                    <Form.Item
                        name="Title"
                        label="Заголовок: "
                        className={styles.formField}
                        rules={descriptionValidation.Inputs}
                    >
                        <Input
                            maxLength={50}
                            value={title}
                            onChange={(event) => {
                                if (event.target.value.length < 49) {
                                    setTitle(event.target.value);
                                    setVisRule(false);
                                }
                                else
                                    setVisRule(true);
                            }}
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row justify="start" gutter={[12, 0]}>
                <Col md={24} xs={24}>
                    <Form.Item
                        name="Description"
                        label="Текст: "
                        className={styles.formField}
                        rules={descriptionValidation.Description}
                    >
                        <Input.TextArea
                            allowClear
                            autoSize={{
                                minRows: 5,
                                maxRows: 14,
                            }}
                            className={styles.formField}
                            maxLength={1300}
                            value={description}
                            onChange={(event) => {
                                if (event.target.value.length < 1299) {
                                    setDescription(event.target.value);
                                    setVisRule(false);
                                }
                                else
                                    setVisRule(true);
                            }}
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row justify="start" gutter={[12, 0]}>
                <Col md={24} xs={24}>
                    <Form.Item style={{ textAlign: "right" }}>
                        <Space >
                            <Button key="back" onClick={handleCancel} className={styles.buttons}>
                                Відмінити
                            </Button>
                            <Button htmlType="submit" type="primary" className={styles.buttons}>
                                Додати
                            </Button>
                        </Space>
                    </Form.Item>
                    {/*<Form.Item style={{ textAlign: "right" }} className={styles.formField}>
                        <Button
                            htmlType="submit"
                            type="primary"
                            className={styles.buttons}
                        >
                            Додати
                        </Button>
                        </Form.Item>*/}
                </Col>
            </Row>
        </Form>
    );
}

export default FormAddSubsection;