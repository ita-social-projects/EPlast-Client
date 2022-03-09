import React, { useEffect, useState } from "react";
import { Form, Input, Button, Row, Col, Space, Upload, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import SubSectionModel from "../../models/AboutBase/SubsectionModel";
import aboutBase from "../../api/aboutBase";
import styles from "./FormAskQuestion.css";
import notificationLogic from "../../components/Notifications/Notification";
import PicturesWallEdit from "./PicturesWallEdit";

type FormEditSubsectionProps = {
  setVisibleModal: (visibleModal: boolean) => void;
  id: number;
  sectId: number;
  title: string;
  description: string;
  fetchSubData: Function;
  editKey: number;
  setEditKey: any;
};

const addFileToUpload = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};

export const Context = React.createContext({});

const FormEditSubsection: React.FC<FormEditSubsectionProps> = (props: any) => {
  const {
    setVisibleModal,
    id,
    sectId,
    title,
    description,
    fetchSubData,
    editKey,
    setEditKey,
  } = props;
  const [form] = Form.useForm();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [pictures, setPictures] = useState([]);
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  let defaultSubSect: SubSectionModel = {
    id: id,
    sectionId: sectId,
    title: title,
    description: description,
  };

  const fetchSubPhotos = async () => {
    const list = (await aboutBase.getSubsectionPictures(id)).data;
  };

  const [curSubsect, setCurSubsect] = useState<SubSectionModel>(defaultSubSect);
  const [countPhotos, setCountPhotos] = useState(0);
  const [picturesKey, setPicturesKey] = useState(0);

  useEffect(() => {
    form.resetFields();
    setPictures([]);
    setCurSubsect(defaultSubSect);
    fetchSubData();
    fetchSubPhotos();
    getCountPicturesAdd();
  }, [id]);

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
    } else {
      notificationLogic("error", "Хибні дані");
    }
    form.resetFields();
    fetchSubData();
    setEditKey(editKey + 1);
  };

  const handleSubmitPictures = () => {
    if (pictures.length != 0) {
      const data = new FormData();
      pictures.forEach((element: any) => {
        data.append("files", element.originFileObj);
      });
      addPictures(data).then(async (response) => {
        form.resetFields();
        setPicturesKey(picturesKey + 1);
      });
      setPictures([]);
    }
  };

  const getCountPicturesAdd = async () => {
    setCountPhotos((await aboutBase.getSubsectionPictures(id)).data.length);
  };

  const getCountPicturesDelete = async (id: number) => {
    setCountPhotos(countPhotos - 1);
  };

  const addPictures = async (data: FormData) => {
    return await aboutBase.uploadSubsectionPictures(id, data);
  };

  const deletePictures = async (id: number) => {
    return await aboutBase.removeSubsectionPicture(id);
  };

  const getBase64 = (file: any) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

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
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleChange = (pictures: any) => {
    setPictures(pictures.fileList);
    getCountPicturesAdd();
    handleSubmitPictures();
  };

  return (
    <Context.Provider
      value={{
        getCountPicturesDelete,
      }}
    >
      <Form
        name="basic"
        layout="vertical"
        onFinish={handleSubmit}
        form={form}
        id="area"
        initialValues={{ Description: defaultSubSect.description }}
      >
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
                    description: curSubsect.description,
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
                    description: event.target.value,
                  })
                }
              />
            </Form.Item>
          </Col>
        </Row>
        <PicturesWallEdit subsectionId={id} key={picturesKey} />
        <Row justify="start" gutter={[12, 0]}>
          <Col md={24} xs={24}>
            <Form.Item
              name="upload"
              valuePropName="fileList"
              getValueFromEvent={addFileToUpload}
            >
              <Upload
                listType="picture-card"
                accept=".jpeg,.jpg,.png"
                customRequest={handleUpload}
                onPreview={handlePreview}
                onChange={handleChange}
              >
                {countPhotos >= 3 ? null : uploadButton}
              </Upload>
            </Form.Item>
            <Form.Item>
              <Modal
                visible={previewVisible}
                title={previewTitle}
                footer={null}
                onCancel={handleCancelImg}
              >
                <img
                  alt="example"
                  style={{ width: "100%" }}
                  src={previewImage}
                />
              </Modal>
            </Form.Item>
          </Col>
        </Row>
        <Row justify="start" gutter={[12, 0]}>
          <Col md={24} xs={24}>
            <Form.Item style={{ textAlign: "right" }}>
              <Space>
                <Button
                  key="back"
                  onClick={handleCancel}
                  className={styles.buttons}
                >
                  Відмінити
                </Button>
                <Button
                  htmlType="submit"
                  type="primary"
                  className={styles.buttons}
                >
                  Редагувати
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Context.Provider>
  );
};

export default FormEditSubsection;
