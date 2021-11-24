import React, { useEffect, useState } from "react";
import {
    Form,
    Input,
    Button,
    Row,
    Col,
    Space,
} from "antd";
import SubSectionModel from '../../models/AboutBase/SubsectionModel';
import aboutBase from '../../api/aboutBase';
import styles from './FormAskQuestion.css';
import notificationLogic from "../../components/Notifications/Notification";

type FormAddSubsectionProps = {
    setVisibleModal: (visibleModal: boolean) => void;
    id: number;
    sectId: number;
    title: string;
    description: string;
    fetchSubData: Function
};

const FormEditSubsection: React.FC<FormAddSubsectionProps> = (props: any) => {
    const { setVisibleModal, id, sectId, title, description, fetchSubData } = props;
    const [form] = Form.useForm();

    let defaultSubSect: SubSectionModel = {
        id: id,
        sectionId: sectId,
        title: title,
        description: description
    };

    const [curSubsect, setCurSubsect] = useState<SubSectionModel>(defaultSubSect);

    useEffect(() => {
        fetchSubData();
    }, []);

    const handleCancel = () => {
        form.resetFields();
        setVisibleModal(false);
    };

    const handleSubmit = async () => {
        if (curSubsect.title.length !== 0 && curSubsect.description.length != 0) {
            await aboutBase.editAboutBaseSubsection(curSubsect);
            notificationLogic("success", "Підрозділ успішно змінено!");
            setCurSubsect(defaultSubSect);
            setVisibleModal(false);
        } else
            notificationLogic("error", "Хибні дані");
        form.resetFields();
        fetchSubData();
    };

    return (
        <Form name="basic" layout="vertical" onFinish={handleSubmit} form={form} id='area'>
            <Row justify="start" gutter={[12, 0]}>
                <Col md={24} xs={24}>
                    <Form.Item
                        name="Title"
                        label="Заголовок: "
                        className={styles.formField}
                    >
                        <Input
                            maxLength={50}
                            defaultValue={curSubsect.title}
                            onChange={(event) =>
                                setCurSubsect({
                                    id: curSubsect.id,
                                    sectionId: curSubsect.sectionId,
                                    title: event.target.value,
                                    description: curSubsect.description
                                })
                            }
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
                    >
                        <Input.TextArea
                            allowClear
                            autoSize={{
                                minRows: 5,
                                maxRows: 14,
                            }}
                            className={styles.formField}
                            maxLength={1300}
                            defaultValue={curSubsect.description}
                            onChange={(event) =>
                                setCurSubsect({
                                    id: curSubsect.id,
                                    sectionId: curSubsect.sectionId,
                                    title: curSubsect.title,
                                    description: event.target.value
                                })
                            }
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
                                Редагувати
                            </Button>
                        </Space>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
}

export default FormEditSubsection;
