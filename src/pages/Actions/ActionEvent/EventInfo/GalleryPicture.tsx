import { DeleteFilled, EyeFilled, LoadingOutlined } from "@ant-design/icons";
import { notification, Popconfirm } from "antd";
import React, { useEffect, useState } from "react";
import eventsApi from "../../../../api/eventsApi";
import { ImagePreview } from "../../../../components/ImagePreview/ImagePreview";
import { EventGallery } from "../../../../models/Events/EventGallery";
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
      notification.success({ message: "Фотографію було успішно видалено." });
    } finally {
      setDeleteConfirmLoading(false);
    }
  };

  return (
    <div
      className={`gallery-picture${p.isEditing && !isLoading ? "-edit" : ""}`}
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
                icon={null}
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
          <ImagePreview
            key={picture?.galleryId}
            fileName={picture?.fileName}
            src={picture?.encodedData}
            visible={isPreviewVisible}
            onHide={() => setPreviewVisible(false)}
          />
        </>
      )}
    </div>
  );
};

export default GalleryPicture;
