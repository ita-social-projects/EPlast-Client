import React, { useEffect, useState } from "react";
import {
    Form,
    Input,
    Button,
    Row,
    Col,
    Space,
    Upload,
    Modal,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import SubSectionModel from '../../models/AboutBase/SubsectionModel';
import aboutBase from '../../api/aboutBase';
import { descriptionValidation } from "../../models/GllobalValidations/DescriptionValidation";
import styles from './FormAskQuestion.css';
import notificationLogic from "../../components/Notifications/Notification";

type FormAddSubsectionProps = {
    setVisibleModal: (visibleModal: boolean) => void;
    sectId: number;
    fetchSubData: Function
};

const FormAddSubsection: React.FC<FormAddSubsectionProps> = (props: any) => {
    const { setVisibleModal, sectId, fetchSubData } = props;
    const [form] = Form.useForm();

    let defaultSubSect: SubSectionModel = {
        id: 0,
        sectionId: sectId,
        title: "",
        description: ""
    };

    const [count, setCount] = useState(0);
    const [subsectData, setSubsectData] = useState<SubSectionModel[]>([defaultSubSect]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);
    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    useEffect(() => {
        fetchSubData();
    }, []);

    const handleCancel = () => {
        form.resetFields();
        setVisibleModal(false);
    };

    const handleSubmit = async () => {
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
            setFileList([]);
            notificationLogic("success", "Підрозділ додано!");
        } else {
            notificationLogic("error", "Хибні дані");
        }
        setVisibleModal(false);
        form.resetFields();
        fetchSubData();
    };

    const getBase64 = (file: any) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    const handleCancelImg = () => {
        setPreviewVisible(false)
    };

    const handleUpload = ({ file, onSuccess }: any) => {
        setTimeout(() => {
            onSuccess("ok");
        }, 0); 
        setCount(count+1);
    };

    const handlePreview = async (file: any) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewVisible(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const handleChange = (fileList: any) => {
        setFileList(fileList);
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
                                setTitle(event.target.value);
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
                                setDescription(event.target.value);
                            }}
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row justify="start" gutter={[12, 0]}>
                <Col md={24} xs={24}>
                    <Upload
                        listType="picture-card"
                        accept=".jpeg,.jpg,.png"
                        customRequest={handleUpload}
                        onPreview={handlePreview}
                        onChange={handleChange}
                    >
                        {count >= 5 ? null : uploadButton}
                    </Upload>
                    <Modal
                        visible={previewVisible}
                        title={previewTitle}
                        footer={null}
                        onCancel={handleCancelImg}
                    >
                        <img alt="example" style={{ width: '100%' }} src={previewImage} />
                    </Modal>
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
                </Col>
            </Row>
        </Form>
    );
}

export default FormAddSubsection;
