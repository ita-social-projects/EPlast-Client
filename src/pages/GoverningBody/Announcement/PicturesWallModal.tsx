import React, { useState } from "react";
import { Card, Row, Col, Modal } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import Meta from "antd/lib/card/Meta";

export interface AnnouncementGallery {
  announcementId: number;
  fileName: string;
}

interface Props {
  pictures: AnnouncementGallery[];
}

const PicturesWall = ({ pictures }: Props) => {
  const [previewVisible, setPreviewVisibility] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  return (
    <Row className="picturesWall" justify="center">
      <Col>
        <Row justify="center">
          {pictures.map((picture) => (
            <Col key={picture.announcementId}>
              <Card
                style={{ textAlign: "center", cursor: "pointer" }}
                cover={<img alt="example" src={picture.fileName} />}
                onClick={() => {
                  setPreviewImage(picture.fileName);
                  setPreviewVisibility(true);
                }}
              >
                <Meta
                  title={<EyeOutlined className="eyeDetails" key="details" />}
                />
              </Card>
            </Col>
          ))}
          <Modal
            width="700px"
            visible={previewVisible}
            title="Перегляд картинки"
            footer={null}
            onCancel={() => setPreviewVisibility(false)}
          >
            <img alt="example" style={{ width: "100%" }} src={previewImage} />
          </Modal>
        </Row>
      </Col>
    </Row>
  );
};
export default PicturesWall;
