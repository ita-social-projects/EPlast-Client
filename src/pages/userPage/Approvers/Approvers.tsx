import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Button, Avatar, Tooltip } from 'antd';
import './Approvers.less';
import AvatarAndProgress from '../../../../src/pages/userPage/personalData/AvatarAndProgress';
import AddUser from "../../../assets/images/user_add.png";
import { ApproversData } from '../Interface/Interface';
import jwt from 'jwt-decode';
import AuthStore from '../../../stores/AuthStore';
import userApi from '../../../api/UserApi';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import notificationLogic from '../../../components/Notifications/Notification';
import Spinner from '../../Spinner/Spinner';
import{
  fileIsNotUpload, 
  successfulDeleteAction,
  failDeleteAction,
  successfulCreateAction,
} from "../../../components/Notifications/Messages"
import { StickyContainer } from 'react-sticky';
import NotificationBoxApi from '../../../api/NotificationBoxApi';
import jwt_decode from "jwt-decode";

const Assignments = () => {
  const history = useHistory();
  const { userId } = useParams();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ApproversData>();
  const [approverName, setApproverName] = useState<string>();
  const [userGender, setuserGender] = useState<string>();
  const userGenders = ["Чоловік", "Жінка", "Інша"];
  const [roles, setRoles]=useState<string[]>([]);

  const fetchData = async () => {
    const token = AuthStore.getToken() as string;
    const user: any = jwt(token);
      let decodedJwt = jwt_decode(AuthStore.getToken() as string) as any;
      setRoles(decodedJwt[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ]);
    await userApi.getApprovers(userId, user.nameid).then(response => {
      setData(response.data);
      setLoading(true);
    }).catch(() => { notificationLogic('error', fileIsNotUpload("даних")) });
    fetchApproverName(user.nameid);
};

const fetchApproverName = async (id: string) => {
    await userApi.getById(id).then(response => {
        setApproverName(response.data.user.firstName + ' ' + response.data.user.lastName);
    });
    await userApi.getById(userId).then(response => {
        setuserGender(response.data.user.gender.name);
    });
}

  useEffect(() => {
    fetchData();
  }, []);

  const setGreeting = () => {
      let greeting = "Друже/подруго";
      if (userGender === userGenders[0]) {
        greeting = "Друже";
      }
      if (userGender === userGenders[1]) {
          greeting = "Подруго";
      }
      return greeting;
  }

  const deleteApprove = async (event: number) => {
    await userApi.deleteApprove(event).
      then(() => { notificationLogic('success', successfulDeleteAction("Поручення")) }).
      catch(() => { notificationLogic('error', failDeleteAction("поручення")) });
      await NotificationBoxApi.createNotifications(
        [userId],
        `${setGreeting()}, повідомляємо, що користувач 
        ${approverName} скасував своє поручення за тебе.
        Будь тією зміною, яку хочеш бачити у світі!`,
        NotificationBoxApi.NotificationTypes.UserNotifications,
        `/userpage/main/${data?.currentUserId}`,
        'Переглянути користувача'
    );
    fetchData();
  }

  const approveClick = async (userId: string, isClubAdmin: boolean = false, isCityAdmin: boolean = false) => {
    await userApi.approveUser(userId, isClubAdmin, isCityAdmin).
      then(() => { notificationLogic('success', successfulCreateAction("Поручення")) }).
      catch(() => { notificationLogic('error', "Не вдалося поручитися") });
      await NotificationBoxApi.createNotifications(
        [userId],
        `${setGreeting()}, повідомляємо, що користувач 
        ${approverName} поручився за тебе.
        Будь тією зміною, яку хочеш бачити у світі!`,
        NotificationBoxApi.NotificationTypes.UserNotifications,
        `/userpage/main/${data?.currentUserId}`,
        'Переглянути користувача'
    );
    fetchData();
  }

  const { Meta } = Card;
  return loading === false ? (
    <Spinner />
  ) : (
      
        <div className="displayFlex">
          <div className="avatarWrapper">
            <StickyContainer className="kadraWrapper">
              <AvatarAndProgress imageUrl={data?.user.imagePath} time={data?.timeToJoinPlast} firstName={data?.user.firstName} lastName={data?.user.lastName} isUserPlastun={data?.isUserPlastun} pseudo={data?.user.pseudo} city={data?.user.city} club={data?.user.club}/>
            </StickyContainer>
          </div>
          <div className="approversContent">
            <hr/>
            <h1>Поручення дійсних членів</h1>
            <div className="approversCard">
              {data?.confirmedUsers.map(p => {
                if (p.approver.userID == data?.currentUserId || roles.includes("Admin")) {
                  return (
                    <div key={p.id}>
                      <Card
                        key={p.id}
                        hoverable
                        className="cardStyles"
                        cover={<Avatar alt="example" src={p.approver.user.imagePath} className="avatar" />}
                      >
                        <Meta title={p.approver.user.firstName + " " + p.approver.user.lastName} className="titleText" />
                        <Meta title={moment(p.confirmDate).format("DD.MM.YYYY")} className="titleText" />
                        <Button className="cardButton" danger onClick={() => deleteApprove(p.id)}>
                          Відкликати
                            </Button>
                      </Card>
                    </div>
                  )
                }
                else {
                  return (
                    <div key={p.id}>
                      <Link to="#" onClick={() => history.push(`/userpage/main/${p.approver.userID}`)}>
                        <Card
                          key={p.id}
                          hoverable
                          className="cardStyles"
                          cover={<Avatar alt="example" src={p.approver.user.imagePath} className="avatar" />}
                        >
                          <Meta title={p.approver.user.firstName + " " + p.approver.user.lastName} className="titleText" />
                          <Meta title={moment(p.confirmDate).format("DD.MM.YYYY")} className="titleText" />
                          <p className="cardP" />
                        </Card>
                      </Link>
                    </div>
                  )
                }
              }
              )}
              <div>
                {data?.canApprove && !(roles==["Прихильник"] || roles==["Зареєстований користувач"] || roles==["Прихильник", "Зареєстований користувач"])
                    && (
                  <div>
                    <Tooltip
                      title="Поручитися за користувача"
                      placement="bottom">
                      <Link to="#" onClick={() => approveClick(data?.user.id)}>
                      <Card
                          hoverable
                          className="cardStyles"
                          cover={<Avatar
                            src={AddUser}
                            alt="example" size={166}
                            shape="square"
                            className="avatar"
                           />}
                        >
                          <p className="cardP" />
                          <p className="cardP" />
                        </Card>
                      </Link>
                    </Tooltip>
                  </div>
                )}
                {data?.confirmedUsers.length == 0 && !data?.canApprove && (
                  <div>
                    <br />
                    <br />
                    На жаль поруки відсутні
                    <br />
                    <br />
                  </div>
                )}
              </div>

            </div>
            <h1>Поручення куреня УСП/УПС</h1>
            <div className="approversCard">
              {(data?.clubApprover != null) ? (

                <div>
                  {(data.clubApprover.approver.userID == data.currentUserId || roles.includes("Admin")) ?
                    (
                      <Card
                        hoverable
                        className="cardStyles"
                        cover={<Avatar 
                          src={data.clubApprover.approver.user.imagePath}
                          alt="example"
                          className="avatar" 
                          />}
                      >
                        <Meta title={data.clubApprover.approver.user.firstName + " " + data.clubApprover.approver.user.lastName} className="titleText" />
                        <Meta title={moment(data.clubApprover.confirmDate).format("DD.MM.YYYY")} className="titleText" />
                        <Button className="cardButton" danger onClick={() => deleteApprove(data.clubApprover.id)} value={data.clubApprover.id}>
                          Відкликати
                    </Button>
                      </Card>
                    ) : (
                      <Link to="#" onClick={() => history.push(`/userpage/main/${data.clubApprover.approver.userID}`)}>
                        <Card
                          hoverable
                          className="cardStyles"
                          cover={<Avatar 
                            src={data.clubApprover.approver.user.imagePath}
                            alt="example"
                            className="avatar" 
                            />}
                        >
                          <Meta title={data.clubApprover.approver.user.firstName + " " + data.clubApprover.approver.user.lastName} className="titleText" />
                          <Meta title={moment(data.clubApprover.confirmDate).format("DD.MM.YYYY")} className="titleText" />
                        </Card>
                      </Link>
                    )}

                </div>
              ) : ((data?.clubApprover == null && (data?.currentUserId != data?.user.id || roles.includes("Admin")) && (data?.isUserHeadOfClub || roles.includes("Admin"))) ?
                (
                  <div>
                    <Tooltip
                      title="Поручитися за користувача"
                      placement="rightBottom">
                      <Link to="#" onClick={() => approveClick(data?.user.id, roles.includes("Голова Куреня") || roles.includes("Admin"), false)}>
                        <Avatar src={AddUser} 
                          alt="example" size={168}
                          className="avatarEmpty" 
                          shape="square"/>
                      </Link>
                    </Tooltip>
                  </div>
                ) : (
                  <div>
                    <br />
                    <br />
            На жаль поруки відсутні
                    <br />
                    <br />
                  </div>
                )
                )}
            </div>
            <h1 className="approversCard">Поручення Голови осередку/Осередкового УСП/УПС</h1>
            <div className="approversCard">
              {(data?.cityApprover != null) ? (
                <div>
                  {(data.cityApprover.approver.userID == data.currentUserId) ? (
                    <Card
                      hoverable
                      className="cardStyles"
                      cover={<Avatar 
                        src={data.cityApprover.approver.user.imagePath}
                        alt="example"
                        className="avatar" 
                        />}
                    >
                      <Meta title={data.cityApprover.approver.user.firstName + " " + data.cityApprover.approver.user.lastName} className="titleText" />
                      <Meta title={moment(data.cityApprover.confirmDate).format("DD.MM.YYYY")} className="titleText" />
                      <Button className="cardButton" danger onClick={() => deleteApprove(data.cityApprover.id)} value={data.cityApprover.id}>
                        Відкликати
                    </Button>
                    </Card>
                  ) : (
                      <Link to="#" onClick={() => history.push(`/userpage/main/${data.cityApprover.approver.userID}`)}>
                        <Card
                          hoverable
                          className="cardStyles"
                          cover={<Avatar 
                            src={data.cityApprover.approver.user.imagePath}
                            alt="example"
                            className="avatar" 
                            />}
                        >
                          <Meta title={data.cityApprover.approver.user.firstName + " " + data.cityApprover.approver.user.lastName} className="titleText" />
                          <Meta title={moment(data.cityApprover.confirmDate).format("DD.MM.YYYY")} className="titleText" />
                        </Card>
                      </Link>
                    )}

                </div>
              ) : ((data?.cityApprover == null && (data?.currentUserId != data?.user.id || roles.includes("Admin")) && (data?.isUserHeadOfCity || roles.includes("Admin"))) ?
                (
                  <div>
                    <Tooltip
                      title="Поручитися за користувача"
                      placement="rightBottom">
                      <Link to="#" onClick={() => approveClick(data?.user.id, false, roles.includes("Голова Станиці") || roles.includes("Admin"))}>
                        <Avatar 
                            src={AddUser}
                            alt="example" size={168}
                            className="avatarEmpty" 
                            shape="square" />
                      </Link>
                    </Tooltip>
                  </div>
                ) : (
                  <div>
                    <br />
                    <br />
            На жаль поруки відсутні
                    <br />
                    <br />
                  </div>
                )
                )}
            </div>
          </div>
        </div>
    );
}
export default Assignments;