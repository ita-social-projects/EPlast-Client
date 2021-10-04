import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {Avatar, Button, Card, Layout, Modal, Spin} from 'antd';
import {FileTextOutlined, CloseOutlined, RollbackOutlined, DownloadOutlined, ExclamationCircleOutlined} from '@ant-design/icons';
import {getAllDocuments, getFile, removeDocument, getCityById, cityNameOfApprovedMember} from "../../../api/citiesApi";
import "./City.less";
import CityDocument from '../../../models/City/CityDocument';
import CityProfile from "../../../models/City/CityProfile";
import Title from 'antd/lib/typography/Title';
import moment from "moment";
import Spinner from '../../Spinner/Spinner';
import userApi from "../../../api/UserApi";
import { Roles } from '../../../models/Roles/Roles';
import extendedTitleTooltip, {parameterMaxLength} from '../../../components/Tooltip';

const CityDocuments = () => {
    const {id} = useParams();
    const history = useHistory();

    const [activeUserCity, setActiveUserCity] = useState<string>();
    const [documents, setDocuments] = useState<CityDocument[]>([]);
    const [city, setCity] = useState<CityProfile>(new CityProfile());
    const [canEdit, setCanEdit] = useState<Boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [activeUserRoles, setActiveUserRoles] = useState<string[]>([]);

    const getCity = async () => {
      setLoading(true);
      try {
        const response = await getCityById(+id);
        const cityNameResponse = await cityNameOfApprovedMember(userApi.getActiveUserId());

        setActiveUserCity(cityNameResponse.data);
        setActiveUserRoles(userApi.getActiveUserRoles);
        setCity(response.data);
       } 
    finally {
      setLoading(false);
    }
  }
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

    function seeDeleteModal(documentId: number) {
      return Modal.confirm({
        title: "Ви впевнені, що хочете видалити даний документ із документообігу?",
        icon: <ExclamationCircleOutlined />,
        okText: "Так, видалити",
        okType: "primary",
        cancelText: "Скасувати",
        maskClosable: true,
        onOk() {
          removeDocumentById(documentId);
        },
      });
    }

    const removeDocumentById = async (documentId: number) => {
      await removeDocument(documentId);

      setDocuments(documents.filter((d) => d.id !== documentId));
    };

    useEffect(() => {
        getDocuments();
        getCity()
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
                      ? moment.utc(document.submitDate).local().format("DD.MM.YYYY")
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
                          onClick={() => seeDeleteModal(document.id)}
                        />                          
                      ]                                                                                                            
                    : activeUserRoles.includes(Roles.CityHead) 
                    || activeUserRoles.includes(Roles.CityHeadDeputy) 
                    || ((activeUserRoles.includes(Roles.Supporter) 
                    || activeUserRoles.includes(Roles.PlastMember)) 
                    && city.name == activeUserCity )
                     
                    ?
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
                    title={
                      extendedTitleTooltip(parameterMaxLength, document.cityDocumentType.name)
                    }
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
