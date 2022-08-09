import React, { useEffect, useState } from "react";
import { Carousel, Spin, Image, Typography, Alert, Empty, Grid, Row, Col, Divider } from "antd";
import { EventGallery } from "./EventInfo";
import eventsApi from "../../../../api/eventsApi";
import FormAddPictures from "./FormAddPictures";
import PicturesWall from "./PicturesWall";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import "./EventInfo.less";

const { Title } = Typography;

interface Props {
  eventId: number;
  userAccesses: { [key: string]: boolean };
}

const GallerySpinner = () => (
  <div>
    <Title level={2} style={{ color: "#3c5438" }}>
      Галерея
    </Title>
    <Carousel autoplay={false} className="homeSlider">
      <Spin tip="Завантаження...">
        <Alert
          message="Зачекайте будь ласка."
          description="Завантаження фотографій може зайняти певний час."
          type="info"
        />
      </Spin>
    </Carousel>
  </div>
);

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

  const addPictures = (uploadedPictures: EventGallery[]) =>
    setPictures(pictures.concat(uploadedPictures));
  const removePicture = (pictureId: number) =>
    setPictures(pictures.filter((picture) => picture.galleryId !== pictureId));
  const GalleryAdministration = (): React.ReactNode[] => {
    if (userAccesses["AddPhotos"]) {
      return [
        <div>
          <Divider/>
          <Title
            level={3}
            style={{
              color: "#3c5438",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            key="spinnerTitle"
          >
            Адміністрування галереї
          </Title>
          <FormAddPictures
            eventId={eventId}
            updateGallery={addPictures}
            picturesCount={pictures.length}
            key="addPictures"
          />
          <PicturesWall
            pictures={pictures}
            removePicture={removePicture}
            key="removePictures"
          />
        </div>,
      ];
    } else return [];
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await eventsApi.getPictures(eventId);
      setPictures(response.data);
      setLoading(true);
    };
    fetchData();
  }, []);
  return loading === false ? (
    GallerySpinner()
  ) : (
    <div>
      <Title level={2} style={{ color: "#3c5438" }}>
        Галерея
      </Title>
      {FillGallery(pictures)}
      {GalleryAdministration()}
    </div>
  );
};
export default Gallery;
