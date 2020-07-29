import React, {useEffect, useState} from "react";
import {Carousel} from "antd";
import {EventGallery} from "./EventInfo";
import EventPict1 from "../../../../assets/images/EventGallary(1).jpg";
import EventPict2 from "../../../../assets/images/EventGallary(2).jpg";
import EventPict3 from "../../../../assets/images/EventGallary(3).jpg";
import eventsApi from "../../../../api/eventsApi";

const classes = require("./EventInfo.module.css");

interface Props {
    eventId: number;
}

const Gallery = ({eventId}: Props) => {
    // @ts-ignore
    const [pictures, setPictures] = useState<EventGallery>([])

    useEffect(() => {
        const fetchData = async () => {
            const response = await eventsApi.getPictures(eventId);
            setPictures(response.data)
        };
        fetchData();
    }, []);
    return (
        <div>
            <h1 className={classes.mainTitle}>Галерея</h1>
            <Carousel autoplay className={classes.homeSlider}>
                <div>
                    <img src={EventPict1} alt="Picture1" className={classes.sliderImg}/>
                </div>
                <div>
                    <img src={EventPict2} alt="Picture2" className={classes.sliderImg}/>
                </div>
                <div>
                    <img src={EventPict3} alt="Picture3" className={classes.sliderImg}/>
                </div>
            </Carousel>
        </div>
    );
};
export default Gallery;
