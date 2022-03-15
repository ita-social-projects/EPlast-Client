import React, { useState } from "react";
import { Form, Button, Row, Col, Upload } from "antd";
import formclasses from "./Form.module.css";
import {
  emptyInput,
  maxLength,
} from "../../../components/Notifications/Messages";
import ReactQuill from "react-quill";
import { UploadFile } from "antd/lib/upload/interface";
import ButtonCollapse from "../../../components/ButtonCollapse/ButtonCollapse";

type FormAddAnnouncementProps = {
  setVisibleModal: (visibleModal: boolean) => void;
  onAdd: (text: string, images: string[]) => void;
};

const FormAddAnnouncement: React.FC<FormAddAnnouncementProps> = (
  props: any
) => {
  const { setVisibleModal, onAdd } = props;
  const [form] = Form.useForm();
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleClose = () => {
    setVisibleModal(false);
  };

  const handleCancel = () => {
    form.resetFields();
    setVisibleModal(false);
  };

  const handleSubmit = (values: any) => {
    setSubmitLoading(true);
    setVisibleModal(false);
    form.resetFields();
    onAdd(values.text, photos);
    setSubmitLoading(false);
  };

  const getBase64 = (img: Blob, callback: Function) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const handleUpload = (images: any) => {
    setFileList(images.fileList);
    if (images.fileList.length === 0) return;
    getBase64(images.file, (base64: string) => {
      setPhotos([...photos, base64]);
    });
  };

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
              initialValue={""}
              label="Текст оголошення"
              labelCol={{ span: 24 }}
              name="text"
              rules={[
                { required: true, message: emptyInput() },
                {
                  max: 1000,
                  message: maxLength(1000),
                },
              ]}
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
            beforeUpload={() => false}
          >
            {"Upload"}
          </Upload>
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
