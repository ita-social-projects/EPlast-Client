import React, { useState } from 'react';
import { Avatar, Modal, Button } from 'antd';
import { useHistory } from 'react-router-dom';

import classes from './EditEvent.module.css';

const EditEvent = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modal2Visible, setModal2Visible] = useState(false);
  const history = useHistory();
  return (
    <div className={classes.wrapper}>
      <div className={classes.wrapperImg}>
        <Avatar size={200} src="https://eplast.azurewebsites.net/images/Users/374756d8-8f87-48df-ab20-b268842392be.jpg" />
        <h1>Остап Вишня</h1>
        <h2>Пластун прихильник</h2>
        <div className={classes.line} />
        <Button type="primary" className={classes.button} onClick={() => history.push('/actions/eventCreate')}>
          Створити подію
        </Button>
      </div>

      <div className={classes.wrapperCol}>
        <div className={classes.wrapper}>
          <div className={classes.wrapper2}>
            <h1>
              Відвідані події</h1>
            <div className={classes.line} />
            <h2>Ви ще не відвідали жодної події</h2>
          </div>

          <div className={classes.wrapper3}>
            <h1>Створені події</h1>
            <div className={classes.line} />
            <h2>3 події</h2>
            <Button type="primary" className={classes.button} onClick={() => setModalVisible(true)}>
              Список
            </Button>
            <Modal
              title="Створених подій: 3"
              centered
              visible={modalVisible}
              className={classes.modal}
              onCancel={() => setModalVisible(false)}
              footer={[
                <Button key='submit' className={classes.buttonCansel} onClick={() => setModalVisible(false)}>Закрити</Button>
              ]}
            >
              <h1>Прекрасна подія в Зубрі</h1>
              <h2>Дата початку: 06-05-2020, дата завершення: 07-05-2020</h2>
              <Button type="primary" className={classes.button} id={classes.button} onClick={() => history.push('/actions/eventinfo/1')}>
              Деталі
            </Button>
              <hr />

              <h1>Еволюція</h1>
              <h2>Дата початку: 28-05-2020, дата завершення: 30-06-2020</h2>
              <Button type="primary" className={classes.button} id={classes.button} onClick={() => history.push('/actions/eventinfo/1')}>
              Деталі
            </Button>
              <hr />

              <h1>Похід в ліс</h1>
              <h2>Дата початку: 08-06-2020, дата завершення: 08-07-2020</h2>
              <Button type="primary" className={classes.button} id={classes.button} onClick={() => history.push('/actions/eventinfo/1')}>
              Деталі
            </Button>
            </Modal>

          </div>
        </div>

        <div className={classes.wrapper4}>
          <h1>Заплановані події</h1>
          <div className={classes.line} />
          <h2>2 події</h2>
          <Button type="primary" className={classes.button} onClick={() => setModal2Visible(true)}>
              Список
            </Button>
          <Modal
            title="Запланованих подій: 2"
            centered
            visible={modal2Visible}
            className={classes.modal}
            onCancel={() => setModal2Visible(false)}
            footer={[
              <Button key='submit' className={classes.buttonCansel} onClick={() => history.push('/actions')}>Запланувати нову подію</Button>,
              <Button key='submit' className={classes.buttonCansel} onClick={() => setModal2Visible(false)}>Закрити</Button>
            ]}
          >
            <h1>Крайовий Пластовий З`їзд Молоді</h1>
            <h2>Дата початку: 15-05-2020, дата завершення: 16-08-2020</h2>
              <Button type="primary" className={classes.button} id={classes.button} onClick={() => history.push('/actions/eventinfo/1')}>
              Деталі
            </Button>
            <hr />

            <h1>Сихівські озера</h1>
            <h2>Дата початку: 06-11-2020, дата завершення: 06-11-2020</h2>
            <Button type="primary" className={classes.button} id={classes.button} onClick={() => history.push('/actions/eventinfo/1')}>
              Деталі
            </Button>
          </Modal>
        </div>

      </div>
    </div>
  );
}
export default EditEvent;