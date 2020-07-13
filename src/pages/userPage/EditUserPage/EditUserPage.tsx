import React, { useEffect, useState } from 'react';
import { Form, Input, Avatar, Upload, Button, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import styles from './EditUserPage.module.css';
import { checkEmail, checkNameSurName, checkPhone } from '../../SignUp/verification';
import {getBase64} from './Services';
import avatar from '../../../assets/images/avatar.jpg';

export default function () {
  const [form] = Form.useForm();

  const [initialValues] = useState({
    name: 'Василь',
    surname: 'Хартманє',
    email: 'admin@eplast.com',
    phone: '00 00 000 00',
    nationality: 'Національність',
    birth: '06-08-1949',
    gender: 'Жінка',
    studingPlace: 'Львів',
    specialty: 'Ветеренарія',
    degree: 'Бакалавр',
    workPlace: 'Кременчук',
    religion: 'Агностик',
  });
  const [userAvatar, setUserAvatar] = useState(avatar);

  const validationSchema = {
    email: [{ required: true, message: "Email обов'язковим" }, { validator: checkEmail }],
    name: [
      { required: true, message: "Ім'я є обов'язковим" },
      { min: 3, message: 'Мінімальна довжина - 3 символи' },
      { validator: checkNameSurName },
    ],
    surName: [
      { required: true, message: "Прізвище є обов'язковим" },
      { min: 3, message: 'Мінімальна довжина - 3 символи' },
      { validator: checkNameSurName },
    ],
    phone: [{ validator: checkPhone }],
  };

  useEffect(() => {}, []);

  const uploadPhotoConfig = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info: any) {
      if (info.file.status === 'done') {
        getBase64(info.file.originFileObj, (imageUrl: any) => {
          setUserAvatar(imageUrl);
        });
      } else if (info.file.status === 'removed') {
        setUserAvatar(avatar);
      }
    },
  };

  const { name, action, headers, onChange } = uploadPhotoConfig;

  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  return (
    <div className={styles.mainContainer}>
      <Form form={form} className={styles.formContainer} onFinish={onFinish}>
        <div className={styles.avatarWrapper}>
          <Avatar size={256} src={userAvatar} className="avatarElem" />
          <Upload name={name} action={action} headers={headers} onChange={onChange} className={styles.changeAvatar}>
            <Button className={styles.changeAvatarBtn}>
              <UploadOutlined /> Вибрати
            </Button>
          </Upload>
        </div>
        <div className={styles.allFields}>
          <h2 className={styles.title}>Редагування профілю</h2>
          <div className={styles.rowBlock}>
            <Form.Item
              label="Ім`я"
              name="name"
              initialValue={initialValues.name}
              rules={validationSchema.name}
              className={styles.formItem}
            >
              <Input className={styles.dataInput} />
            </Form.Item>
            <Form.Item
              label="Прізвище"
              name="surname"
              initialValue={initialValues.surname}
              rules={validationSchema.surName}
              className={styles.formItem}
            >
              <Input className={styles.dataInput} />
            </Form.Item>
          </div>
          <div className={styles.rowBlock}>
            <Form.Item
              label="Національність"
              name="nationality"
              initialValue={initialValues.nationality}
              className={styles.formItem}
            >
              <Select className={styles.dataInput}>
                <Select.Option value="Україна" key="1">
                  Україна
                </Select.Option>
                <Select.Option value="Білорусь" key="2">
                  Білорусь
                </Select.Option>
                <Select.Option value="Польща" key="3">
                  Польща
                </Select.Option>
                <Select.Option value="Литва" key="4">
                  Литва
                </Select.Option>
                <Select.Option value="Америка" key="5">
                  Америка
                </Select.Option>
                <Select.Option value="Англія" key="6">
                  Англія
                </Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Номер телефону"
              name="phone"
              initialValue={initialValues.phone}
              className={styles.formItem}
              rules={validationSchema.phone}
            >
              <Input className={styles.dataInput} />
            </Form.Item>
          </div>
          <div className={styles.rowBlock}>
            <Form.Item
              label="Дата народження"
              name="birth"
              initialValue={initialValues.birth}
              className={styles.formItem}
            >
              <Input className={styles.dataInput} />
            </Form.Item>
            <Form.Item label="Стать" name="gender" initialValue={initialValues.gender} className={styles.formItem}>
              <Select className={styles.dataInput}>
                <Select.Option value="Чоловік" key="1">
                  Чоловік
                </Select.Option>
                <Select.Option value="Жінка" key="2">
                  Жінка
                </Select.Option>
              </Select>
            </Form.Item>
          </div>
          <div className={styles.rowBlock}>
            <Form.Item
              label="Місце навчання"
              name="studingPlace"
              initialValue={initialValues.studingPlace}
              className={styles.formItem}
            >
              <Input className={styles.dataInput} />
            </Form.Item>
            <Form.Item
              label="Спеціальність"
              name="specialty"
              initialValue={initialValues.specialty}
              className={styles.formItem}
            >
              <Select className={styles.dataInput}>
                <Select.Option value="Програмування" key="1">
                  Програмування
                </Select.Option>
                <Select.Option value="Ветеренарія" key="2">
                  Ветеренарія
                </Select.Option>
              </Select>
            </Form.Item>
          </div>
          <Button className={styles.confirmBtn} htmlType="submit">
            Підтердити
          </Button>
        </div>
      </Form>
    </div>
  );
}