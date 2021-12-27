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

const normFile = (e: any) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e && e.fileList;
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

    let subsectId = 0;

    const handleSubmit = async (values: any) => {
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
            subsectId = res[res.length - 1].id;
        } else {
            notificationLogic("error", "Хибні дані");
        }
        if (fileList) {
            const data = new FormData();
            fileList.forEach((element: any) => {
                data.append('files', element.originFileObj);
            });
            addPictures(data)
                .then(async (response) => {
                    form.resetFields();
                })
                .catch((error) => {
                    console.log(error);
                })
        }
        setVisibleModal(false);
        form.resetFields();
        fetchSubData();
    };

    const addPictures = async (data: FormData) => {
        return await aboutBase.uploadSubsectionPictures(subsectId, data);
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
        setPreviewVisible(false);
    };

    const handleUpload = ({ file, onSuccess }: any) => {
        setTimeout(() => {
            onSuccess("ok");
        }, 0);
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
        setFileList(fileList.fileList);
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
                    <Form.Item
                        name="upload"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                    >
                        <Upload
                            listType="picture-card"
                            accept=".jpeg,.jpg,.png"
                            customRequest={handleUpload}
                            onPreview={handlePreview}
                            onChange={handleChange}
                        >
                            {fileList.length >= 3 ? null : uploadButton}
                        </Upload>
                    </Form.Item>
                    <Form.Item>
                        <Modal
                            visible={previewVisible}
                            title={previewTitle}
                            footer={null}
                            onCancel={handleCancelImg}
                        >
                            <img alt="example" style={{ width: '100%' }} src={previewImage} />
                        </Modal>
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
                </Col>
            </Row>
        </Form>
    );
}

export default FormAddSubsection;
