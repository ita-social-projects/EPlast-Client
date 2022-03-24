import React, { useState } from "react";
import { Card, Row, Col, Modal } from "antd";
import { EyeOutlined } from "@ant-design/icons";

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


    const RenderPictureWallActions = (
        pictureInBase64: string
    ): React.ReactNode[] => {
        const pictureActions: React.ReactNode[] = [];
        pictureActions.push(
            <EyeOutlined
                className="eyeDetails"
                key="details"
                onClick={() => {
                    setPreviewImage(pictureInBase64);
                    setPreviewVisibility(true);
                }}
            />
        );
        return pictureActions;
    };

    return (
        <Row
          className="picturesWall"
          justify="center"
          style={{ marginBottom: "15px" }}
        >
          <Col
            span={16}
            style={{ maxHeight: "400px", overflow: "auto", overflowX: "hidden" }}
          >
            <Row justify="center">
              {pictures.map((picture) => (
                <Col key={picture.announcementId}>
                  <Card
                    hoverable
                    cover={
                      <img
                        style={{ height: "130px" }}
                        alt="example"
                        src={picture.fileName}
                      />
                    }
                    actions={RenderPictureWallActions(
                      picture.fileName
                    )}
                    bodyStyle={{ display: "none" }}
                  ></Card>
                </Col>
              ))}
              <Modal
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