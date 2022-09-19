import { Button } from "antd";
import React, { useState } from "react";

interface Props {
  approverId: number;
  onDeleteApprove: (id: number) => Promise<void>;
}

const DeleteApproveButton = (props: Props) => {
  const { approverId, onDeleteApprove } = props;
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <Button
      className="cardButton"
      danger
      loading={isLoading}
      onClick={() => {
        setIsLoading(true);
        onDeleteApprove(approverId);
      }}
      value={approverId}
    >
      Відкликати
    </Button>
  );
};

export default DeleteApproveButton;
