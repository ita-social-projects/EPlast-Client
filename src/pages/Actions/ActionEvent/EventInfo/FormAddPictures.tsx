import { InfoCircleFilled, PlusOutlined } from "@ant-design/icons";
import { Button, Divider, Form, notification, Upload } from "antd";
import { RcFile, UploadFile } from "antd/lib/upload/interface";
import React, { useState } from "react";
import eventsApi from "../../../../api/eventsApi";
import { ImagePreview } from "../../../../components/ImagePreview/ImagePreview";
import {
  fileIsTooBig,
  possibleFileExtensions,
} from "../../../../components/Notifications/Messages";
import notificationLogic from "../../../../components/Notifications/Notification";
import "./EventInfo.less";
import {
  emptyPhotoListNotification,
  failUpdatingNotification,
  limitNotification,
  loadingNotification,
  updateNotification,
} from "./GalleryNotifications";

interface Props {
  eventId: number;
  addPicturesHook: (pictures: number[]) => void;
  pictureList: number[];
}

const FormAddPictures = (p: Props) => {
  const [form] = Form.useForm();
  const [disabled, setDisabled] = useState(true);
  const [addDisabled, setAddDisabled] = useState(false);

  const [isPreviewVisible, setPreviewVisible] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>();
  const [previewFileName, setPreviewFileName] = useState<string>();

  const [isUploading, setUploading] = useState<boolean>(false);

  var ignoredFileIds: string[] = [];

  const MaxPicturesCount = 15;
  const MaxFileSize = 20971520;
  const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png"];
  const allowedExtensions = ["jpeg", "jpg", "png"];

  const addPictures = async (eventId: number, data: FormData) => {
    return await eventsApi.uploadPictures(eventId, data);
  };

  const checkAllFiles = (e: any) => {
    if (e.fileList.length + p.pictureList.length >= MaxPicturesCount) {
      for (let i = 0; i < e.fileList.length; i++) {
        if (p.pictureList.length + i + 1 > MaxPicturesCount)
          ignoredFileIds.push(e.fileList[i].uid);
      }
      setAddDisabled(true);
    } else {
      setAddDisabled(false);
    }

    let filteredFiles = e.fileList.filter(
      (f: any) =>
        !ignoredFileIds.includes(f.uid) &&
        f.originFileObj.size <= MaxFileSize &&
        allowedMimeTypes.includes(f.originFileObj.type)
    );

    setDisabled(filteredFiles.length === 0);
    return filteredFiles;
  };

  const checkFile = (size: number, fileName: string) => {
    const extension = fileName.split(".").reverse()[0].toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      notificationLogic("error", possibleFileExtensions("png, jpg, jpeg"));
    }

    const isSmaller20mb = size <= MaxFileSize;
    if (!isSmaller20mb) {
      notificationLogic("error", fileIsTooBig(20));
    }

    /* this function has to return false
    to prevent ant from automatically
    starting the upload process*/
    return false;
  };

  const handleUpload = async () => {
    // has to be empty, because we use our custom logic
    return;
  };

  const handlePreview = (file: UploadFile) => {
    let reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
      setPreviewFileName(file.name);
      setPreviewVisible(true);
    };
    reader.readAsDataURL(file.originFileObj as RcFile);
  };

  const handleSubmit = async (values: any) => {
    setUploading(true);
    if (!values.upload) {
      emptyPhotoListNotification();
      return;
    }

    if (values.upload.length + p.pictureList.length > MaxPicturesCount) {
      limitNotification(
        "Перевищено ліміт фотографій для завантаження!",
        "Зменшіть кількість обраних фотографій."
      );
      return;
    }

    loadingNotification();
    try {
      let picturesArray: number[] = [];
      for (var i = 0; i < values.upload.length; i++) {
        const data = new FormData();
        data.append("files", values.upload[i].originFileObj);
        let response = await addPictures(p.eventId, data);
        picturesArray.push(response.data[0]);
      }

      p.addPicturesHook(picturesArray);
      notification.destroy();
      updateNotification();
      form.resetFields();
      setDisabled(true);
    } catch {
      notification.destroy();
      failUpdatingNotification();
    }
    setUploading(false);
  };

  return (
    <>
      <div className="modal-warning">
        <InfoCircleFilled className="modal-warning-icon" />
        <p className="modal-warning-description">
          Допустимі розширення файлів - <strong>.jpg, .jpeg і .png</strong>.
          <br />
          Максимальний розмір файлу - <strong>20 Мб</strong>.
          <br />
          Максимальна кількість фото в галереї - <strong>15</strong>.
        </p>
      </div>
      <Divider />
      <Form form={form} onFinish={handleSubmit}>
        <Form.Item
          name="upload"
          valuePropName="fileList"
          getValueFromEvent={checkAllFiles}
          style={{
            maxHeight: "400px",
            overflowY: "auto",
            justifyContent: "center",
          }}
        >
          <Upload
            beforeUpload={(e) => checkFile(e.size, e.name)}
            name="gallery"
            multiple={true}
            accept=".jpg,.jpeg,.png"
            customRequest={handleUpload}
            listType="picture-card"
            onPreview={handlePreview}
          >
            {p.pictureList.length < MaxPicturesCount && !addDisabled ? (
              <div className="upload-button">
                <PlusOutlined />
                Додати файл
              </div>
            ) : null}
          </Upload>
        </Form.Item>
        {p.pictureList.length < MaxPicturesCount ? (
          <Button
            type="primary"
            style={{ width: "100%" }}
            htmlType="submit"
            disabled={disabled}
            loading={isUploading}
          >
            Завантажити
          </Button>
        ) : null}
      </Form>
      <ImagePreview
        src={previewImage}
        fileName={previewFileName}
        visible={isPreviewVisible}
        onHide={() => setPreviewVisible(false)}
      />
    </>
  );
};

export default FormAddPictures;
