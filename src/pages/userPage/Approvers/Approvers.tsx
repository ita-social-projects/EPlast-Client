import React, { useState, useEffect } from 'react';
import {useParams} from 'react-router-dom';
import { Card, Space, Spin, Button } from 'antd';
import classes from './Approvers.module.css';
import AvatarAndProgress from '../../../../src/pages/userPage/personalData/AvatarAndProgress';
import AddUser from "../../../assets/images/user_add.png";
import { ApproversData } from '../Interface/Interface';
import jwt from 'jwt-decode';
import AuthStore from '../../../stores/Auth';
import userApi from '../../../api/UserApi';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { useHistory } from 'react-router-dom';

const Assignments = () => {
  const history = useHistory();
  const {userId}=useParams();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ApproversData>();
  const fetchData = async () => {
    const token = AuthStore.getToken() as string;
    const user : any = jwt(token);
    await userApi.getApprovers(userId,user.nameid).then(response =>{
      setData(response.data);
      setLoading(true);
    })
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleClick=async (event:number)=>{
    await userApi.deleteApprove(event);
    fetchData();
  }
  const approveClick=async (userId:string, isClubAdmin:boolean=false, isCityAdmin:boolean=false)=>{
    await userApi.approveUser(userId,isClubAdmin,isCityAdmin);
    fetchData();
  }

  const { Meta } = Card;
  return loading === false ? (
    <div className={classes.spaceWrapper}>
      <Space className={classes.loader} size="large">
        <Spin size="large" />
      </Space>
    </div>
    
  ) : (
    <div className={classes.wrapper}>
      <div className={classes.displayFlex}>
      <AvatarAndProgress imageUrl={data?.user.imagePath} time={data?.timeToJoinPlast}  firstName={data?.user.firstName} lastName={data?.user.lastName}/>
      <div className={classes.content}>
      <h1>{data?.user.firstName} {data?.user.lastName}</h1>
        <hr/>
        <h1>Поручення дійсних членів</h1>
        <div className={classes.displayFlex}>
          {data?.confirmedUsers.map(p=>
          {
            if(p.approver.userID==data?.currentUserId){
                return (
                      <div key={p.id}>
                        <Card
                          key={p.id}
                          hoverable
                          className={classes.cardStyles}
                          cover={<img alt="example"  src={p.approver.user.imagePath} className={classes.avatar}/>}
                        >
                            <Meta title={p.approver.user.firstName+" "+p.approver.user.lastName} className={classes.titleText}/>
                            <Meta title={moment(p.confirmDate).format("DD-MM-YYYY")} className={classes.titleText}/>
                            <Button className={classes.cardButton} danger onClick={()=>handleClick(p.id)}>
                                Відкликати
                            </Button>
                        </Card>
                      </div>
                      )
                }
            else{
                  return (
                    <div key={p.id}>
                      <Link to="#" onClick={()=>history.push(`/userpage/main/${p.approver.userID}`)}>
                        <Card
                          key={p.id}
                          hoverable
                          className={classes.cardStyles}
                          cover={<img alt="example"  src={p.approver.user.imagePath} className={classes.avatar}/>}
                        >
                          <Meta title={p.approver.user.firstName+" "+p.approver.user.lastName} className={classes.titleText}/>
                          <Meta title={moment(p.confirmDate).format("DD-MM-YYYY")} className={classes.titleText}/>
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
                  <Link to="#" onClick={()=>approveClick(data?.user.id)}>
                      <Card
                      hoverable
                      className={classes.cardStyles}
                      cover={<img alt="example" src={AddUser} className={classes.avatar}/>}
                    >
                    </Card>
                  </Link>
                </div>
              )}
              {data?.confirmedUsers.length==0 && (
                <div>
                  <br />
                  <br />
                    На жаль поруки відсутні
                  <br />
                  <br />
                </div>
              ) }
          </div>
          
        </div>
        <h1>Поручення куреня УСП/УПС</h1>
        <div className={classes.displayFlex}>
          {(data?.clubApprover!=null) ? (
             <div>
               <Link to="#" onClick={()=>history.push(`/userpage/main/${data.clubApprover.approver.userID}`)}>
                  <Card
                  hoverable
                  className={classes.cardStyles}
                  cover={<img alt="example"  src={data.clubApprover.approver.user.imagePath} className={classes.avatar}/>}
                >
                    <Meta title={data.clubApprover.approver.user.firstName+" "+data.clubApprover.approver.user.lastName} className={classes.titleText}/>
                    <Meta title={moment(data.clubApprover.confirmDate).format("DD-MM-YYYY")} className={classes.titleText}/>
                    {data.clubApprover.approver.userID==data.currentUserId && (
                        <Button className={classes.cardButton} danger onClick={()=>handleClick(data.clubApprover.id)} value={data.clubApprover.id}>
                            Відкликати
                        </Button>
                    )}
                  </Card>
               </Link>
           </div>
          ):((data?.clubApprover==null && data?.currentUserId!=data?.user.id && data?.isUserHeadOfClub)?
          (
            <div>
                  <Link to="#" onClick={()=>approveClick(data.user.id,true)}>
                      <Card
                      hoverable
                      className={classes.cardStyles}
                      cover={<img alt="example" src={AddUser} className={classes.avatar}/>}
                    >
                    </Card>
                  </Link>
            </div>
         ):(
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
        <div className={classes.displayFlex}>
        {(data?.cityApprover!=null) ? (
             <div>
               <Link to="#" onClick={()=>history.push(`/userpage/main/${data.cityApprover.approver.userID}`)}>
                  <Card
                    hoverable
                    className={classes.cardStyles}
                    cover={<img alt="example"  src={data.cityApprover.approver.user.imagePath} className={classes.avatar}/>}
                  >
                    <Meta title={data.cityApprover.approver.user.firstName+" "+data.cityApprover.approver.user.lastName} className={classes.titleText}/>
                    <Meta title={moment(data.cityApprover.confirmDate).format("DD-MM-YYYY")} className={classes.titleText}/>
                    {data.cityApprover.approver.userID==data.currentUserId && (
                        <Button className={classes.cardButton} danger onClick={()=>handleClick(data.cityApprover.id)} value={data.cityApprover.id}>
                            Відкликати
                        </Button>
                    )}
                  </Card>
               </Link>
           </div>
          ):((data?.cityApprover==null && data?.currentUserId!=data?.user.id && (data?.isUserHeadOfRegion||data?.isUserHeadOfCity)) ?
          (
            <div>
            <Link to="#" onClick={()=>approveClick(data.user.id,false,true)}>
                <Card
                hoverable
                className={classes.cardStyles}
                cover={<img alt="example" src={AddUser} className={classes.avatar}/>}
              >
              </Card>
            </Link>
          </div>
         ):(
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