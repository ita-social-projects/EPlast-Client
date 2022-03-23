import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Avatar, Button, Card, Layout, Modal } from "antd";
import {
  FileTextOutlined,
  CloseOutlined,
  RollbackOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import {
  getAllDocuments,
  getFile,
  removeDocument,
  getUserAccess,
} from "../../../api/governingBodiesApi";
import "../../City/City/City.less";
import GoverningBodyDocument from "../../../models/GoverningBody/GoverningBodyDocument";
import Title from "antd/lib/typography/Title";
import moment from "moment";
import Spinner from "../../Spinner/Spinner";
import AuthStore from "../../../stores/AuthStore";
import jwt from "jwt-decode";
import extendedTitleTooltip, {
  parameterMaxLength,
} from "../../../components/Tooltip";

const GoverningBodyDocuments = () => {
  const confirm = Modal.confirm;
  const { id } = useParams();
  const history = useHistory();

  const [documents, setDocuments] = useState<GoverningBodyDocument[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [userAccesses, setUserAccesses] = useState<{ [key: string]: boolean }>(
    {}
  );

  const getDocuments = async () => {
    setLoading(true);
    const response = await getAllDocuments(id);
    await getUserAccesses();
    setDocuments(response.data.documents);
    setLoading(false);
  };

  const getUserAccesses = async () => {
    let user: any = jwt(AuthStore.getToken() as string);
    await getUserAccess(user.nameid).then((response) => {
      setUserAccesses(response.data);
    });
  };

  const downloadDocument = async (fileBlob: string, fileName: string) => {
    await getFile(fileBlob, fileName);
  };

  const deleteDocument = async (document: GoverningBodyDocument) => {
    confirm({
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
    getDocuments();
  }, []);

  return (
    <Layout.Content>
      <Title level={2}>Документообіг керівного органу</Title>
      {loading ? (
        <Spinner />
      ) : (
        <div className="cityMoreItems">
          {documents.length > 0 ? (
            documents.map((document: GoverningBodyDocument) => (
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
                        <DownloadOutlined
                          key="download"
                          onClick={() =>
                            downloadDocument(
                              document.blobName,
                              document.fileName
                            )
                          }
                        />,
                        <CloseOutlined
                          key="close"
                          onClick={() => deleteDocument(document)}
                        />,
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
                    document.governingBodyDocumentType.name
                  )}
                />
              </Card>
            ))
          ) : (
            <Title level={4}>Ще немає документів Керівного Органу</Title>
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

export default GoverningBodyDocuments;
