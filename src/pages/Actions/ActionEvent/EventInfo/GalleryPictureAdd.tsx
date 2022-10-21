import { PlusOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import React, { useState } from "react";
import FormAddPictures from "./FormAddPictures";
import "./GalleryPicture.less";

interface AddPictureProps {
  eventId: number;
  pictureList: number[];
  addPicturesHook: (pictures: number[]) => void;
}

const GalleryPictureAdd: React.FC<AddPictureProps> = (p: AddPictureProps) => {
  const [isModalVisible, setModalVisible] = useState<boolean>(false);

  return (
    <div className="gallery-picture-add">
      <PlusOutlined
        className="plus-icon"
        onClick={() => setModalVisible(true)}
      />
      <Modal
        title="Завантаження фото"
        visible={isModalVisible}
        footer={null}
        onCancel={() => setModalVisible(false)}
      >
        <FormAddPictures
          eventId={p.eventId}
          addPicturesHook={p.addPicturesHook}
          pictureList={p.pictureList}
        />
      </Modal>
    </div>
  );
};

export default GalleryPictureAdd;
