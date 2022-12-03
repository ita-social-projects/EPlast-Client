import { CheckOutlined, EditFilled } from "@ant-design/icons";
import { Empty, Tooltip, Typography } from "antd";
import React, { useState } from "react";
import "./EventInfo.less";
import GalleryPicture from "./GalleryPicture";
import GalleryPictureAdd from "./GalleryPictureAdd";

const { Title } = Typography;

interface Props {
  eventId: number;
  userAccesses: { [key: string]: boolean };
  pictureList: number[];
}

const Gallery = ({ eventId, userAccesses, pictureList }: Props) => {
  const [loading, setLoading] = useState(true);
  // @ts-ignore
  const [pictures, setPictures] = useState<number[]>(pictureList);
  const [isEditing, setEditing] = useState<boolean>(false);

  const MaxPictureCount = 15;

  const addPictures = (uploadedPictureIds: number[]) => {
    setPictures([...pictures, ...uploadedPictureIds]);
  };

  const removePicture = (pictureId: number) =>
    setPictures(pictures.filter((picture) => picture !== pictureId));

  return (
    <div>
      <div className="gallery-header">
        <Title level={2} style={{ color: "#3c5438" }}>
          Галерея
        </Title>
        {userAccesses["AddPhotos"] ? (
          <>
            <Tooltip title="Редагувати галерею">
              <EditFilled
                style={{ display: isEditing ? "none" : "block" }}
                className="edit-icon"
                onClick={() => setEditing(true)}
              />
            </Tooltip>
            <Tooltip title="Завершити редагування галереї">
              <CheckOutlined
                style={{ display: isEditing ? "block" : "none" }}
                className="edit-icon"
                onClick={() => setEditing(false)}
              />
            </Tooltip>
          </>
        ) : null}
      </div>
      {pictures.length !== 0 || isEditing ? (
        <div className="galleryContainer">
          {pictures.map((picture) => {
            return (
              <GalleryPicture
                key={picture}
                pictureId={picture}
                isEditing={isEditing}
                removePictureHook={removePicture}
              />
            );
          })}
          {isEditing && pictures.length < MaxPictureCount ? (
            <GalleryPictureAdd
              eventId={eventId}
              pictureList={pictures}
              addPicturesHook={addPictures}
            />
          ) : null}
        </div>
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Галерея події порожня"
        />
      )}
    </div>
  );
};
export default Gallery;
