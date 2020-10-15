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
}
const NotificationBox = ({
    userId,
    Notifications,
    VisibleDrawer,
    setVisibleDrawer,
    handleNotificationBox
    }: props) =>{
    const handleCancel = () => setVisibleDrawer(false);
 
const Debug = (txt : any) => {
    console.log(txt)
    debugger
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
                renderItem={item => (
                  <List.Item
                    key={item.id}
                    actions={[
                        <p>{item.date}</p>
                    ]}
                    extra={
                        <div className={classes.Button}> 
                            <Button className={classes.DeleteButton} size="small" type="primary">&times;</Button>
                        </div>
                    }
                  >
                    {item.message + " "}<a href={item.userLink}>{item.userName}</a>
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
