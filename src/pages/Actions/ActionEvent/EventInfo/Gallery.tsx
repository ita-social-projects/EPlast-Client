import { EditFilled } from "@ant-design/icons";
import { Empty, Image, Modal, Spin, Typography } from "antd";
import React, { useEffect, useState } from "react";
import eventsApi from "../../../../api/eventsApi";
import { EventGallery } from "./EventInfo";
import "./EventInfo.less";
import FormAddPictures from "./FormAddPictures";

const { Title } = Typography;

interface Props {
  eventId: number;
  userAccesses: { [key: string]: boolean };
}

const FillGallery = (pictures: EventGallery[]) => {
  if (pictures.length === 0) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="Галерея події порожня"
      />
    );
  }
  return (
    <div className="galleryContainer">
      {pictures.map((picture) => {
        return (
          <div className="galleryPicture">
            <Image
              className="galleryImg"
              src={picture.fileName}
              key={picture.galleryId}
            />
          </div>
        );
      })}
    </div>
  );
};

const Gallery = ({ eventId, userAccesses }: Props) => {
  const [loading, setLoading] = useState(false);
  // @ts-ignore
  const [pictures, setPictures] = useState<EventGallery[]>([]);
  const [showAdminGallery, setShowAdminGallery] = useState<boolean>(false);

  const addPictures = (uploadedPictures: EventGallery[]) =>
    setPictures(pictures.concat(uploadedPictures));

  const removePicture = (pictureId: number) =>
    setPictures(pictures.filter((picture) => picture.galleryId !== pictureId));

  const GalleryAdministration = (): React.ReactNode => {
    return (
      <Modal
        title="Адміністрування галереї"
        visible={showAdminGallery}
        footer={null}
        onCancel={() => setShowAdminGallery(false)}
        className="admin-gallery-modal"
      >
        <div className="gallery-administration">
          <FormAddPictures
            eventId={eventId}
            updateGallery={addPictures}
            pictures={pictures}
            key="addPictures"
            removePicture={removePicture}
          />
        </div>
      </Modal>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await eventsApi.getPictures(eventId);
      setPictures(response.data);
      setLoading(true);
    };
    fetchData();
  }, []);

  return (
    <div>
      <div className="gallery-header">
        <Title level={2} style={{ color: "#3c5438" }}>
          Галерея
        </Title>
        {userAccesses["AddPhotos"] ? (
          <EditFilled
            className="edit-icon"
            onClick={() => setShowAdminGallery(true)}
          />
        ) : null}
      </div>
      {loading === false ? (
        <Spin tip="Завантаження..." />
      ) : (
        <>
          {FillGallery(pictures)}
          {GalleryAdministration()}
        </>
      )}
    </div>
  );
};
export default Gallery;
