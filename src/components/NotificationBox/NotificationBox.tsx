import React,{ useEffect} from 'react';
import { Drawer, List, Empty, Button} from 'antd';
import classes from './NotificationBox.module.css';
import NotificationBoxApi, {UserNotification } from '../../api/NotificationBoxApi';
import moment from 'moment';
import { CloseOutlined } from '@ant-design/icons';
type props = {
    userId : string;
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
    const handleCancel = () => {
        setVisibleDrawer(false);
        handleNotificationBox();
    }

    return (   
    <Drawer
        title="Ваші сповіщення"
        placement="right"
        closable={true}
        onClose={handleCancel}
        visible={VisibleDrawer}
        width={450}
        footer={
            <div className={classes.Footer}>
              <Button onClick={handleCancel} style={{ width:"50%" }}>
                Закрити сповіщення
              </Button>
              <Button onClick={() => {RemoveAllNotifications(userId)}} danger style={{ width:"50%" }}>
                Видалити всі сповіщення
              </Button>
            </div>
          }
    >
        
        {Notifications.length !== 0 ? 
            (
                <List
                itemLayout="vertical"
                dataSource={Notifications}
                bordered
                renderItem={(item, index) => (
                  <List.Item
                  >
                    <div className={classes.NotificationItem}>
                        <div className={classes.NotificationTextBox}>
                            <div className={classes.Text}>
                                {item.message + " "}
                                {item.senderName && item.senderLink &&
                                    <a className={classes.Link} href={item.senderLink}>{item.senderName}</a>
                                }
                            </div> 
                            <p className={classes.Date}>
                                {moment(item.createdAt).format("DD.MM.YYYY HH:mm")}
                            </p>
                        </div> 
                        <div className={classes.Button}> 
                            <Button 
                                icon={<CloseOutlined style={{ fontSize: "12px" }} />} 
                                onClick={() => RemoveNotification(item.id)} 
                                size="small" 
                                type="primary"
                            > 
                            </Button>
                        </div>
                    </div>
                  </List.Item>
                )}
              />
            )
            : ( <Empty description="Сповіщень немає" image={Empty.PRESENTED_IMAGE_SIMPLE} /> )
        }
    </Drawer>)
}
export default NotificationBox;
