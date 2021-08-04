import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Avatar, Tooltip, Spin, Skeleton } from 'antd';
import './Approvers.less';
import AddUser from "../../../assets/images/user_add.png";
import { ApproversData } from '../Interface/Interface';
import jwt from 'jwt-decode';
import AuthStore from '../../../stores/AuthStore';
import userApi from '../../../api/UserApi';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import notificationLogic from '../../../components/Notifications/Notification';
import {
  fileIsNotUpload,
  successfulDeleteAction,
  failDeleteAction,
  successfulCreateAction,
} from "../../../components/Notifications/Messages"
import { StickyContainer } from 'react-sticky';
import NotificationBoxApi from '../../../api/NotificationBoxApi';
import DeleteApproveButton from './DeleteApproveButton';
import { Roles } from '../../../models/Roles/Roles';
import AvatarAndProgressStatic from '../personalData/AvatarAndProgressStatic';

const Assignments = () => {
  const history = useHistory();
  const { userId } = useParams();
  const [loading, setLoading] = useState(false);
  const [approveAsMemberLoading, setApproveAsMemberLoading] = useState(false);
  const [approveAsHovelHeadLoading, setApproveAsHovelHeadLoading] = useState(false);
  const [approveAsCityHeadLoading, setApproveAsCityHeadLoading] = useState(false);
  const [data, setData] = useState<ApproversData>();
  const [approverName, setApproverName] = useState<string>();
  const [userGender, setuserGender] = useState<string>();
  const userGenders = ["Чоловік", "Жінка", "Не маю бажання вказувати"];
  const AccessableRoles = [Roles.Admin.toString(),
                           Roles.KurinHead.toString(),
                           Roles.CityHead.toString(),
                           Roles.OkrugaHead.toString(),
                           Roles.PlastMember.toString(),
                           Roles.Supporter.toString(),
                           Roles.RegisteredUser.toString()
                          ];
  const [roles, setRoles] = useState<string[]>([]);

  const fetchData = async () => {
    const token = AuthStore.getToken() as string;
    const user: any = jwt(token);
    setRoles(userApi.getActiveUserRoles());
    await userApi.getApprovers(userId, user.nameid).then(response => {
      setData(response.data);
      setLoading(true);
    }).catch(() => { notificationLogic('error', fileIsNotUpload("даних")) });
    fetchApproverName(user.nameid);
  };

  const AccessToManage = (roles: string[]): boolean => {
    for (var i = 0; i < roles.length; i++) {
      if (AccessableRoles.includes(roles[i])) return true;
    }
    return false;
  }

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

    isCityAdmin ? setApproveAsCityHeadLoading(true) : isClubAdmin ? setApproveAsHovelHeadLoading(true) : setApproveAsMemberLoading(true);
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
    await fetchData();
    isCityAdmin ? setApproveAsCityHeadLoading(false) : isClubAdmin ? setApproveAsHovelHeadLoading(false) : setApproveAsMemberLoading(false);
  }

  const { Meta } = Card;
  return loading === false ? (
    <div className="kadraWrapper">
      <Skeleton.Avatar
        size={220}
        active={true}
        shape="circle"
        className="img"
      />
    </div>
  ) : ( 
    <div className="displayFlex">
      <div className="avatarWrapperApprovers">
        <StickyContainer className="kadraWrapper">
          <AvatarAndProgressStatic
            imageUrl={data?.user.imagePath}
            time={data?.timeToJoinPlast}
            firstName={data?.user.firstName}
            lastName={data?.user.lastName}
            isUserPlastun={data?.isUserPlastun}
            pseudo={data?.user.pseudo}
            governingBody={data?.user.governingBody}
            region={data?.user.region}
            city={data?.user.city}
            club={data?.user.club}
            cityId={data?.user.cityId}
            clubId={data?.user.clubId}
            regionId={data?.user.regionId}
            governingBodyId={data?.user.governingBodyId} />
        </StickyContainer>
      </div>
      <div className="approversContentApprovers">
        <br />
        <h1 className="approversCard">Поручення дійсних членів</h1>
        <div className="approversCard">
          {data?.confirmedUsers.map(p => {
            if (p.approver.userID == data?.currentUserId || roles.includes(Roles.Admin)) {
              return (
                <div key={p.id}>
                  <Card
                    key={p.id}
                    hoverable
                    className="cardStyles"
                    cover={<Avatar alt="example" src={p.approver.user.imagePath} className="avatar" />}
                  >
                    <Tooltip title={p.approver.user.firstName + " " + p.approver.user.lastName}>
                      <Link to={"/userpage/main/" + p.approver.userID} onClick={() => history.push(`/userpage/main/${p.approver.userID}`)}>
                        <Meta title={p.approver.user.firstName + " " + p.approver.user.lastName} className="titleText" />
                      </Link>
                    </Tooltip>
                    <Meta title={moment(p.confirmDate).format("DD.MM.YYYY")} className="title-not-link" />
                    <DeleteApproveButton approverId={p.id} deleteApprove={deleteApprove}/>
                  </Card>
                </div>
              )
            }
            else {
              return (
                <div key={p.id}>
                  <Card
                    key={p.id}
                    hoverable
                    className="cardStyles"
                    cover={<Avatar alt="example" src={p.approver.user.imagePath} className="avatar" />}>
                    <Tooltip title={p.approver.user.firstName + " " + p.approver.user.lastName}>
                      <Link to={"/userpage/main/" + p.approver.userID} onClick={() => history.push(`/userpage/main/${p.approver.userID}`)}>
                        <Meta title={p.approver.user.firstName + " " + p.approver.user.lastName} className="titleText" />
                      </Link>
                    </Tooltip>

                    <Meta title={moment(p.confirmDate).format("DD.MM.YYYY")} className="title-not-link" />
                    <p className="cardP" />
                  </Card>
                </div>
              )
            }
          }
          )}
          <div>
            {(data?.canApprovePlastMember && AccessToManage(roles.filter(r => r != Roles.Supporter && r != Roles.RegisteredUser || roles.includes(Roles.Admin)))) ? (
              <div>
                <Tooltip
                  title="Поручитися за користувача"
                  placement="bottom">
                    <Spin spinning={approveAsMemberLoading}>
                        <Link to="#" onClick={() => approveClick(data?.user.id)}>
                            <Avatar src={AddUser}
                            alt="example" size={166}
                            className="avatarEmpty"
                            shape="square"                            
                            />
                        </Link>
                    </Spin>
                </Tooltip>
              </div>
            ) : (
            <div
              hidden={data?.confirmedUsers.length != 0 || (data?.canApprove && AccessToManage(roles.filter(r => r != Roles.Supporter && r != Roles.RegisteredUser && roles.includes(Roles.Admin))))}>
              <br />
                <br />
                    На жаль, поруки відсутні
                <br />
              <br />
            </div>
            )}
          </div>
        </div>
        <h1 className="approversCard">Поручення куреня УСП/УПС</h1>
        <div className="approversCard">
          {(data?.clubApprover != null) ? (
            <div>
              {(data.clubApprover.approver.userID == data.currentUserId || roles.includes(Roles.Admin)) ?
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
                    <Tooltip title={data.clubApprover.approver.user.firstName + " " + data.clubApprover.approver.user.lastName}>
                      <Link to={"/userpage/main/" + data.clubApprover.approver.userID} onClick={() => history.push(`/userpage/main/${data.clubApprover.approver.userID}`)}>
                        <Meta title={data.clubApprover.approver.user.firstName + " " + data.clubApprover.approver.user.lastName} className="titleText" />
                      </Link>
                    </Tooltip>
                    <Meta title={moment(data.clubApprover.confirmDate).format("DD.MM.YYYY")} className="title-not-link" />
                    <DeleteApproveButton approverId={data.clubApprover.id} deleteApprove={deleteApprove}/>
                  </Card>
                ) : (
                  <Card
                    hoverable
                    className="cardStyles"
                    cover={<Avatar
                      src={data.clubApprover.approver.user.imagePath}
                      alt="example"
                      className="avatar"
                    />}
                  >
                    <Tooltip title={data.clubApprover.approver.user.firstName + " " + data.clubApprover.approver.user.lastName}>
                      <Link to={"/userpage/main/" + data.clubApprover.approver.userID} onClick={() => history.push(`/userpage/main/${data.clubApprover.approver.userID}`)}>
                        <Meta title={data.clubApprover.approver.user.firstName + " " + data.clubApprover.approver.user.lastName} className="titleText" />
                      </Link>
                    </Tooltip>
                    <Meta title={moment(data.clubApprover.confirmDate).format("DD.MM.YYYY")} className="title-not-link" />
                  </Card>
                )}
            </div>
          ) : ((data?.clubApprover == null  && data?.canApprove && (data?.currentUserId != data?.user.id || roles.includes(Roles.Admin)) && (data?.isUserHeadOfClub || roles.includes(Roles.Admin))) ?
            (
              <div>
                <Tooltip
                  title="Поручитися за користувача"
                  placement="rightBottom">
                    <Spin spinning={approveAsHovelHeadLoading}>
                        <Link to="#" onClick={() => approveClick(data?.user.id, roles.includes(Roles.KurinHead) || roles.includes(Roles.Admin), false)}>
                            <Avatar src={AddUser}
                            alt="example" size={168}
                            className="avatarEmpty"
                            shape="square" />
                        </Link>
                    </Spin>
                </Tooltip>
              </div>
            ) : (
              <div>
                <br />
                  <br />
                    На жаль, поруки відсутні
                  <br />
                <br />
              </div>
            )
          )}
      </div>

        <h1 className="approversCard">Поручення Голови осередку/Осередкового УСП/УПС</h1>
        <div>
          {(data?.cityApprover != null) ? (
            <div>
              {(data.cityApprover.approver.userID == data.currentUserId || roles.includes(Roles.Admin)) ? (
                <Card
                  hoverable
                  className="cardStyles"
                  cover={<Avatar
                    src={data.cityApprover.approver.user.imagePath}
                    alt="example"
                    className="avatar"
                  />}
                >
                  <Tooltip title={data.cityApprover.approver.user.firstName + " " + data.cityApprover.approver.user.lastName}>
                    <Link to={"/userpage/main/" + data.cityApprover.approver.userID} onClick={() => history.push(`/userpage/main/${data.cityApprover.approver.userID}`)}>
                      <Meta title={data.cityApprover.approver.user.firstName + " " + data.cityApprover.approver.user.lastName} className="titleText" />
                    </Link>
                  </Tooltip>
                  <Meta title={moment(data.cityApprover.confirmDate).format("DD.MM.YYYY")} className="title-not-link" />
                  <DeleteApproveButton approverId={data.cityApprover.id} deleteApprove={deleteApprove}/>
                </Card>
              ) : (
                <Card
                  hoverable
                  className="cardStyles"
                  cover={<Avatar
                    src={data.cityApprover.approver.user.imagePath}
                    alt="example"
                    className="avatar"
                  />}
                >
                  <Tooltip title={data.cityApprover.approver.user.firstName + " " + data.cityApprover.approver.user.lastName}>
                    <Link to={"/userpage/main/" + data.cityApprover.approver.userID} onClick={() => history.push(`/userpage/main/${data.cityApprover.approver.userID}`)}>
                      <Meta title={data.cityApprover.approver.user.firstName + " " + data.cityApprover.approver.user.lastName} className="titleText" />
                    </Link>
                  </Tooltip>
                  <Meta title={moment(data.cityApprover.confirmDate).format("DD.MM.YYYY")} className="title-not-link" />
                </Card>
              )}

            </div>
          ) : ((data?.cityApprover == null && data?.canApprove && (data?.currentUserId != data?.user.id || roles.includes(Roles.Admin)) && (data?.isUserHeadOfCity || roles.includes(Roles.Admin))) ?
            (
              <div>
                <Tooltip
                  title="Поручитися за користувача"
                  placement="rightBottom">

                  <Spin spinning={approveAsCityHeadLoading}>
                  <Link to="#" onClick={() => approveClick(data?.user.id, false, roles.includes(Roles.CityHead) || roles.includes(Roles.Admin))}>
                    <Avatar
                      src={AddUser}
                      alt="example" size={168}
                      className="avatarEmpty"
                      shape="square" />
                  </Link>
                  </Spin>
                </Tooltip>
              </div>
            ) : (
              <div>
                <br />
                  <br />
                    На жаль, поруки відсутні
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