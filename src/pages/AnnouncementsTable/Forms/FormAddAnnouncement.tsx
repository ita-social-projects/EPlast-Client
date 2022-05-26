/* eslint-disable no-param-reassign */
/* eslint-disable eqeqeq */
/* eslint-disable prefer-destructuring */
import React, { useState, useEffect } from "react";
import { Form, Button, Upload, Select, Checkbox, Modal } from "antd";
import ReactQuill from "react-quill";
import { RcFile, UploadFile } from "antd/lib/upload/interface";
import { PlusOutlined } from "@ant-design/icons";
import formclasses from "./Form.module.css";
import {
  emptyInput,
  possibleFileExtensions,
} from "../../../components/Notifications/Messages";
import { getGoverningBodiesList } from "../../../api/governingBodiesApi";
import { GoverningBody } from "../../../api/decisionsApi";
import SectorProfile from "../../../models/GoverningBody/Sector/SectorProfile";
import { getSectorsListByGoverningBodyId } from "../../../api/governingBodySectorsApi";
import ButtonCollapse from "../../../components/ButtonCollapse/ButtonCollapse";
import { descriptionValidation } from "../../../models/GllobalValidations/DescriptionValidation";
import notificationLogic from "../../../components/Notifications/Notification";
import NotificationBoxApi from "../../../api/NotificationBoxApi";
import { AnnouncementsTableStore } from "../../../stores/AnnouncementsStore/store";

type FormAddAnnouncementProps = {
  setVisibleModal: (visibleModal: boolean) => void;
};

const getBase64 = (img: Blob, callback: Function): any => {
  const reader = new FileReader();
  reader.readAsDataURL(img);
  reader.addEventListener("load", () => callback(reader.result));
};

const FormAddAnnouncement: React.FC<FormAddAnnouncementProps> = (
  props: any
) => {
  const [state, actions] = AnnouncementsTableStore();
  const path: string = "/announcements";

  const [form] = Form.useForm();

  const [gvbLoading, setGvbLoading] = useState<boolean>(false);
  const [governingBodies, setGoverningBodies] = useState<GoverningBody[]>([]);
  const [sectorsLoading, setSectorsLoading] = useState<boolean>(false);
  const [sectors, setSectors] = useState<SectorProfile[]>([]);

  const [selectSectorId, setSelectSectorId] = useState<any>();
  const [selectGoverningBodyId, setSelectGoverningBodyId] = useState<any>();
  const [isPined, setIsPined] = useState<boolean>(false);

  const [uploadImages, setUploadImages] = useState<any[]>([]);
  const [imagesUrl, setImagesUrl] = useState<string[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");



  const newNotification = async () => {
    await NotificationBoxApi.createNotifications(
      state.usersToSendNotification,
      "Додане нове оголошення.",
      NotificationBoxApi.NotificationTypes.UserNotifications,
      `${path}/1`,
      `Переглянути`
    );
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

  const handleCancel = () => {
    props.setVisibleModal(false);
  };

  const handleClose = () => {
    props.setVisibleModal(false);
  };

  const handleUpload = (images: any) => {
    if (!checkFile(images.file.name)) {
      return;
    }
    setUploadImages(images.fileList);
    getPhotos(images.fileList);
  };

  const handleSubmit = async (values: any) => {
    props.setVisibleModal(false);
    form.resetFields();
    newNotification();
    await actions.addAnnouncement(
      values.title,
      values.text,
      imagesUrl,
      isPined,
      selectGoverningBodyId,
      selectSectorId
    );
    await actions.getAnnouncements();
    notificationLogic("success", "Оголошення опубліковано");
    setIsPined(false);
    setUploadImages([]);
    setImagesUrl([]);
  };

  const handlePreview = async (file: UploadFile) => {
    getBase64(file.originFileObj as RcFile, (base64: string) => {
      setPreviewImage(base64);
    });
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
    );
  };

  const governingBodyChange = async (id: number) => {
    const response = await getSectorsListByGoverningBodyId(id);
    setSectors(response);
  };

  const fetchData = async () => {
    setGvbLoading(true);
    try {
      const response = await getGoverningBodiesList();
      setGoverningBodies(response);
    } finally {
      setGvbLoading(false);
    }
  };

  const onGvbSelect = async (value: any) => {
    setSectorsLoading(true);
    try {
      form.setFieldsValue({ sector: undefined });
      const id: number = JSON.parse(value.toString()).id;
      setSelectGoverningBodyId(id);
      governingBodyChange(id);
    } finally {
      setSectorsLoading(false);
    }
  };

  const onSectorSelect = async (value: any) => {
    try {
      const id: number = JSON.parse(value.toString()).id;
      setSelectSectorId(id);
    } catch {
      setSelectSectorId(null);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
          label="Орган"
          labelCol={{ span: 24 }}
          name="governingBody"
          rules={[
            {
              required: true,
              message: emptyInput(),
            },
          ]}
        >
          <Select
            id="governingBodySelect"
            showSearch
            loading={gvbLoading}
            onChange={(value) => onGvbSelect(value)}
          >
            {governingBodies?.map((o) => (
              <Select.Option key={o.id} value={JSON.stringify(o)}>
                {o.governingBodyName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          className={formclasses.formField}
          label="Напрям"
          labelCol={{ span: 24 }}
          name="sector"
          rules={[
            {
              message: emptyInput(),
            },
          ]}
        >
          <Select
            id="sectorSelect"
            showSearch
            allowClear
            loading={sectorsLoading}
            onChange={(value) => onSectorSelect(value)}
          >
            {sectors?.map((o) => (
              <Select.Option key={o.id} value={JSON.stringify(o)}>
                {o.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          className={formclasses.formField}
          initialValue=""
          label="Тема оголошення"
          labelCol={{ span: 24 }}
          name="title"
          rules={descriptionValidation.Announcements}
        >
          <ReactQuill theme="snow" placeholder="Введіть текст..." />
        </Form.Item>

        <Form.Item
          className={formclasses.formField}
          initialValue=""
          label="Текст оголошення"
          labelCol={{ span: 24 }}
          name="text"
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
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          )}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={() => setPreviewVisible(false)}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>

        <Form.Item name="checkBox" valuePropName="checked">
          <Checkbox onChange={(e) => setIsPined(e.target.checked)}>
            Закріпити оголошення
          </Checkbox>
        </Form.Item>

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
              Опублікувати
            </Button>
          </div>
        </Form.Item>
      </Form>
    </>
  );
};

export default FormAddAnnouncement;
