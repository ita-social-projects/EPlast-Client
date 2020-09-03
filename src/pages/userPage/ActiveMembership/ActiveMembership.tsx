import React,{useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import classes from './ActiveMembership.module.css'
import { Avatar, Typography, List, Button } from 'antd';
import activeMembershipApi, { UserPlastDegree } from '../../../api/activeMembershipApi';
import userApi from '../../../api/UserApi';
import AuthStore from '../../../stores/AuthStore';
import jwt from 'jwt-decode';
import ModalAddPlastDegree from './PlastDegree/ModalAddPlastDegree';
import moment from 'moment'
import ModalAddEndDatePlastDegree from './PlastDegree/ModalAddEndDatePlastDegree';
import DeleteDegreeConfirm from './PlastDegree/DeleteDegreeConfirm';
const { Title } = Typography;

const ActiveMembership = () => {
    const { userId } = useParams();
    const [imageBase64, setImageBase64] = useState<string>();
    const [accessLevels,setAccessLevels ] = useState([]);
    const [user, setUser] = useState<any>({});
    const [plastDegrees, setPlastDegrees] = useState<Array<UserPlastDegree>>([]);
    const [visibleModal, setVisibleModal] = useState<boolean>(false);
    const [userToken, setUserToken] = useState<any>([{ nameid: '' }]);
    const [endDateVisibleModal,setEndDateVisibleModal] = useState<boolean>(false);
    const [plastDegreeIdToAddEndDate, setPlastDegreeIdToAddEndDate] = useState<number>(0);
    const handleAddDegree = async() =>{
        await activeMembershipApi.getUserPlastDegrees(userId).then(response =>{
            setPlastDegrees(response);
        }); 
    }
    const handleDeleteUserPlastDegree = (plastDegreeId : number)=>{
        
    };
    const handleChangeAsCurrent = (plastDegreeIdToSetAsCurrent: number) =>{
          const upd : Array<UserPlastDegree>=  plastDegrees.map((pd)=>{
                if(pd.isCurrent){
                    pd.isCurrent = !pd.isCurrent;
                }
                if(pd.plastDegree.id === plastDegreeIdToSetAsCurrent){
                    pd.isCurrent = !pd.isCurrent;
                }
                return pd;
            });
            setPlastDegrees(upd);
    };
    const fetchData  =  async () =>{
        const token = AuthStore.getToken() as string;
            setUserToken(jwt(token));
        setAccessLevels(await activeMembershipApi.getAccessLevelById(userId));
        await userApi.getById(userId).then(async response => {
            setUser(response.data.user)
           
            await userApi.getImage(response.data.user.imagePath).then((response: { data: any; }) => {
                setImageBase64(response.data);
            })
        });
       await activeMembershipApi.getUserPlastDegrees(userId).then(response =>{
           setPlastDegrees(response);
       }) 
    };
    const handleDelete = async () =>{ 
        fetchData();
    }
    const handleAddEndDate = async () =>{
        fetchData();
    }
    const showModal = () => setVisibleModal(true);
    useEffect(()=>{
        fetchData();
    },[]);
return <div className={classes.wrapper} >
                <div className={classes.wrapperImg}>
                    <Avatar size={250} src={imageBase64} />
                    <Title level={2}> {user.firstName} {user.lastName} </Title>
                < div className={classes.line} id={classes.line} />
                <Button type="primary" onClick={showModal}>
                Додати ступінь
              </Button>
                </div>
        <div className={classes.wrapperCol} >
        <div className={classes.wrapper}>
        <div className={classes.wrapper2}>

             </div>
             <div className={classes.wrapper2}> 
        <Title level={2}> Рівні доступу користувача </Title>      
             <div className={classes.line} />
            <List
            dataSource = {accessLevels}
            renderItem={item => <List.Item style ={ {fontSize : "20px"}}>{item}</List.Item> } />
           
        </div>
        </div>
        <div className={classes.wrapper}>
        <div className={classes.wrapperPlastDegree}>
         <Title level={2}> Ступені користувача </Title>      
             <div className={classes.line} />
                {plastDegrees.map(pd => (<React.Fragment key = {pd.id}>
            <div className={classes.textFieldsMain}>
                {pd.plastDegree.name}
            </div>
            <div className={classes.textFieldsOthers}>
               Дата початку ступеню: { moment(pd.dateStart).format("YYYY-MM-DD")}
            </div>
            {pd.dateFinish !== null &&  <div className={classes.textFieldsOthers}>
               Дата завершення ступеню: { moment(pd.dateFinish).format("YYYY-MM-DD")}
            </div>}
            <div className={classes.buttons}>  <button onClick ={()=>{
                DeleteDegreeConfirm(userId, pd.plastDegree.id, handleDelete);
            }
            }
            className = {classes.button}
            >Видалити</button>
             <button onClick ={()=>{
                 setPlastDegreeIdToAddEndDate(pd.plastDegree.id);
                 setEndDateVisibleModal(true);
            }
            }
            className = {classes.button}
            >Надати дату завершення</button>
            {!pd.isCurrent && <button onClick ={ async ()=>{
            await activeMembershipApi.setPlastDegreeAsCurrent(userId, pd.plastDegree.id).then(()=>{
                handleChangeAsCurrent(pd.plastDegree.id);
            });
        }
        }
        className = {classes.button}
        >Обрати поточним</button>}
            </div>
          
            </React.Fragment>))}
            
             </div>
        </div>
        </div>
        <ModalAddPlastDegree 
        handleAddDegree = {handleAddDegree}
        handleDeleteUserPlastDegree ={handleDeleteUserPlastDegree}
        userId = {userId} 
        visibleModal = {visibleModal}
        setVisibleModal ={setVisibleModal}/>
        <ModalAddEndDatePlastDegree 
        userId = {userId}
        plastDegreeId = {plastDegreeIdToAddEndDate}
        endDateVisibleModal = {endDateVisibleModal}
        setEndDateVisibleModal = {setEndDateVisibleModal}
        handleAddEndDate = {handleAddEndDate}/>
</div>;
}
export default ActiveMembership;