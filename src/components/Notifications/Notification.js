import {notification} from 'antd';
 
const openNotificationWithIcon = (type, text) => {
  (notification[type] )({
    message: 'Notification Title',
    description : text
  });
  };

  export default openNotificationWithIcon;