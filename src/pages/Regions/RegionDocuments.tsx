import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {Avatar, Button, Card, Layout, Modal, Spin} from 'antd';
import {FileTextOutlined, CloseOutlined, RollbackOutlined, DownloadOutlined, ExclamationCircleOutlined} from '@ant-design/icons';
import {getRegionById, getRegionDocuments, getFile, removeDocument} from "../../api/regionsApi";
import "./Region.less";
import Title from 'antd/lib/typography/Title';
import moment from "moment";
import Spinner from '../Spinner/Spinner';
import userApi from "./../../api/UserApi";
import {
  cityNameOfApprovedMember,
} from "../../api/citiesApi";
import { Roles } from '../../models/Roles/Roles';


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
    const [loading, setLoading] = useState<boolean>(false);
    const [activeUserRoles, setActiveUserRoles] = useState<string[]>([]);
    const [isActiveUserFromRegion, setIsActiveUserFromRegion] = useState<boolean>(false);
    const [canEdit, setCanEdit] = useState<boolean>(false);

    const getDocuments = async () => {
      setLoading(true);
      const response = await getRegionDocuments(id);
      const responce1 = await cityNameOfApprovedMember(userApi.getActiveUserId());
      const response2 = await getRegionById(id);
      
      setActiveUserRoles(userApi.getActiveUserRoles);
      setIsFromRegion(response2.data.cities, responce1.data);
      setIsAdminOfSomeTeritory(userApi.getActiveUserRoles());
      setLoading(false);
    };

    const setIsAdminOfSomeTeritory = (roles: string[]) => {
      roles.includes(Roles.Admin) || roles.includes(Roles.OkrugaHead)
      || roles.includes(Roles.CityHead) || roles.includes(Roles.KurinHead)
      ? setCanEdit(true)
      : setCanEdit(false)
    }

    const setIsFromRegion = (members: any[], city: string) => {
      for(let i = 0; i < members.length; i++){
        if(members[i].name == city){
          setIsActiveUserFromRegion(true);
          return;
        }
      }
    }  

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

    function seeDeleteModal(documentId: number) {
      return Modal.confirm({
        title: "Ви впевнені, що хочете видалити даний документ із документообігу?",
        icon: <ExclamationCircleOutlined />,
        okText: "Так, Видалити",
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
                    activeUserRoles.includes(Roles.Admin)
                    || ((activeUserRoles.includes(Roles.OkrugaHead) || activeUserRoles.includes(Roles.OkrugaHeadDeputy)) 
                        && isActiveUserFromRegion)
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
                              onClick={() => seeDeleteModal(document.id)}
                            />,
                      ]
                    : canEdit || activeUserRoles.includes(Roles.OkrugaHeadDeputy) 
                    || activeUserRoles.includes(Roles.CityHeadDeputy) || activeUserRoles.includes(Roles.KurinHeadDeputy)
                    || (!activeUserRoles.includes(Roles.RegisteredUser) && isActiveUserFromRegion)
                    ? [
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
