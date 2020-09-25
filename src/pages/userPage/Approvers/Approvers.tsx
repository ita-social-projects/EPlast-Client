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

const Assignments = () => {
  const history = useHistory();
  const { userId } = useParams();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ApproversData>();
  const fetchData = async () => {
    const token = AuthStore.getToken() as string;
    const user: any = jwt(token);
    await userApi.getApprovers(userId, user.nameid).then(response => {
      setData(response.data);
      setLoading(true);
    }).catch(() => { notificationLogic('error', "Не вдалося завантажити дані") });
  };
  useEffect(() => {
    fetchData();
  }, []);

  const deleteApprove = async (event: number) => {
    await userApi.deleteApprove(event).
      then(() => { notificationLogic('success', "Поручення успішно видалине") }).
      catch(() => { notificationLogic('error', "Не вдалося видалити поручення") });
    fetchData();
  }
  const approveClick = async (userId: string, isClubAdmin: boolean = false, isCityAdmin: boolean = false) => {
    await userApi.approveUser(userId, isClubAdmin, isCityAdmin).
      catch(() => { notificationLogic('error', "Не вдалося поручитися") });
    fetchData();
  }

  const { Meta } = Card;
  return loading === false ? (
    <Spinner />
  ) : (
      <div className="wrapper">
        <div className="displayFlex">
          <div className="avatarWrapper">
            <AvatarAndProgress imageUrl={data?.user.imagePath} time={data?.timeToJoinPlast} firstName={data?.user.firstName} lastName={data?.user.lastName} isUserPlastun={data?.isUserPlastun} />
          </div>
          <div className="approversContent">
            <hr/>
            <h1>Поручення дійсних членів</h1>
            <div className="approversCard">
              {data?.confirmedUsers.map(p => {
                if (p.approver.userID == data?.currentUserId) {
                  return (
                    <div key={p.id}>
                      <Card
                        key={p.id}
                        hoverable
                        className="cardStyles"
                        cover={<Avatar alt="example" src={p.approver.user.imagePath} className="avatar" />}
                      >
                        <Meta title={p.approver.user.firstName + " " + p.approver.user.lastName} className="titleText" />
                        <Meta title={moment(p.confirmDate).format("DD-MM-YYYY")} className="titleText" />
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
                          <Meta title={moment(p.confirmDate).format("DD-MM-YYYY")} className="titleText" />
                          <p className="cardP" />
                        </Card>
                      </Link>
                    </div>
                  )
                }
              }
              )}
              <div>
                {data?.canApprove && (
                  <div>
                    <Tooltip
                      title="Поручитися за користувача"
                      placement="rightBottom">
                      <Link to="#" onClick={() => approveClick(data?.user.id)}>
                          <Avatar
                            src={AddUser}
                            alt="example" size={168}
                            className="avatarEmpty" 
                            shape="square"/>
                          <Meta className="cardBodyEmpty" />
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
                  {(data.clubApprover.approver.userID == data.currentUserId) ?
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
                        <Meta title={moment(data.clubApprover.confirmDate).format("DD-MM-YYYY")} className="titleText" />
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
                          <Meta title={moment(data.clubApprover.confirmDate).format("DD-MM-YYYY")} className="titleText" />
                        </Card>
                      </Link>
                    )}

                </div>
              ) : ((data?.clubApprover == null && data?.currentUserId != data?.user.id && data?.isUserHeadOfClub) ?
                (
                  <div>
                    <Tooltip
                      title="Поручитися за користувача"
                      placement="rightBottom">
                      <Link to="#" onClick={() => approveClick(data.user.id, true)}>
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
            <h1>Поручення Голови осередку/Осередкового УСП/УПС</h1>
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
                      <Meta title={moment(data.cityApprover.confirmDate).format("DD-MM-YYYY")} className="titleText" />
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
                          <Meta title={moment(data.cityApprover.confirmDate).format("DD-MM-YYYY")} className="titleText" />
                        </Card>
                      </Link>
                    )}

                </div>
              ) : ((data?.cityApprover == null && data?.currentUserId != data?.user.id && (data?.isUserHeadOfRegion || data?.isUserHeadOfCity)) ?
                (
                  <div>
                    <Tooltip
                      title="Поручитися за користувача"
                      placement="rightBottom">
                      <Link to="#" onClick={() => approveClick(data.user.id, false, true)}>
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
      </div>
    );
}
export default Assignments;