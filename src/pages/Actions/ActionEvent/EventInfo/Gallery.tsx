<<<<<<< HEAD
import React from "react";
import { Carousel } from "antd";
import EventPict1 from "../../../../assets/images/EventGallary(1).jpg";
import EventPict2 from "../../../../assets/images/EventGallary(2).jpg";
import EventPict3 from "../../../../assets/images/EventGallary(3).jpg";

const classes = require("./EventInfo.module.css");

const Gallery = () => {
  return (
    <div>
      <h1 className={classes.mainTitle}>Галерея</h1>
      <Carousel autoplay className={classes.homeSlider}>
        <div>
          <img src={EventPict1} alt="Picture1" className={classes.sliderImg} />
        </div>
        <div>
          <img src={EventPict2} alt="Picture2" className={classes.sliderImg} />
        </div>
        <div>
          <img src={EventPict3} alt="Picture3" className={classes.sliderImg} />
        </div>
      </Carousel>
    </div>
  );
};
export default Gallery;
=======
import React, {useEffect, useState} from "react";
import {Carousel, Spin, Avatar, Typography , Alert, Empty} from "antd";
import {EventGallery} from "./EventInfo";
import eventsApi from "../../../../api/eventsApi";
import FormAddPictures from "./FormAddPictures";
import PicturesWall from "./PicturesWall";

const classes = require("./EventInfo.module.css");

const { Title } = Typography;

interface Props {
    eventId: number;
    isUserEventAdmin: boolean;
}

const GallerySpinner = () => (
    <div>
        <Title level={2} style={{color:'#3c5438'}}>Галерея</Title>
        <Carousel autoplay={false} className={classes.homeSlider}
        >
            <Spin tip="Завантаження...">
                <Alert
                    message="Зачекайте будь ласка."
                    description="Завантаження фотографій може зайняти певний час."
                    type="info"
                />
            </Spin>
        </Carousel>
    </div>);

const FillGallery = (pictures: EventGallery[]) => {
    if (pictures.length === 0) {
        return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Галерея події порожня'/>
    }
    return (<Carousel autoplay={false} className={classes.homeSlider}
    >
        {
            pictures.map(picture => {
                return <Avatar shape="square" size={350} src={picture.fileName} key={picture.galleryId}/>
            })
        }
    </Carousel>)
}

const Gallery = ({eventId, isUserEventAdmin}: Props) => {
    const [loading, setLoading] = useState(false);
    // @ts-ignore
    const [pictures, setPictures] = useState<EventGallery[]>([])

    const addPictures = (uploadedPictures: EventGallery[]) => setPictures(pictures.concat(uploadedPictures));
    const removePicture = (pictureId: number) => setPictures(pictures.filter(picture => picture.galleryId !== pictureId))
    const GalleryAdministration = (): React.ReactNode[] => {
        if (isUserEventAdmin) {
            return [
                <Title level={2} style={{color:'#3c5438'}} key='spinnerTitle'>Адміністрування галереї</Title>,
                <FormAddPictures eventId={eventId} updateGallery={addPictures} picturesCount={pictures.length} key='addPictures'/>,
                <PicturesWall pictures={pictures} removePicture={removePicture}  key='removePictures'/>
            ];
        } else return [];
    }

    useEffect(() => {
        const fetchData = async () => {
            const response = await eventsApi.getPictures(eventId);
            setPictures(response.data);
            setLoading(true);
        };
        fetchData();
    }, []);
    return loading === false ? GallerySpinner() : (
        <div>
            <Title level={2} style={{color:'#3c5438'}} >Галерея</Title>
            {FillGallery(pictures)}
            {GalleryAdministration()}
        </div>
    );
};
export default Gallery;
>>>>>>> 5f13343c48a83b4427c8b26e0f4ee86ad7bf0544
