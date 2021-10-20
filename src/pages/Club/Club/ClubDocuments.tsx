import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {Avatar, Button, Card, Layout, Modal} from 'antd';
import {FileTextOutlined, CloseOutlined, RollbackOutlined, DownloadOutlined, ExclamationCircleOutlined} from '@ant-design/icons';
import {clubNameOfApprovedMember, getAllDocuments, getUserClubAccess, getFile, removeDocument, getClubById} from "../../../api/clubsApi";
import "./Club.less";
import AuthStore from "../../../stores/AuthStore";
import jwt from 'jwt-decode';
import ClubDocument from '../../../models/Club/ClubDocument';
import ClubProfile from "../../../models/Club/ClubProfile";
import moment from "moment";
import Spinner from '../../Spinner/Spinner';
import Title from 'antd/lib/typography/Title';
import userApi from "../../../api/UserApi";
import extendedTitleTooltip, {parameterMaxLength} from '../../../components/Tooltip';

const ClubDocuments = () => {
    const {id} = useParams();
    const history = useHistory();

    const [activeUserClub, setActiveUserClub] = useState<string>();
    const [documents, setDocuments] = useState<ClubDocument[]>([]);
    const [club, setClub] = useState<ClubProfile>(new ClubProfile());
    const [loading, setLoading] = useState<boolean>(false);
    const [userAccesses, setUserAccesses] = useState<{[key: string] : boolean}>({});
    
    const getUserClubAccesses = async () => {
      let user: any = jwt(AuthStore.getToken() as string);
      await getUserClubAccess(id,user.nameid).then(
        response => {
          setUserAccesses(response.data);
        }
      );
    }

    const getClub = async () => {
      setLoading(true);
      try {
        await getUserClubAccesses();
        const response = await getClubById(+id);
        const clubNameResponse = await clubNameOfApprovedMember(userApi.getActiveUserId());

        setActiveUserClub(clubNameResponse.data);
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
                    userAccesses["EditClub"] ? [
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
                    ] : userAccesses["IsAdmin"] || 
                    (userAccesses["DownloadDocument"] && club.name == activeUserClub) ? [
                          <DownloadOutlined
                            key="download"
                            onClick={() =>
                              downloadDocument(
                                document.blobName,
                                document.fileName
                              )
                            }
                          />,
                        ] : undefined
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
