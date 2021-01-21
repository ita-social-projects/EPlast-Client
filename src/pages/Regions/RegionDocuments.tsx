import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {Avatar, Button, Card, Layout, Spin} from 'antd';
import {FileTextOutlined, CloseOutlined, RollbackOutlined, DownloadOutlined} from '@ant-design/icons';
import {getRegionDocuments, getFile, removeDocument} from "../../api/regionsApi";
import "./Region.less";
import Title from 'antd/lib/typography/Title';
import moment from "moment";
import Spinner from '../Spinner/Spinner';


const RegionDocuments = () => {
    const {id} = useParams();
    const history = useHistory();

    const [documents, setDocuments] = useState<any[]>([{
        id:'',
        submitDate:'',
        blobName:'',
        fileName:'',
        regionId:''
      }]);
    const [canEdit, setCanEdit] = useState<Boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const getDocuments = async () => {
      setLoading(true);
      const response = await getRegionDocuments(id);

      
      setCanEdit(response.data.canEdit);
      setLoading(false);
    };


    const setRegionDocs = async ()=>{
        try{
          const response = await getRegionDocuments(id);
          setDocuments(response.data);
        }
        finally{
      
        }
      }


    const downloadDocument = async (fileBlob: string, fileName: string) => {
      await getFile(fileBlob, fileName);
    }

    const removeDocumentById = async (documentId: number) => {
      await removeDocument(documentId);

      setDocuments(documents.filter((d) => d.id !== documentId));
    };

    useEffect(() => {
        setRegionDocs();
        getDocuments();
    }, []);

    return (
      <Layout.Content>
        <Title level={2}>Документообіг округи</Title>
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
                          />,
                        ]
                     
                  }
                >
                  <Avatar size={86} icon={<FileTextOutlined />} />
                  <Card.Meta
                    className="detailsMeta"
                    title={document.fileName}
                  />
                </Card>
              ))
            ) : (
              <Title level={4}>Ще немає документів округи</Title>
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


export default RegionDocuments;
