import React from "react";
import { Form, Button, Upload, notification, Tooltip } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import eventsApi from "../../../../api/eventsApi";
import { EventGallery } from "./EventInfo";
import {
  updateNotification,
  failUpdatingNotification,
  loadingNotification,
  emptyPhotoListNotification,
  limitNotification,
} from "./GalleryNotifications";
import "./EventInfo.less";
interface Props {
  eventId: number;
  updateGallery: (uploadedPictures: EventGallery[]) => void;
  picturesCount: number;
}

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};

const dummyRequest = ({ file, onSuccess }: any) => {
  setTimeout(() => {
    onSuccess("ok");
  }, 0);
};

const FormAddPictures = ({ eventId, updateGallery, picturesCount }: Props) => {
  const [form] = Form.useForm();
  const MaxPicturesCount: number = 15;
  const addPictures = async (eventId: number, data: FormData) => {
    return await eventsApi.uploadPictures(eventId, data);
  };

  const handleSubmit = async (values: any) => {
    if (values.upload !== undefined) {
      if (picturesCount >= MaxPicturesCount) {
        notification.destroy();
        limitNotification(
          "Досягнуто ліміту фотографій у галереї подій!",
          `Максимальна кількість фотографій у галереї повинна не перевищувати ${MaxPicturesCount} штук.`
        );
      } else {
        if (
          values.upload.length > MaxPicturesCount ||
          values.upload.length > MaxPicturesCount - picturesCount
        ) {
          limitNotification(
            "Перевищено ліміт фотографій для завантаження!",
            "Зменшіть кількість вибраних фотографій для завантаження."
          );
        } else {
          loadingNotification();
          const data = new FormData();
          values.upload.forEach((element: any) => {
            data.append("files", element.originFileObj);
          });
          addPictures(eventId, data)
            .then(async (response) => {
              updateGallery(response.data);
              notification.destroy();
              updateNotification();
              form.resetFields();
            })
            .catch(() => {
              notification.destroy();
              failUpdatingNotification();
            });
        }
      }
    } else {
      notification.destroy();
      emptyPhotoListNotification();
    }
  };

  return (
    <Form
      name="validate_other"
      {...formItemLayout}
      initialValues={{
        ["input-number"]: 3,
        ["checkbox-group"]: ["A", "B"],
        rate: 3.5,
      }}
      form={form}
      onFinish={handleSubmit}
      style={{ display: "block", textAlign: "center", alignItems: "center" }}
    >
      <Form.Item
        name="upload"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        style={{
          maxHeight: "400px",
          overflow: "auto",
          justifyContent: "center",
          overflowX: "hidden",
        }}
      >
        <Upload
          name="gallery"
          listType="picture"
          multiple={true}
          accept=".jpg,.jpeg,.png"
          customRequest={dummyRequest}
        >
          <Tooltip
            placement="right"
            title={`Ліміт завантаження: до ${MaxPicturesCount} зображень.`}
          >
            <Button className="upploadButton">
              <UploadOutlined /> Додати фотографії
            </Button>
          </Tooltip>
        </Upload>
      </Form.Item>

      <Form.Item style={{ justifyContent: "center" }}>
        <Button type="primary" htmlType="submit">
          Завантажити
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FormAddPictures;
