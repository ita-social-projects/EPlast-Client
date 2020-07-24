import {notification} from 'antd';
 
const openNotificationWithIcon = (type, text) => {
  (notification[type] )({
    message: 'Сповіщення',
    description : text
  });
  };

  export default openNotificationWithIcon;