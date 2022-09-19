import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Avatar, Button, Card, Layout, Modal, Tooltip } from "antd";
import {
  FileTextOutlined,
  CloseOutlined,
  RollbackOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { getFile, removeDocument } from "../../api/regionsApi";
import "../Regions/Region.less";
import Title from "antd/lib/typography/Title";
import moment from "moment";
import Spinner from "../Spinner/Spinner";
import AuthLocalStorage from "../../AuthLocalStorage";
import jwt from "jwt-decode";
import { getUserAccess, getDocs } from "../../api/regionsBoardApi";
import extendedTitleTooltip, {
  parameterMaxLength,
} from "../../components/Tooltip";

const RegionBoardDocuments = () => {
  const { id } = useParams();
  const history = useHistory();

  const [documents, setDocuments] = useState<any[]>([
    {
      id: "",
      submitDate: "",
      blobName: "",
      fileName: "",
      regionId: "",
    },
  ]);

  const [loading, setLoading] = useState<boolean>(false);
  const [userAccesses, setUserAccesses] = useState<{ [key: string]: boolean }>(
    {}
  );

  const getUserAccesses = async () => {
    setLoading(true);
    let user: any = jwt(AuthLocalStorage.getToken() as string);
    await getUserAccess(user.nameid).then((response) => {
      setUserAccesses(response.data);
    });
    setLoading(false);
  };

  const setRegionDocs = async () => {
    try {
      setLoading(true);
      const response = await getDocs(id);
      setDocuments(response.data);
    } finally {
    }
    setLoading(false);
  };

  const downloadDocument = async (fileBlob: string, fileName: string) => {
    await getFile(fileBlob, fileName);
  };

  const onClickRemoveDocument = async (document: any) => {
    Modal.confirm({
      title:
        "Ви впевнені, що хочете видалити даний документ із документообігу?",
      okText: "Так, видалити",
      okType: "primary",
      cancelText: "Скасувати",
      onCancel() {},
      async onOk() {
        await removeDocument(document.id);
        setDocuments(documents.filter((d) => d.id !== document.id));
      },
    });
  };

  useEffect(() => {
    getUserAccesses();
    setRegionDocs();
  }, []);

  return (
    <Layout.Content>
      <Title level={2}>Документообіг Крайового Проводу</Title>
      {loading ? (
        <Spinner />
      ) : (
        <div className="cityMoreItems">
          {documents.length > 0 ? (
            documents.map((document: any) => (
              <Card
                key={document.id}
                className="detailsCard"
                title={
                  document.submitDate
                    ? moment
                        .utc(document.submitDate)
                        .local()
                        .format("DD.MM.YYYY")
                    : "Немає дати"
                }
                headStyle={{ backgroundColor: "#3c5438", color: "#ffffff" }}
                actions={
                  userAccesses["ManipulateDocument"]
                    ? [
                      <Tooltip title="Завантажити документ">
                        <DownloadOutlined
                          key="download"
                          onClick={() =>
                            downloadDocument(
                              document.blobName,
                              document.fileName
                            )
                          }
                        />
                        </Tooltip>,

                        <Tooltip title="Видалити документ">
                          <CloseOutlined
                            key="close"
                            onClick={() => onClickRemoveDocument(document)}
                          />
                        </Tooltip>,
                      ]
                    : [
                        <DownloadOutlined
                          key="download"
                          onClick={() =>
                            downloadDocument(
                              document.blobName,
                              document.fileName
                            )
                          }
                        />,
                      ]
                }
              >
                <Avatar size={86} icon={<FileTextOutlined />} />
                <Card.Meta
                  className="detailsMeta"
                  title={extendedTitleTooltip(
                    parameterMaxLength,
                    document.fileName
                  )}
                />
              </Card>
            ))
          ) : (
            <Title level={4}>Ще немає документів Проводу</Title>
          )}
        </div>
      )}
      <div className="cityMoreItems">
        <Button
          className="backButton"
          icon={<RollbackOutlined />}
          size={"large"}
          onClick={() => history.goBack()}
          type="primary"
        >
          Назад
        </Button>
      </div>
    </Layout.Content>
  );
};

export default RegionBoardDocuments;
