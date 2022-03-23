import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col, Drawer, Upload } from "antd";
import formclasses from "./Form.module.css";
import {
  emptyInput,
  maxLength,
} from "../../../components/Notifications/Messages";
import { getAnnouncementsById } from "../../../api/governingBodiesApi";
import ReactQuill from "react-quill";
import Spinner from "../../Spinner/Spinner";
import { useHistory } from "react-router-dom";

interface Props {
  visibleModal: boolean;
  id: number;
  setVisibleModal: (visibleModal: boolean) => void;
  onEdit: (id: number, text: string, images: string[]) => void;
}

const EditAnnouncementModal = ({
  visibleModal,
  setVisibleModal,
  onEdit,
  id,
}: Props) => {
  const [form] = Form.useForm();
  const [text, setText] = useState<string>("");
  const [uploadImages, setUploadImages] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const history = useHistory();

  useEffect(() => {
    getAnnouncement(id);
  }, [id]);

  function getUid() {
    return new Date().getTime();
  }

  const getAnnouncement = async (id: number) => {
    setLoading(true);
    await getAnnouncementsById(id)
      .then((response) => {
        setText(response.data.text);
        response.data.images.map((image: any) => {
          setUploadImages((uploadImages) => [
            ...uploadImages,
            {
              url: image.imageBase64,
              uid: getUid(),
              type:
                "image/" +
                image.imageBase64.substring(
                  image.imageBase64.indexOf(".") + 1,
                  image.imageBase64.indexOf(";")
                ),
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
    setUploadImages([]);
    setLoading(false);
  };

  const handleUpload = (images: any) => {
    setUploadImages(images.fileList);
  };

  const handleSubmit = (values: any) => {
    setLoading(true);
    setVisibleModal(false);
    form.resetFields();
    let imgs = uploadImages.map((image: any) => {
      return image.url || image.thumbUrl;
    });
    onEdit(id, text, imgs);
    setLoading(false);
  };

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
                label="Текст оголошення"
                labelCol={{ span: 24 }}
                name="text"
                initialValue={text}
              >
                <p></p>
                <ReactQuill
                  theme="snow"
                  placeholder="Введіть текст..."
                  value={text}
                  onChange={(str) => {
                    setText(str);
                  }}
                />
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
