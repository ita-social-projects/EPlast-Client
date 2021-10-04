import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {Avatar, Button, Card, Layout, Modal} from 'antd';
import {FileTextOutlined, CloseOutlined, RollbackOutlined, DownloadOutlined, ExclamationCircleOutlined} from '@ant-design/icons';
import {clubNameOfApprovedMember, getAllDocuments, getFile, removeDocument, getClubById} from "../../../api/clubsApi";
import "./Club.less";
import ClubDocument from '../../../models/Club/ClubDocument';
import ClubProfile from "../../../models/Club/ClubProfile";
import moment from "moment";
import { Roles } from '../../../models/Roles/Roles';
import Spinner from '../../Spinner/Spinner';
import Title from 'antd/lib/typography/Title';
import userApi from "../../../api/UserApi";
import extendedTitleTooltip, {parameterMaxLength} from '../../../components/Tooltip';

const ClubDocuments = () => {
    const {id} = useParams();
    const history = useHistory();

    const [activeUserClub, setActiveUserClub] = useState<string>();
    const [documents, setDocuments] = useState<ClubDocument[]>([]);
    const [canEdit, setCanEdit] = useState<Boolean>(false);
    const [club, setClub] = useState<ClubProfile>(new ClubProfile());
    const [loading, setLoading] = useState<boolean>(false);
    const [activeUserRoles, setActiveUserRoles] = useState<string[]>([]);
    

    const getClub = async () => {
      setLoading(true);
      try {
        const response = await getClubById(+id);
        const clubNameResponse = await clubNameOfApprovedMember(userApi.getActiveUserId());

        setActiveUserClub(clubNameResponse.data);
        setActiveUserRoles(userApi.getActiveUserRoles);
        setClub(response.data);
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
    };

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
        getDocuments();
        getClub();
    }, []);

    return (
      <Layout.Content>
        <Title level={2}>Документообіг куреня</Title>
        {loading ? (
          <Spinner />
        ) : (
          <div className="clubMoreItems">
            {documents.length > 0 ? (
              documents.map((document: ClubDocument) => (
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
                            onClick={() => seeDeleteModal(document.id)}
                          />,
                        ]
                        
                      : ((activeUserRoles.includes(Roles.Supporter) || activeUserRoles.includes(Roles.PlastMember)) 
                      && club.name == activeUserClub ) || (activeUserRoles.includes(Roles.OkrugaHead) || activeUserRoles.includes(Roles.OkrugaHeadDeputy))
                      || (activeUserRoles.includes(Roles.CityHead) || activeUserRoles.includes(Roles.CityHeadDeputy))
                      || (activeUserRoles.includes(Roles.KurinHead) || activeUserRoles.includes(Roles.KurinHeadDeputy))
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
                        ]
                        : undefined
                  }
                >
                  <Avatar size={86} icon={<FileTextOutlined />} />
                  <Card.Meta
                    className="detailsMeta"
                    title={
                       extendedTitleTooltip(parameterMaxLength, document.clubDocumentType.name)
                    }
                  />
                </Card>
              ))
            ) : (
              <Title level={4}>Ще немає документів куреня</Title>
            )}
          </div>
        )}
        <div className="clubMoreItems">
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

export default ClubDocuments;
