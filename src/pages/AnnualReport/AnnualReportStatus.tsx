import { Modal, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import AnnualReportApi from "../../api/AnnualReportApi";

const setTagColor = (status: number) => {
  let color = "blue";
  if (status == 0) {
    color = "red";
  }
  if (status == 1) {
    color = "green";
  }
  return color;
};

interface Props {
  status: number;
}

const StatusStamp = (props: Props) => {
  const { status } = props;
  const [reportStatusNames, setReportStatusNames] = useState<any[]>(Array());
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    fetchAnnualReportStatuses();
  }, [status]);

  const fetchAnnualReportStatuses = async () => {
    setIsLoading(true);
    try {
      let response = await AnnualReportApi.getAnnualReportStatuses();
      setReportStatusNames(response.data.statuses);
    } catch (error) {
      showError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const showError = (message: string) => {
    Modal.error({
      title: "Помилка!",
      content: message,
      onOk: () => {
        history.goBack();
      },
    });
  };

  return isLoading ? null : (
    <Tag
      className="status-stamp"
      color={setTagColor(status)}
      key={reportStatusNames[status]}
    >
      {reportStatusNames[status]}
    </Tag>
  );
};
export default StatusStamp;
