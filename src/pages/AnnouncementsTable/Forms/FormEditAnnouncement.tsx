import { Button, Form, Modal, Upload } from "antd";
import { RcFile } from "antd/lib/upload";
import { UploadFile } from "antd/lib/upload/interface";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import { PlusOutlined } from "@ant-design/icons";
import notificationLogic from "../../../components/Notifications/Notification";
import { getAnnouncementsById } from "../../../api/announcementsApi";
import formclasses from "./Form.module.css";
import { possibleFileExtensions } from "../../../components/Notifications/Messages";
import { descriptionValidation } from "../../../models/GllobalValidations/DescriptionValidation";
import { AnnouncementsTableStore } from "../../../stores/AnnouncementsStore/store";
import ButtonCollapse from "../../../components/ButtonCollapse/ButtonCollapse";
import "../../../components/Quill/FormWithQuill.css";

type FormEditAnnouncementProps = {
  setVisibleModal: (visibleModal: boolean) => void;
};

const getBase64 = (img: Blob, callback: Function): any => {
  const reader = new FileReader();
  reader.readAsDataURL(img);
  reader.addEventListener("load", () => callback(reader.result));
};

function getUid() {
  return new Date().getTime();
}

const FormEditAnnouncement: React.FC<FormEditAnnouncementProps> = (
  props: any
) => {
  const [state, actions] = AnnouncementsTableStore();
  const [form] = Form.useForm();
  const [text, setText] = useState<string>("");
  const [title, setTitle] = useState<string>("");

  const [uploadImages, setUploadImages] = useState<any[]>([]);
  const [imagesUrl, setImagesUrl] = useState<string[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const getPhotos = (Images: any[]) => {
    setImagesUrl([]);
    Images.map((image) => {
      if (!image.url) {
        getBase64(image.originFileObj as RcFile, (base64: string) => {
          setImagesUrl((old) => [...old, base64]);
        });
      } else {
        setImagesUrl((old) => [...old, image.url]);
      }
      return image;
    });
  };

  const getAnnouncement = async (annId: number) => {
    setUploadImages([]);
    const response = await getAnnouncementsById(annId);
    form.setFieldsValue({ title: response.data.title });
    form.setFieldsValue({ text: response.data.text });
    let images: any = [];
    response.data.images.map((image: any, ind: number) => {
      images = [
        ...images,
        {
          url: image.imageBase64,
          uid: getUid() + ind,
          type: `image/${image.imageBase64.substring(
            image.imageBase64.indexOf(".") + 1,
            image.imageBase64.indexOf(";")
          )}`,
        },
      ];
      return image;
    });
    setUploadImages(images);
    getPhotos(images);
    setTitle(response.data.title);
    setText(response.data.text);
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

  const handleCancel = () => {
    props.setVisibleModal(false);
    getAnnouncement(state.selectedObjectId);
  };

  const handleClose = () => {
    props.setVisibleModal(false);
  };

  const handleUpload = (images: any) => {
    if (images.file.name) {
      if (!checkFile(images.file.name)) {
        return;
      }
    }
    if (images.file.status === "removed") {
      const filteredImages = uploadImages.filter((announcement) => {
        return announcement.uid !== images.file.uid;
      });
      setUploadImages(filteredImages);
      getPhotos(filteredImages);
      return;
    }
    setUploadImages(images.fileList);
    getPhotos(images.fileList);
  };

  const handleSubmit = async (values: any) => {
    props.setVisibleModal(false);
    form.resetFields();
    await actions.editAnnouncement(
      state.selectedObjectId,
      values.title,
      values.text,
      imagesUrl,
      values.isPined
    );
    await actions.getAnnouncements();
    notificationLogic("success", "Оголошення змінено");
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
    getAnnouncement(state.selectedObjectId);
  }, [state.selectedObjectId]);

  return (
    <>
      <ButtonCollapse handleClose={handleClose} />
      <Form
        name="basic"
        onFinish={handleSubmit}
        form={form}
        id="area"
        style={{ position: "relative" }}
      >
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
              <div style={{ marginTop: 8 }}>Завантажити фото</div>
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
      </Form>
    </>
  );
};

export default FormEditAnnouncement;
