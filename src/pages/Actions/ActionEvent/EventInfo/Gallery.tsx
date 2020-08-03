import React, {useEffect, useState} from "react";
import {Carousel, Space, Spin, Avatar, Pagination, Alert, Empty} from "antd";
import {EventGallery} from "./EventInfo";
import EventPict1 from "../../../../assets/images/EventGallary(1).jpg";
import EventPict2 from "../../../../assets/images/EventGallary(2).jpg";
import EventPict3 from "../../../../assets/images/EventGallary(3).jpg";
import eventsApi from "../../../../api/eventsApi";
import spinClasses from "../EventUser/EventUser.module.css";
import {UserOutlined} from "@ant-design/icons";
import Demo from "./FormAddPictures";
import PicturesWall from "./PicturesWall";

const classes = require("./EventInfo.module.css");

interface Props {
    eventId: number;
    isUserEventAdmin: boolean;
}

const GallerySpinner = () => (
    <div>
        <h1 className={classes.mainTitle}>Галерея</h1>
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
                      afterChange={currentSlide => console.log(currentSlide)}
                      beforeChange={(from, to) => console.log(`From:${from},To:${to}`)}
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
                <h1 className={classes.mainTitle}>Адміністрування галереї</h1>,
                <Demo eventId={eventId} updateGallery={addPictures} picturesCount={pictures.length}/>,
                <PicturesWall pictures={pictures} removePicture={removePicture}/>
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
            <h1 className={classes.mainTitle}>Галерея</h1>
            {FillGallery(pictures)}
            {GalleryAdministration()}
        </div>
    );
};
export default Gallery;
