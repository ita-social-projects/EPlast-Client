import React, { useState } from "react";
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
import notificationLogic from "../../../../components/Notifications/Notification";
import {
  possibleFileExtensions,
  fileIsTooBig,
} from "../../../../components/Notifications/Messages";
interface Props {
  eventId: number;
  updateGallery: (uploadedPictures: EventGallery[]) => void;
  picturesCount: number;
}

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const FormAddPictures = ({ eventId, updateGallery, picturesCount }: Props) => {
  const [form] = Form.useForm();
  const [disabled, setDisabled] = useState(true);
  const MaxPicturesCount: number = 15;
  const addPictures = async (eventId: number, data: FormData) => {
    return await eventsApi.uploadPictures(eventId, data);
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    var arrayStatuses: any[] = [];
    for (var i of e.fileList) {
      i.status =
        i.originFileObj.size <= 20971520 &&
        (i.originFileObj.type === "image/jpeg" ||
          i.originFileObj.type === "image/jpg" ||
          i.originFileObj.type === "image/png")
          ? "done"
          : "error";
      arrayStatuses.push(i.status);
    }
    if (arrayStatuses.includes("error") || e.fileList.length === 0) {
      notification.destroy();
      emptyPhotoListNotification();
      setDisabled(true);
    } else {
      setDisabled(false);
    }
    return e && e.fileList;
  };

  const checkFile = (size: number, fileName: string) => {
    const extension = fileName.split(".").reverse()[0].toLowerCase();
    const isCorrectExtension =
      extension.indexOf("jpeg") !== -1 ||
      extension.indexOf("jpg") !== -1 ||
      extension.indexOf("png") !== -1;
    if (!isCorrectExtension) {
      notificationLogic("error", possibleFileExtensions("png, jpg, jpeg"));
    }

    const isSmaller20mb = size <= 20971520;
    if (!isSmaller20mb) {
      notificationLogic("error", fileIsTooBig(20));
    }

    return isCorrectExtension && isSmaller20mb;
  };

  const handleUpload = async ({ file, onSuccess }: any) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
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

          const picturesArray: any = [];
          try {
            for (var i = 0; i < values.upload.length; i++) {
              const data = new FormData();
              data.append("files", values.upload[i].originFileObj);
              await addPictures(eventId, data).then(async (response) => {
                picturesArray.push(response.data);
              });
            }
            let merget = [].concat.apply([], picturesArray);
            updateGallery(merget);
            notification.destroy();
            updateNotification();
            form.resetFields();
          } catch {
            notification.destroy();
            failUpdatingNotification();
          }
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
          beforeUpload={(e) => checkFile(e.size, e.name)}
          name="gallery"
          listType="picture"
          multiple={true}
          accept=".jpg,.jpeg,.png"
          customRequest={handleUpload}
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
        <Button type="primary" htmlType="submit" disabled={disabled}>
          Завантажити
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FormAddPictures;
