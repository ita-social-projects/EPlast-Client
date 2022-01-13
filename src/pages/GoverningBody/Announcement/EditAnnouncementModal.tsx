import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col, Drawer, Upload } from "antd";
import formclasses from "./Form.module.css";
import {
  emptyInput,
  maxLength,
} from "../../../components/Notifications/Messages";
import {
  getAnnouncementsById
} from "../../../api/governingBodiesApi";
import ReactQuill from "react-quill";

interface Props {
  visibleModal: boolean;
  id: number;
  setVisibleModal: (visibleModal: boolean) => void;
  onEdit: (id: number, text: string, images: string[]) => void;
}  

const EditAnnouncementModal = ({visibleModal, setVisibleModal, onEdit, id}: Props) => {
  const [form] = Form.useForm();
  const [text, setText] = useState<string>("");
  const [uploadImages, setUploadImages] = useState<any[]>([]);

  useEffect(() => {
    getAnnouncement(id);
  }, [id])

  function getUid() {
    return (new Date()).getTime();
  }
  
  const getAnnouncement = async(id: number) => {
    await getAnnouncementsById(id)
    .then(response => {
      setText(response.data.text);
      response.data.images.map((image:any) => 
        {
          setUploadImages(uploadImages=>[...uploadImages, {
            url: image.imageBase64,
            uid: getUid(),
            type:"image/jpg"
          }]);
        });
      // Замінити тип сплітом
    })
    .catch((err) => {
      console.log(err);
    })
  };    

  const handleCancel = () => {
    setUploadImages([]);
    setVisibleModal(false);
  };

  const handleUpload = (images: any) => {
    setUploadImages(images.fileList);
  };

  const handleSubmit = (values: any) => {    
    setVisibleModal(false);
    form.resetFields();
    let imgs = uploadImages.map((image: any)=>
    {
      return image.url || image.thumbUrl;
    })
    onEdit(id, text, imgs);
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
              className="iputFortText"
              // замінити клас
              theme="snow"
              placeholder="Введіть текст..."
              value={text}
              onChange={str=>{setText(str)}}
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
          {'Upload'}
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
  </Drawer>
  );
};

export default EditAnnouncementModal;

