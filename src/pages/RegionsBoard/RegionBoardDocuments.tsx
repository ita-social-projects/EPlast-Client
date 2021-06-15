import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Avatar, Button, Card, Layout, Spin } from "antd";
import {
  FileTextOutlined,
  CloseOutlined,
  RollbackOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import {
  getRegionDocuments,
  getFile,
  removeDocument,
} from "../../api/regionsApi";
import "../Regions/Region.less";
import Title from "antd/lib/typography/Title";
import moment from "moment";
import Spinner from "../Spinner/Spinner";
import AuthStore from '../../stores/AuthStore';
import jwt from 'jwt-decode';
import { getUserAccess } from "../../api/regionsBoardApi";

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
  const [userAccesses, setUserAccesses] = useState<{[key: string] : boolean}>({});

  const getUserAccesses = async () => {
    let user: any = jwt(AuthStore.getToken() as string);
    await getUserAccess(user.nameid).then(
      response => {
        setUserAccesses(response.data);
      }
    );
  }

  const setRegionDocs = async () => {
    try {
      const response = await getRegionDocuments(id);
      setDocuments(response.data);
    } finally {
    }
  };

  const downloadDocument = async (fileBlob: string, fileName: string) => {
    await getFile(fileBlob, fileName);
  };

  const removeDocumentById = async (documentId: number) => {
    await removeDocument(documentId);
    setDocuments(documents.filter((d) => d.id !== documentId));
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
                    ? moment(document.submitDate).format("DD.MM.YYYY")
                    : "Немає дати"
                }
                headStyle={{ backgroundColor: "#3c5438", color: "#ffffff" }}
                actions={
                    userAccesses["ManipulateDocument"] ? [
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
                          onClick={() => removeDocumentById(document.id)}
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
                <Card.Meta className="detailsMeta" title={document.fileName} />
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
