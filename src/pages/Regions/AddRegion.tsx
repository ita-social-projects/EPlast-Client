import {
  Form,
  Input,
  DatePicker,
  AutoComplete,
  Select,
  Button,
  Layout,
  Card,
  Upload,
  Col,
  Row,
} from "antd";
import React, { useState, useEffect } from "react";
import RegionsApi from "../../api/regionsApi";
import classes from "./Form.module.css";
import "./CreateRegion.less";
import CityDefaultLogo from "../../assets/images/default_city_image.jpg";
import notificationLogic from "../../components/Notifications/Notification";
import { RcCustomRequestOptions } from "antd/es/upload/interface";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";

const AddNewRegionFormPage = () => {
  const [form] = Form.useForm();
  const history = useHistory();

  const [logo, setLogo] = useState<any>();

  const handleSubmit = async (values: any) => {
    const newRegion: any = {
      regionName: values.regionName,
      description: values.description,
      phoneNumber: values.phoneNumber,
      email: values.email,
      link: values.link,
      logo: logo,
      street: values.street,
      houseNumber: values.houseNumber,
      officeNumber: values.officeNumber,
      postIndex: values.postIndex,
      city: values.city,
    };
    await RegionsApi.createRegion(newRegion);
    form.resetFields();

    notificationLogic("success", "Успішно додано округ");
    history.push("/regions");
  };

  const checkFile = (size: number, fileName: string) => {
    const extension = fileName.split(".").reverse()[0];
    const isCorrectExtension =
      extension.indexOf("jpeg") !== -1 ||
      extension.indexOf("jpg") !== -1 ||
      extension.indexOf("png") !== -1;
    if (!isCorrectExtension) {
      notificationLogic("error", "Можливі розширення фото: png, jpg, jpeg");
    }

    const isSmaller2mb = size <= 3145728;
    if (!isSmaller2mb) {
      notificationLogic("error", "Розмір файлу перевищує 3 Мб");
    }

    return isCorrectExtension && isSmaller2mb;
  };

  const getBase64 = (img: Blob, callback: Function) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const handleUpload = (info: RcCustomRequestOptions) => {
    if (info !== null) {
      if (checkFile(info.file.size, info.file.name)) {
        getBase64(info.file, (base64: string) => {
          setLogo(base64);
        });
        notificationLogic("success", "Фото завантажено");
      }
    } else {
      notificationLogic("error", "Проблема з завантаженням фото");
    }
  };

  return (
    <Layout.Content className="createCity">
      <Card hoverable className="createCityCard">
        <h1>Створення нового округу</h1>
        <br />
        <Form name="basic" onFinish={handleSubmit} form={form}>
          <Form.Item name="logo">
            <Upload
              name="avatar"
              listType="picture-card"
              showUploadList={false}
              accept=".jpeg,.jpg,.png"
              customRequest={handleUpload}
            >
              <PlusOutlined />
              <img
                src={logo ? logo : CityDefaultLogo}
                alt="Region"
                className="cityLogo"
              />
            </Upload>
          </Form.Item>

          <Row justify="center">
            <Col md={11} xs={24}>
              <Form.Item
                className={classes.formField}
                label="Назва округу"
                name="regionName"
                rules={[
                  {
                    required: true,
                    message: "Це поле має бути заповненим",
                  },
                  {
                    max: 50,
                    message: "Максимальна довжина - 50 символів!",
                  },
                ]}
              >
                <Input className={classes.inputField} />
              </Form.Item>
            </Col>
            <Col md={{ span: 11, offset: 2 }} xs={24}>
              <Form.Item
                className={classes.formField}
                label="Опис"
                name="description"
                rules={[
                  {
                    required: true,
                    message: "Це поле має бути заповненим",
                  },
                  {
                    max: 250,
                    message: "Максимальна довжина - 250 символів!",
                  },
                ]}
              >
                <Input className={classes.inputField} />
              </Form.Item>
            </Col>

            <Col md={11} xs={24}>
              <Form.Item
                className={classes.formField}
                label="Номер телефону"
                name="phoneNumber"
                rules={[
                  {
                    required: true,
                    message: "Це поле має бути заповненим",
                  },
                  {
                    max: 13,
                    message: "Максимальна довжина 13 цифр!",
                  },
                ]}
              >
                <Input className={classes.inputField} />
              </Form.Item>
            </Col>

            <Col md={{ span: 11, offset: 2 }} xs={24}>
              <Form.Item
                className={classes.formField}
                label="Електронна пошта"
                name="email"
                rules={[
                  {
                    pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                    message: "Неправильна пошта",
                  },
                  {
                    required: true,
                    message: "Це поле має бути заповненим",
                  },
                  {
                    max: 50,
                    message: "Максимальна довжина - 50 символів!",
                  },
                ]}
              >
                <Input className={classes.inputField} />
              </Form.Item>
            </Col>

            <Col md={11} xs={24}>
              <Form.Item
                className={classes.formField}
                label="Посилання"
                name="link"
                rules={[
                  {
                    required: true,
                    message: "Це поле має бути заповненим",
                  },
                  {
                    max: 500,
                    message: "Максимальна довжина - 500 символів!",
                  },
                ]}
              >
                <Input className={classes.inputField} />
              </Form.Item>
            </Col>

            <Col md={{ span: 11, offset: 2 }} xs={24}>
              <Form.Item
                className={classes.formField}
                label="Місто"
                name="city"
                rules={[
                  {
                    max: 50,
                    message: "Максимальна довжина - 50 символів!",
                  },
                  {
                    required: true,
                    message: "Це поле має бути заповненим",
                  },
                ]}
              >
                <Input className={classes.inputField} />
              </Form.Item>
            </Col>

            <Col md={11} xs={24}>
              <Form.Item
                className={classes.formField}
                label="Вулиця"
                name="street"
                rules={[
                  {
                    max: 50,
                    message: "Максимальна довжина - 50 символів!",
                  },
                  {
                    required: true,
                    message: "Це поле має бути заповненим",
                  },
                ]}
              >
                <Input className={classes.inputField} />
              </Form.Item>
            </Col>

            <Col md={{ span: 11, offset: 2 }} xs={24}>
              <Form.Item
                className={classes.formField}
                label="Номер будинку"
                name="houseNumber"
                rules={[
                  {
                    max: 5,
                    message: "Максимальна довжина - 5 символів!",
                  },
                  {
                    required: true,
                    message: "Це поле має бути заповненим",
                  },
                ]}
              >
                <Input className={classes.inputField} />
              </Form.Item>
            </Col>

            <Col md={11} xs={24}>
              <Form.Item
                className={classes.formField}
                label="Номер офісу/квартири"
                name="officeNumber"
                rules={[
                  {
                    max: 5,
                    message: "Максимальна довжина - 5 символів!",
                  },
                  {
                    required: true,
                    message: "Це поле має бути заповненим",
                  },
                ]}
              >
                <Input className={classes.inputField} />
              </Form.Item>
            </Col>

            <Col md={{ span: 11, offset: 2 }} xs={24}>
              <Form.Item
                className={classes.formField}
                label="Поштовий індекс"
                name="postIndex"
                rules={[
                  {
                    max: 5,
                    message: "Максимальна довжина - 5 символів!",
                  },
                  {
                    required: true,
                    message: "Це поле має бути заповненим",
                  },
                ]}
              >
                <Input className={classes.inputField} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ textAlign: "right" }}>
            <Button type="primary" htmlType="submit">
              Додати
            </Button>
          </Form.Item>
        </Form>
        ;
      </Card>
    </Layout.Content>
  );
};

export default AddNewRegionFormPage;
