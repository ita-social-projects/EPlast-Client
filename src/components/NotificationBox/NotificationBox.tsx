import React,{useState, useEffect} from 'react';
import { Drawer, Space, List, Empty, Button} from 'antd';
import classes from './NotificationBox.module.css';
import NotificationBoxApi, {UserNotification } from '../../api/NotificationBoxApi';
import moment from 'moment';
type props = {
    userId : string | undefined;
    Notifications : Array<UserNotification>;
    VisibleDrawer : boolean;
    setVisibleDrawer : (visibleDrawer: boolean) => void;
    handleNotificationBox :() => void;
    RemoveNotification : (notificationId : number) => void;
    RemoveAllNotifications : (userId : string) => void;

}
const NotificationBox = ({
    userId,
    Notifications,
    VisibleDrawer,
    setVisibleDrawer,
    handleNotificationBox,
    RemoveNotification,
    RemoveAllNotifications
    }: props) =>{
    const handleCancel = () => setVisibleDrawer(false);
    
    const Debug = (item : any) => 
    {
        console.log(item)
        debugger
        return item
    }

    return (   
    <Drawer
        title="Ваші сповіщення"
        placement="right"
        closable={true}
        onClose={handleCancel}
        visible={VisibleDrawer}
        width={450}
    >
        
        {Notifications.length !== 0 ? 
            (
                <List
                itemLayout="vertical"
                dataSource={Notifications}
                bordered
                renderItem={(item, index) => (
                  <List.Item
                    extra={
                        <div className={classes.Button}> 
                            <Button className={classes.DeleteButton} onClick={() => RemoveNotification(item.id)} size="small" type="primary">&times;</Button>
                        </div>
                    }
                  >
                    {item.message + " "}<a href={item.senderLink}>{item.senderName}</a>
                    <p>{moment(item.createdAt).format("MM-DD HH:mm")}</p>
                  </List.Item>
                )}
              />
                // Notifications.map(nt => (<React.Fragment key = {nt.id}>
                // <div >
                //     {nt.date}
                // </div>
                // <div >
                //     {nt.message + " "}<a href={nt.userLink}>{nt.userName}</a>
                // </div>
                
                // {
                // <div >  
                //     <button onClick ={()=>{  } }
                //     >Видалити</button>
                // </div>
                // }
                // </React.Fragment>))
            )
            : ( <Empty description="Сповіщень немає" image={Empty.PRESENTED_IMAGE_SIMPLE} /> )
        }
    </Drawer>)
}
export default NotificationBox;
