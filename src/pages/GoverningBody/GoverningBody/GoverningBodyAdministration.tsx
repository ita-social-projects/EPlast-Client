import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {Avatar, Button, Card, Layout, Modal, Skeleton, Tooltip} from 'antd';
import {SettingOutlined, RollbackOutlined, CloseOutlined} from '@ant-design/icons';
import { getAllAdmins, removeAdministrator, getUserAccess} from "../../../api/governingBodiesApi";
import userApi from "../../../api/UserApi";
import "./GoverningBody.less";
import classes from "./GoverningBodyAdministration.module.css";
import GoverningBodyAdmin from '../../../models/GoverningBody/GoverningBodyAdmin';
import EditAdministratorModal from '../AddAdministratorModal/EditAdministratorModal';
import jwt from 'jwt-decode';
import moment from "moment";
import "moment/locale/uk";
import Title from 'antd/lib/typography/Title';
import Spinner from '../../Spinner/Spinner';
import NotificationBoxApi from '../../../api/NotificationBoxApi';
import AuthStore from '../../../stores/AuthStore';
import extendedTitleTooltip from '../../../components/Tooltip';
moment.locale("uk-ua");

const adminTypeNameMaxLength = 23;
const GoverningBodyAdministration = () => {
    const confirm = Modal.confirm;
    const {id} = useParams();
    const history = useHistory();
    const [administration, setAdministration] = useState<GoverningBodyAdmin[]>([]);
    const [visibleModal, setVisibleModal] = useState(false);
    const [admin, setAdmin] = useState<GoverningBodyAdmin>(new GoverningBodyAdmin());
    const [userAccesses, setUserAccesses] = useState<{[key: string] : boolean}>({});
    const [photosLoading, setPhotosLoading] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [governingBodyName, setGoverningBodyName] = useState<string>("");
    const [updated, setUpdated] = useState<boolean>(false);
  
    const getUserAccesses = async () => {
        let user: any = jwt(AuthStore.getToken() as string);
        await getUserAccess(user.nameid).then(
          response => {
            setUserAccesses(response.data);
          }
        );
      }

    const getAdministration = async () => {
      setLoading(true);
      await getUserAccesses();
      const response = await getAllAdmins(id);
        setPhotosLoading(true);
        await setPhotos([response.data.head, ...response.data.admins].filter(a => a != null));
        setAdministration([response.data.head, ...response.data.admins].filter(a => a != null));
        setGoverningBodyName(response.data.name);
      setLoading(false);
    };

    const removeAdmin = async (admin: GoverningBodyAdmin) => {
      await removeAdministrator(admin.id);
      setAdministration(administration.filter((u) => u.id !== admin.id));
      await createNotification(admin.userId, `На жаль, ви були позбавлені ролі: '${admin.adminType.adminTypeName}' в керівному органі`);
    };

    const showConfirm = (admin: GoverningBodyAdmin) => {
        confirm({
            title: "Дійсно видалити користувача з проводу?",
            content: (
              <div>
                {admin.adminType.adminTypeName} {admin.user.firstName} {admin.user.lastName} буде видалений з проводу!
              </div>
            ),
            onCancel() { },
            onOk() {
              removeAdmin(admin);
            },
          });
      };
    
    const createNotification = async(userId : string, message : string) => {
      await NotificationBoxApi.createNotifications(
        [userId],
        message + ": ",
        NotificationBoxApi.NotificationTypes.UserNotifications,
        `/cities/${id}`,
        governingBodyName
        );
    }

    const showModal = (member: GoverningBodyAdmin) => {
      setAdmin(member);

      setVisibleModal(true);
    };

    const setPhotos = async (members: GoverningBodyAdmin[]) => {
      for (let i of members) {
        i.user.imagePath = (await userApi.getImage(i.user.imagePath)).data;
      }

      setPhotosLoading(false);
    };

    const onAdd = async (newAdmin: GoverningBodyAdmin = new GoverningBodyAdmin()) => {
      const index = administration.findIndex((a) => a.id === admin.id);
      administration[index] = newAdmin;
      await createNotification(newAdmin.userId, `Вам була присвоєна нова роль: '${newAdmin.adminType.adminTypeName}' в керівному органі`);
      setAdministration(administration);
    };

    const processEmail = (email: string) => {
      if (email.length > 23) {
        return (
          <div className='emailDiv'>
            <Tooltip title={email} placement='right'>
              <span>{email.slice(0, 23) + "..."}</span>
            </Tooltip>
          </div>
        );
      } else {
        return <div className='emailDiv'>{email}</div>;
      }
    }

    useEffect(() => {
        getAdministration();
    }, []);

    useEffect(() => {
      getAdministration();
    }, [updated]);

    return (
      <Layout.Content>
        <Title level={2}>Провід Керівного Органу</Title>
        {loading ? (
          <Spinner />
        ) : (
          <div className="governingBodyMoreItems">
            {administration.length > 0 ? (
              administration.map((member: GoverningBodyAdmin) => (
                <Card
                  key={member.id}
                  className="detailsCard"
                  title={
                    extendedTitleTooltip(adminTypeNameMaxLength, `${member.adminType.adminTypeName}`)
                  }
                  headStyle={{ backgroundColor: "#3c5438", color: "#ffffff" }}
                  actions={
                    userAccesses["AddGBSecretary"]
                      ? [
                          <SettingOutlined
                            className={classes.governingBodyAdminSettingsIcon}
                            onClick={() => showModal(member)} />,
                          <CloseOutlined
                            onClick={() => showConfirm(member)}
                          />,
                        ]
                      : undefined
                  }
                >
                  <div
                    onClick={() => {
                      if (userAccesses["GoToSecretaryProfile"]) {
                        history.push(`/userpage/main/${member.userId}`)
                      }
                    }}
                    className="governingBodyMember"
                  >
                    <div>
                      {photosLoading ? (
                        <Skeleton.Avatar active size={86} />
                      ) : (
                        <Avatar size={86} src={member.user.imagePath} />
                      )}
                      <Card.Meta
                        className="detailsMeta"
                        title={
                          extendedTitleTooltip(adminTypeNameMaxLength, `${member.user.firstName} ${member.user.lastName}`)
                        }
                      />
                      {processEmail(member.workEmail == null || member.workEmail == "" ? member.user.email : member.workEmail)}
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Title level={4}>Ще немає діловодів керівного органу</Title>
            )}
          </div>
        )}
        <div className="governingBodyMoreItems">
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
        {userAccesses["AddGBSecretary"] ? (
          <EditAdministratorModal
            admin={admin}
            setAdmin={setAdmin}
            visibleModal={visibleModal}
            setVisibleModal={setVisibleModal}
            governingBodyId={+id}
            onAdd={onAdd}
            onChange={() => setUpdated(true)}
          />
        ) : null}
      </Layout.Content>
    );
};

export default GoverningBodyAdministration;
