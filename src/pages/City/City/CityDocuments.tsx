import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {Avatar, Button, Card, Layout, Spin} from 'antd';
import {FileTextOutlined, CloseOutlined, RollbackOutlined, DownloadOutlined} from '@ant-design/icons';
import {getAllDocuments, getFile, removeDocument} from "../../../api/citiesApi";
import "./City.less";
import CityDocument from '../../../models/City/CityDocument';
import Title from 'antd/lib/typography/Title';
import moment from "moment";
import Spinner from '../../Spinner/Spinner';
import userApi from "../../../api/UserApi";

const CityDocuments = () => {
    const {id} = useParams();
    const history = useHistory();

    const [documents, setDocuments] = useState<CityDocument[]>([]);
    const [canEdit, setCanEdit] = useState<Boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [activeUserRoles, setActiveUserRoles] = useState<string[]>([]);

    const getDocuments = async () => {
      setLoading(true);
      const response = await getAllDocuments(id);

      setDocuments(response.data.documents);
      setCanEdit(response.data.canEdit);
      setActiveUserRoles(userApi.getActiveUserRoles);
      setLoading(false);
    };

    const downloadDocument = async (fileBlob: string, fileName: string) => {
      await getFile(fileBlob, fileName);
    }

    const removeDocumentById = async (documentId: number) => {
      await removeDocument(documentId);

      setDocuments(documents.filter((d) => d.id !== documentId));
    };

    useEffect(() => {
        getDocuments();
    }, []);

    return (
      <Layout.Content>
        <Title level={2}>Документообіг станиці</Title>
        {loading ? (
          <Spinner />
        ) : (
          <div className="cityMoreItems">
            {documents.length > 0 ? (
              documents.map((document: CityDocument) => (
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
                    canEdit ? 
                      [
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
                        />                          
                      ]                                                                                                            
                    : activeUserRoles.includes("Прихильник") || activeUserRoles.includes("Дійсний член організації") ?
                      [
                        <DownloadOutlined
                          key="download"
                          onClick={() =>
                            downloadDocument(
                              document.blobName,
                              document.fileName
                            )
                          }
                        />    
                      ]
                      : undefined
                  }
                >
                  <Avatar size={86} icon={<FileTextOutlined />} />
                  <Card.Meta
                    className="detailsMeta"
                    title={document.cityDocumentType.name}
                  />
                </Card>
              ))
            ) : (
              <Title level={4}>Ще немає документів станиці</Title>
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

export default CityDocuments;
