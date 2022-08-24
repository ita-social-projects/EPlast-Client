import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, notification, Tooltip, Upload } from "antd";
import React, { useState } from "react";
import eventsApi from "../../../../api/eventsApi";
import {
  fileIsTooBig,
  possibleFileExtensions,
} from "../../../../components/Notifications/Messages";
import notificationLogic from "../../../../components/Notifications/Notification";
import { EventGallery } from "./EventInfo";
import "./EventInfo.less";
import {
  emptyPhotoListNotification,
  failUpdatingNotification,
  limitNotification,
  loadingNotification,
  updateNotification,
} from "./GalleryNotifications";
import PicturesWall from "./PicturesWall";

interface Props {
  eventId: number;
  updateGallery: (uploadedPictures: EventGallery[]) => void;
  pictures: EventGallery[];
  removePicture: (pictureId: number) => void;
}

const FormAddPictures = ({
  eventId,
  updateGallery,
  pictures,
  removePicture,
}: Props) => {
  const [form] = Form.useForm();
  const [disabled, setDisabled] = useState(true);
  const [addDisabled, setAddDisabled] = useState(false);

  var ignoredFileIds: string[] = [];

  const MaxPicturesCount = 15;
  const MaxFileSize = 20971520;
  const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png"];
  const allowedExtensions = ["jpeg", "jpg", "png"];

  const addPictures = async (eventId: number, data: FormData) => {
    return await eventsApi.uploadPictures(eventId, data);
  };

  const checkAllFiles = (e: any) => {
    if (e.fileList.length + pictures.length >= MaxPicturesCount) {
      for (let i = 0; i < e.fileList.length; i++) {
        if (pictures.length + i + 1 > MaxPicturesCount)
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

  const handleSubmit = async (values: any) => {
    if (!values.upload) {
      emptyPhotoListNotification();
      return;
    }

    if (values.upload.length + pictures.length > MaxPicturesCount) {
      limitNotification(
        "Перевищено ліміт фотографій для завантаження!",
        "Зменшіть кількість обраних фотографій."
      );
      return;
    }

    loadingNotification();
    const picturesArray: any = [];
    try {
      for (var i = 0; i < values.upload.length; i++) {
        const data = new FormData();
        data.append("files", values.upload[i].originFileObj);
        console.log(data);
        addPictures(eventId, data).then((response) => {
          console.log(response.data);
          picturesArray.push(response.data);
        });
      }

      updateGallery(picturesArray);
      notification.destroy();
      updateNotification();
      form.resetFields();
      setDisabled(true);
    } catch {
      notification.destroy();
      failUpdatingNotification();
    }
  };

  return (
    <>
      <PicturesWall pictures={pictures} removePicture={removePicture} />
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
          >
            {pictures.length < MaxPicturesCount ? (
              <Tooltip
                placement="right"
                title={`Ліміт завантаження: до ${MaxPicturesCount} зображень.`}
              >
                <Button className="upploadButton" disabled={addDisabled}>
                  <UploadOutlined /> Додати фотографії
                </Button>
              </Tooltip>
            ) : null}
          </Upload>
        </Form.Item>
        {pictures.length < MaxPicturesCount ? (
          <Button type="primary" htmlType="submit" disabled={disabled}>
            Завантажити
          </Button>
        ) : null}
      </Form>
    </>
  );
};

export default FormAddPictures;
