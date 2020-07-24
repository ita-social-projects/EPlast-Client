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
