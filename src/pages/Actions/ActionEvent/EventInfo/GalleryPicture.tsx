import { DeleteFilled, EyeFilled, LoadingOutlined } from "@ant-design/icons";
import { Image, Popconfirm } from "antd";
import React, { useEffect, useState } from "react";
import eventsApi from "../../../../api/eventsApi";
import { EventGallery } from "./EventInfo";
import "./GalleryPicture.less";

interface ImageProps {
  pictureId: number;
  isEditing: boolean;
  removePictureHook: (id: number) => void;
}

const GalleryPicture: React.FC<ImageProps> = (p: ImageProps) => {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [picture, setPicture] = useState<EventGallery>();
  const [isPreviewVisible, setPreviewVisible] = useState<boolean>(false);

  const [isDeleteConfirmLoading, setDeleteConfirmLoading] = useState<boolean>(
    false
  );

  const fetchData = async () => {
    try {
      let imageData = await eventsApi.getPictureById(p.pictureId);
      setPicture(imageData.data);
      setLoading(false);
    } catch {
      setLoading(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, [p.pictureId]);

  const onDelete = async () => {
    setDeleteConfirmLoading(true);
    try {
      await eventsApi.removePicture(p.pictureId);
      p.removePictureHook(p.pictureId);
    } finally {
      setDeleteConfirmLoading(false);
    }
  };

  return (
    <div
      className={`gallery-picture${p.isEditing && !isLoading ? "-edit" : ""}`}
      // style={
      //   p.isEditing && !isLoading
      //     ? {
      //         background: `url(${picture?.encodedData})`,
      //         backgroundSize: "contain",
      //       }
      //     : {}
      // }
    >
      {isLoading ? (
        <LoadingOutlined className="loading-icon" />
      ) : (
        <>
          {p.isEditing ? (
            <>
              <EyeFilled
                className="edit-icon"
                onClick={() => setPreviewVisible(true)}
              />
              <Popconfirm
                title="Видалити фото?"
                onConfirm={onDelete}
                okButtonProps={{
                  loading: isDeleteConfirmLoading,
                  danger: true,
                }}
              >
                <DeleteFilled className="edit-icon" />
              </Popconfirm>
            </>
          ) : null}
          <img
            src={picture?.encodedData}
            onClick={p.isEditing ? undefined : () => setPreviewVisible(true)}
          />
          <Image
            src={picture?.encodedData}
            style={{ display: "none" }}
            preview={{
              visible: isPreviewVisible,
              onVisibleChange: (value) => setPreviewVisible(value),
            }}
          />
        </>
      )}
    </div>
  );
};

export default GalleryPicture;
