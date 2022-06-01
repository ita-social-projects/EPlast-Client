import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col, Drawer, Upload, Modal } from "antd";
import ReactQuill from "react-quill";
import { RcFile, UploadFile } from "antd/es/upload/interface";
import { PlusOutlined } from "@ant-design/icons";
import formclasses from "./Form.module.css";
import { descriptionValidation } from "../../../models/GllobalValidations/DescriptionValidation";
import notificationLogic from "../../../components/Notifications/Notification";
import { possibleFileExtensions } from "../../../components/Notifications/Messages";
import { getAnnouncementsById } from "../../../api/announcementsApi";

type FormEditAnnouncementProps = {
  visibleModal: boolean;
  id: number;
  setVisibleModal: (visibleModal: boolean) => void;
  onEdit: (
    id: number,
    title: string,
    text: string,
    images: string[],
    isPined: boolean
  ) => void;
}

const getBase64 = (img: Blob, callback: Function): any => {
  const reader = new FileReader();
  reader.readAsDataURL(img);
  reader.addEventListener("load", () => callback(reader.result));
};

const EditAnnouncementModal = ({
  visibleModal,
  setVisibleModal,
  onEdit,
  id,
}: FormEditAnnouncementProps) => {
  const [form] = Form.useForm();
  const [text, setText] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [uploadImages, setUploadImages] = useState<any[]>([]);
  const [imagesUrl, setImagesUrl] = useState<string[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  function getUid() {
    return new Date().getTime();
  }

  const getAnnouncement = async (annId: number) => {
    setUploadImages([]);
    await getAnnouncementsById(annId)
      .then((response) => {
        setTitle(response.data.title);
        setText(response.data.text);
        form.setFieldsValue({ title: response.data.title });
        form.setFieldsValue({ text: response.data.text });
        response.data.images.map((image: any) => {
          setUploadImages((Images) => [
            ...Images,
            {
              url: image.imageBase64,
              uid: getUid(),
              type: `image/${image.imageBase64.substring(
                image.imageBase64.indexOf(".") + 1,
                image.imageBase64.indexOf(";")
              )}`,
            },
          ]);
          return image;
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCancel = () => {
    setVisibleModal(false);
  };

  const getPhotos = (Images: any[]) => {
    setImagesUrl([]);
    Images.map((image) => {
      if (!image.url) {
        getBase64(image.originFileObj as RcFile, (base64: string) => {
          setImagesUrl((old) => [...old, base64]);
        });
      }
      return image;
    });
  };

  const checkFile = (fileName: string) => {
    const extension = fileName.split(".").reverse()[0].toLowerCase();
    const isCorrectExtension =
      extension.indexOf("jpeg") !== -1 ||
      extension.indexOf("jpg") !== -1 ||
      extension.indexOf("png") !== -1;
    if (!isCorrectExtension) {
      notificationLogic("error", possibleFileExtensions("png, jpg, jpeg"));
    }
    return isCorrectExtension;
  };

  const handleUpload = (images: any) => {
    if (!checkFile(images.file.name)) {
      return;
    }
    setUploadImages(images.fileList);
    getPhotos(images.fileList);
  };

  const handleSubmit = (values: any) => {
    setVisibleModal(false);
    form.resetFields();
    onEdit(id, values.title, values.text, imagesUrl, values.isPined);
    setText(values.text);
    setTitle(values.title);
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url) {
      getBase64(file.originFileObj as RcFile, (base64: string) => {
        setPreviewImage(base64);
      });
    } else {
      setPreviewImage(file.url);
    }
    setPreviewVisible(true);
  };

  useEffect(() => {
    getAnnouncement(id);
  }, [id]);

  return (
    <Drawer
      title="Редагувати оголошення"
      placement="right"
      width="auto"
      visible={visibleModal}
      onClose={handleCancel}
      footer={null}
    >
      <Form
        name="basic"
        onFinish={handleSubmit}
        form={form}
        id="area"
        style={{ position: "relative" }}
      >
        <Row justify="start" gutter={[12, 0]}>
          <Col md={24} xs={24}>
            <Form.Item
              className={formclasses.formField}
              initialValue={title}
              label="Тема оголошення"
              labelCol={{ span: 24 }}
              name="title"
              rules={descriptionValidation.Announcements}
            >
              <ReactQuill theme="snow" placeholder="Введіть текст..." />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="start" gutter={[12, 0]}>
          <Col md={24} xs={24}>
            <Form.Item
              className={formclasses.formField}
              label="Текст оголошення"
              labelCol={{ span: 24 }}
              name="text"
              initialValue={text}
              rules={descriptionValidation.Announcements}
            >
              <ReactQuill theme="snow" placeholder="Введіть текст..." />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Upload
            listType="picture-card"
            accept=".jpeg,.jpg,.png"
            fileList={uploadImages}
            onChange={handleUpload}
            onPreview={handlePreview}
            beforeUpload={() => false}
          >
            {uploadImages.length >= 5 ? null : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
          <Modal
            visible={previewVisible}
            title="Прегляд фото"
            footer={null}
            onCancel={() => setPreviewVisible(false)}
          >
            <img alt="example" style={{ width: "100%" }} src={previewImage} />
          </Modal>
        </Row>
        <Row justify="start" gutter={[12, 0]}>
          <Col md={24} xs={24}>
            <Form.Item>
              <div className={formclasses.cardButton}>
                <Button
                  key="back"
                  onClick={handleCancel}
                  className={formclasses.buttons}
                >
                  Відмінити
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  className={formclasses.buttons}
                >
                  Зберегти
                </Button>
              </div>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};

export default EditAnnouncementModal;
