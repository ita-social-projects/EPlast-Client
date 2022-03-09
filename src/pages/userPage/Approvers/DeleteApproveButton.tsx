import { Button } from "antd";
import React, { useState } from "react";

interface Props {
  approverId: number;
  deleteApprove: (event: number) => Promise<void>;
}

const DeleteApproveButton = (props: Props) => {
  const { approverId, deleteApprove } = props;
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <Button
      className="cardButton"
      danger
      loading={isLoading}
      onClick={() => {
        setIsLoading(true);
        deleteApprove(approverId);
      }}
      value={approverId}
    >
      Відкликати
    </Button>
  );
};

export default DeleteApproveButton;
