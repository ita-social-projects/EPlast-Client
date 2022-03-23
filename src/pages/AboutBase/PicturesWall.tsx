import { Card, Row, Col, Modal } from "antd";
import React, { useState, useEffect } from "react";
import { EyeOutlined } from "@ant-design/icons/lib";
import aboutBase from "../../api/aboutBase";

interface SubsectionPictures {
  picturesId: number;
  fileName: string;
}

const PicturesWall = (subsectionId: any) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [pictures, setPictures] = useState<SubsectionPictures[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await aboutBase.getSubsectionPictures(
        subsectionId.subsectionId
      );
      setPictures(response.data);
    };
    fetchData();
  }, []);

  const RenderPictureWallActions = (
    id: number,
    pictureInBase64: string
  ): React.ReactNode[] => {
    const pictureActions: React.ReactNode[] = [];
    pictureActions.push(
      <EyeOutlined
        className="eyeDetails"
        key="details"
        onClick={() => {
          setPreviewImage(pictureInBase64);
          setPreviewVisible(true);
        }}
      />
    );

    return pictureActions;
  };

  return (
    <Row justify="start" style={{ marginBottom: "15px" }}>
      <Col span={16} style={{ overflow: "auto" }}>
        <Row justify="start">
          {pictures.map((picture) => (
            <Col xs={24} md={12} lg={6} key={picture.picturesId}>
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
                  picture.picturesId,
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
            onCancel={() => setPreviewVisible(false)}
          >
            <img alt="example" style={{ width: "100%" }} src={previewImage} />
          </Modal>
        </Row>
      </Col>
    </Row>
  );
};

export default PicturesWall;
