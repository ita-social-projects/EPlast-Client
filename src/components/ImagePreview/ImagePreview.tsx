import { Modal } from "antd";
import React, { useRef } from "react";
import "./ImagePreview.less";

interface ImagePreviewProps {
  fileName: string | undefined;
  src: string | undefined;
  visible: boolean;
  onHide: () => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = (
  p: ImagePreviewProps
) => {
  const imageRef = useRef<HTMLImageElement>(null);

  return (
    <Modal
      className="modal-wrapper"
      visible={p.visible}
      footer={null}
      onCancel={() => p.onHide()}
    >
      <span className="file-name">{p.fileName}</span>
      <img className="image" ref={imageRef} src={p.src} />
    </Modal>
  );
};
