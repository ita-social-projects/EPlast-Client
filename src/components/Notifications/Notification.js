import {notification} from 'antd';
 
const openNotificationWithIcon = (type, text, icon = null) => {
  (notification[type] )({
    message: 'Сповіщення',
    icon: icon,
    description : text
  });
  };

  export default openNotificationWithIcon;