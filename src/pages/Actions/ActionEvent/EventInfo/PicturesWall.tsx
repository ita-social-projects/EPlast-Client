import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons/lib";
import { Card, Col, Image, Modal, notification, Row } from "antd";
import React, { useState } from "react";
import eventsApi from "../../../../api/eventsApi";
import { failDeleteAction } from "../../../../components/Notifications/Messages";
import { EventGallery } from "../../../../models/Events/EventGallery";
import "./EventInfo.less";

interface Props {
  pictures: EventGallery[];
  removePicture: (pictureId: number) => void;
}

const PicturesWall = ({ pictures, removePicture }: Props) => {
  const [previewVisible, setPreviewVisibility] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewFileName, setPreviewFileName] = useState("");
  const deletePicture = async (id: number) => {
    return await eventsApi.removePicture(id);
  };

  function seeDeleteModal(photoId: number) {
    return Modal.confirm({
      title: "Ви впевнені, що хочете видалити це фото?",
      icon: <ExclamationCircleOutlined />,
      okText: "Так, видалити",
      okType: "primary",
      cancelText: "Скасувати",
      maskClosable: true,
      onCancel() {},
      onOk() {
        removePicture(photoId);
        deletePicture(photoId).catch(() =>
          notification.error({
            message: failDeleteAction("зображення"),
            duration: 3,
          })
        );
      },
    });
  }

  const RenderPictureWallActions = (
    picture: EventGallery
  ): React.ReactNode[] => {
    const pictureActions: React.ReactNode[] = [];
    pictureActions.push(
      <EyeOutlined
        className="eyeDetails"
        key="details"
        onClick={() => {
          setPreviewImage(picture.encodedData);
          setPreviewFileName(picture.fileName);
          setPreviewVisibility(true);
        }}
      />
    );
    pictureActions.push(
      <DeleteOutlined
        className="deletePicture"
        key="deletePicture"
        onClick={() => seeDeleteModal(picture.galleryId)}
      />
    );

    return pictureActions;
  };

  return (
    <Row className="picturesWall" justify="center">
      <Col
        span={24}
        style={{
          maxHeight: "500px",
          overflow: "auto",
          overflowX: "hidden",
        }}
      >
        <Row justify="center" gutter={[16, 8]}>
          {pictures.map((picture) => (
            <Col xs={24} md={12} lg={6} key={picture.galleryId}>
              <Card
                hoverable
                cover={
                  <img
                    style={{ height: "130px" }}
                    alt="example"
                    src={picture.fileName}
                  />
                }
                actions={RenderPictureWallActions(picture)}
                bodyStyle={{ display: "none" }}
              ></Card>
            </Col>
          ))}
          <Image
            alt="event picture"
            style={{ display: "none" }}
            preview={{
              visible: previewVisible,
              onVisibleChange: (val) => setPreviewVisibility(val),
            }}
            src={previewImage}
          />
        </Row>
      </Col>
    </Row>
  );
};

export default PicturesWall;
