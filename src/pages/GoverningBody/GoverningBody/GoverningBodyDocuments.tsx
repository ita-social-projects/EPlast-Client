import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {Avatar, Button, Card, Layout, Spin} from 'antd';
import {FileTextOutlined, CloseOutlined, RollbackOutlined, DownloadOutlined} from '@ant-design/icons';
import {getAllDocuments, getFile, removeDocument} from "../../../api/citiesApi";
import "../../City/City/City.less";
import GoverningBodyDocument from '../../../models/GoverningBody/GoverningBodyDocument';
import Title from 'antd/lib/typography/Title';
import moment from "moment";
import Spinner from '../../Spinner/Spinner';

const GoverningBodyDocuments = () => {
    const {id} = useParams();
    const history = useHistory();

    const [documents, setDocuments] = useState<GoverningBodyDocument[]>([]);
    const [canEdit, setCanEdit] = useState<Boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const getDocuments = async () => {
      setLoading(true);
      const response = await getAllDocuments(id);

      setDocuments(response.data.documents);
      setCanEdit(response.data.canEdit);
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
                      ? moment(document.submitDate).format("DD.MM.YYYY")
                      : "Немає дати"
                  }
                  headStyle={{ backgroundColor: "#3c5438", color: "#ffffff" }}
                  actions={
                    canEdit
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
                  <Card.Meta
                    className="detailsMeta"
                    title={document.governingBodyDocumentType.name}
                  />
                </Card>
              ))
            ) : (
              <Title level={4}>Ще немає документів керівного органу</Title>
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
