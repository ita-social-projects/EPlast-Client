import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col, Drawer, Upload } from "antd";
import ReactQuill from "react-quill";
import formclasses from "./Form.module.css";
import { getSectorAnnouncementsById } from "../../../../api/governingBodySectorsApi";
import Spinner from "../../../Spinner/Spinner";
import { descriptionValidation } from "../../../../models/GllobalValidations/DescriptionValidation";

type FormEditAnnouncementProps = {
  visibleModal: boolean;
  id: number;
  setVisibleModal: (visibleModal: boolean) => void;
  onEdit: (id: number, title: string, text: string, images: string[]) => void;
};

const EditAnnouncementModal: React.FC<FormEditAnnouncementProps> = (
  props: any
) => {
  const { visibleModal, id, setVisibleModal, onEdit } = props;
  const [form] = Form.useForm();
  const [text, setText] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [uploadImages, setUploadImages] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  function getUid() {
    return new Date().getTime();
  }

  const getAnnouncement = async (id: number) => {
    setLoading(true);
    await getSectorAnnouncementsById(id)
      .then((response) => {
        setTitle(response.data.title);
        setText(response.data.text);
        form.setFieldsValue({ title: response.data.title });
        form.setFieldsValue({ text: response.data.text });
        response.data.images.map((image: any) => {
          setUploadImages((uploadImages) => [
            ...uploadImages,
            {
              url: image.imageBase64,
              uid: getUid(),
              type: `image/${image.imageBase64.substring(
                image.imageBase64.indexOf(".") + 1,
                image.imageBase64.indexOf(";")
              )}`,
            },
          ]);
        });
      })
      .catch((err) => {
        console.log(err);
      });
    setLoading(false);
  };

  const handleCancel = () => {
    setLoading(true);
    setVisibleModal(false);
    form.resetFields();
    setUploadImages([]);
    setLoading(false);
  };

  const handleUpload = (images: any) => {
    setUploadImages(images.fileList);
  };

  const handleSubmit = (values: any) => {
    setLoading(true);
    setVisibleModal(false);
    const imgs = uploadImages.map((image: any) => {
      return image.url || image.thumbUrl;
    });
    onEdit(id, values.title, values.text, imgs);
    form.resetFields();
    setLoading(false);
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
      {loading ? (
        <Spinner />
      ) : (
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
              beforeUpload={() => false}
            >
              Upload
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
                    Зберегти
                  </Button>
                </div>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      )}
    </Drawer>
  );
};

export default EditAnnouncementModal;
