import {notification} from 'antd';
 
const openNotificationWithIcon = (type, text) => {
  (notification[type] )({
    message: 'Заголовок сповіщення',
    description : text
  });
  };

  export default openNotificationWithIcon;