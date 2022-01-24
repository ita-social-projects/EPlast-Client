import { Card, Row, Col, Modal } from 'antd';
import React, { useState, useEffect, useContext } from 'react';
import { EyeOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons/lib";
import aboutBase from '../../api/aboutBase';
import { Context } from './FormEditSubsection';

interface SubsectionPictures {
  pictureId: number;
  fileName: string;
}

const PicturesWallEdit = (subsectionId: any) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [pictures, setPictures] = useState<SubsectionPictures[]>([]);
  const removePicture = (pictureId: number) => setPictures(pictures.filter(picture => picture.pictureId !== pictureId))

  const { getCountPicturesDelete } = useContext<any>(Context);

  const deletePicture = async (id: number) => {
    return await aboutBase.removeSubsectionPicture(id);
  };

  function seeDeleteModal(photoId: number) {
    return Modal.confirm({
      title: "Ви впевнені, що хочете видалити це фото?",
      icon: <ExclamationCircleOutlined />,
      okText: "Так, видалити",
      okType: "primary",
      cancelText: "Скасувати",
      maskClosable: true,
      onOk() {
        removePicture(photoId);
        getCountPicturesDelete();
      },
    });
  }

  const fetchData = async () => {
    const response = (await aboutBase.getSubsectionPictures(subsectionId.subsectionId)).data;
    setPictures(response);
  };

  useEffect(() => {
    fetchData();
  }, [subsectionId.subsectionId]);

  const RenderPictureWallActions = (id: number, pictureInBase64: string): React.ReactNode[] => {
    const pictureActions: React.ReactNode[] = []
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
    pictureActions.push(
      <DeleteOutlined
        className="deletePicture"
        key="deletePicture"
        onClick={() => {
          deletePicture(id)
            .then(() => seeDeleteModal(id))
        }
        }
      />
    );

    return pictureActions;
  }

  return (
    <Row justify='start' style={{ marginBottom: '15px' }}>
      <Col span={24} style={{ overflow: 'auto' }}>
        <Row justify='start'>
          {
            pictures.map(picture => <Col xs={12} sm={12} key={picture.pictureId}>
              <Card
                hoverable
                cover={<img style={{ height: '130px' }} alt="example"
                  src={picture.fileName} />}
                actions={RenderPictureWallActions(picture.pictureId, picture.fileName)}
                bodyStyle={{ display: 'none' }}
              >
              </Card>
            </Col>)
          }
          <Modal
            visible={previewVisible}
            title='Перегляд картинки'
            footer={null}
            onCancel={() => setPreviewVisible(false)}
          >
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </Row>
      </Col>
    </Row>
  )
}

export default PicturesWallEdit;