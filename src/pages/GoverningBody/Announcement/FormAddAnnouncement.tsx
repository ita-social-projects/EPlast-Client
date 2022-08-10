/* eslint-disable no-param-reassign */
/* eslint-disable eqeqeq */
/* eslint-disable prefer-destructuring */
import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Upload, Select, Checkbox, Modal } from "antd";
import ReactQuill from "react-quill";
import { RcFile, UploadFile } from "antd/lib/upload/interface";
import { PlusOutlined } from "@ant-design/icons";
import formclasses from "./Form.module.css";
import { emptyInput, possibleFileExtensions } from "../../../components/Notifications/Messages";
import { getGoverningBodiesList } from "../../../api/governingBodiesApi";
import { GoverningBody } from "../../../api/decisionsApi";
import SectorProfile from "../../../models/GoverningBody/Sector/SectorProfile";
import { getSectorsListByGoverningBodyId } from "../../../api/governingBodySectorsApi";
import ButtonCollapse from "../../../components/ButtonCollapse/ButtonCollapse";
import { descriptionValidation } from "../../../models/GllobalValidations/DescriptionValidation";
import notificationLogic from "../../../components/Notifications/Notification";

type FormAddAnnouncementProps = {
  governingBodyId?: number;
  setVisibleModal: (visibleModal: boolean) => void;
  onAdd: (
    title: string,
    text: string,
    images: string[],
    isPined: boolean,
    gvbId: number,
    sectorId: number
  ) => void;
};

const FormAddAnnouncement: React.FC<FormAddAnnouncementProps> = (
  props: any
) => {
  const { setVisibleModal, onAdd, governingBodyId } = props;
  const [form] = Form.useForm();
  const [photos, setPhotos] = useState<string[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [gvbLoading, setGvbLoading] = useState<boolean>(false);
  const [governingBodies, setGoverningBodies] = useState<GoverningBody[]>([]);
  const [sectorsLoading, setSectorsLoading] = useState<boolean>(false);
  const [sectors, setSectors] = useState<SectorProfile[]>([]);
  const [selectSectorId, setSelectSectorId] = useState<any>();
  const [selectGoverningBodyId, setSelectGoverningBodyId] = useState<number>();
  const [isPined, setIsPined] = useState<boolean>(false);

  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    setPhotos([]);
    setIsPined(false);
    setVisibleModal(false);
  };

  const handleClose = () => {
    setVisibleModal(false);
  };

  const getBase64 = (img: Blob, callback: Function): any => {
    const reader = new FileReader();
    reader.readAsDataURL(img);
    reader.addEventListener("load", () => callback(reader.result));
  };

  const handleSubmit = (values: any) => {
    setVisibleModal(false);
    onAdd(
      values.title,
      values.text,
      photos,
      isPined,
      selectGoverningBodyId,
      selectSectorId
    );
    setFileList([]);
    setPhotos([]);
    setIsPined(false);
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
    if (!checkFile(images.file.name)){
      return;
    }
    setFileList(images.fileList);
    if (images.fileList.length < fileList.length) {
      const filteredPhotos: string[] = [];
      images.fileList.forEach((item: any) => {
        getBase64(item.originFileObj as RcFile, (base64: string) => {
          filteredPhotos.push(base64);
        });
      });
      setPhotos(filteredPhotos);
      return;
    }
    setFileList(images.fileList);

    getBase64(images.file as RcFile, (base64: string) => {
      setPhotos([...photos, base64]);
    });
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

      if (governingBodyId) {
        form.setFieldsValue({
          governingBody: response.find(
            (x: GoverningBody) => x.id == governingBodyId
          )?.governingBodyName,
        });
        setSelectGoverningBodyId(governingBodyId);
        governingBodyChange(governingBodyId);
      }
    } finally {
      setGvbLoading(false);
    }
  };

  const onGvbSelect = async (value: any) => {
    setSectorsLoading(true);
    try {
      form.setFieldsValue({ sector: undefined });
      const { id } = JSON.parse(value.toString());
      setSelectGoverningBodyId(id);
      governingBodyChange(id);
    } finally {
      setSectorsLoading(false);
    }
  };

  const onSectorSelect = async (value: any) => {
    try {
      const { id } = JSON.parse(value.toString());
      setSelectSectorId(id);
    } catch {
      setSelectSectorId(null);
    }
  };

  useEffect(() => {
    fetchData();
    if (props.visibleModal) {
      form.resetFields();
    }
  }, [props]);

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Завантажити фото</div>
    </div>
  );

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
        <Row justify="start" gutter={[12, 0]}>
          <Col md={24} xs={24}>
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
          </Col>
        </Row>
        <Row justify="start" gutter={[12, 0]}>
          <Col md={24} xs={24}>
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
          </Col>
        </Row>
        <Row justify="start" gutter={[12, 0]}>
          <Col md={24} xs={24}>
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
          </Col>
        </Row>
        <Row justify="start" gutter={[12, 0]}>
          <Col md={24} xs={24}>
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
          </Col>
        </Row>
        <Row>
          <Upload
            listType="picture-card"
            accept=".jpeg,.jpg,.png"
            fileList={fileList}
            onChange={handleUpload}
            onPreview={handlePreview}
            beforeUpload={() => false}
          >
            {fileList.length >= 5 ? null : uploadButton}
          </Upload>
          <Modal
            visible={previewVisible}
            title={previewTitle}
            footer={null}
            onCancel={() => setPreviewVisible(false)}
          >
            <img alt="example" style={{ width: "100%" }} src={previewImage} />
          </Modal>
        </Row>
        <Row>
          <Form.Item name="remember" valuePropName="checked">
            <Checkbox onChange={(e) => setIsPined(e.target.checked)}>
              Закріпити оголошення
            </Checkbox>
          </Form.Item>
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
                  Опублікувати
                </Button>
              </div>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default FormAddAnnouncement;
