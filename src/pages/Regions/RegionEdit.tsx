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
  Row,
  Col,
} from "antd";
import React, { useState, useEffect } from "react";
import RegionsApi from "../../api/regionsApi";
import classes from "./Form.module.css";
import "./CreateRegion.less";
import notificationLogic from "../../components/Notifications/Notification";
import regionsApi from "../../api/regionsApi";
import { PlusOutlined } from "@ant-design/icons";
import CityDefaultLogo from "../../assets/images/default_city_image.jpg";
import { RcCustomRequestOptions } from "antd/es/upload/interface";
import { useHistory } from "react-router-dom";
import Spinner from "../Spinner/Spinner";

const RegionEditFormPage = () => {
  let currentRegion = Number(
    window.location.hash.substring(1) ||
      window.location.pathname.split("/").pop()
  );
  const [form] = Form.useForm();
  const history = useHistory();
  const [loading, setLoading] = useState<boolean>(true);
  const [logo, setLogo] = useState<any>();

  const [chosenRegion, setChosenRegion] = useState<any>({
    regionName: "",
    description: "",
    phoneNumber: "",
    email: "",
    link: "",
    street: "",
    houseNumber: "",
    officeNumber: "",
    postIndex: "",
    logo: "",
    city: "",
  });

  useEffect(() => {
    getRegion();
  }, []);

  const getRegion = async () => {
    try {
      const response = await RegionsApi.getRegionById(currentRegion);
      setChosenRegion(response.data);
      setLogo(response.data.logo);
    } finally {
      setLoading(false);
    }
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

  const handleSubmit = async (values: any) => {
    const newRegion: any = {
      regionName: values.regionName,
      description: values.description,
      phoneNumber: values.phoneNumber,
      email: values.email,
      link: values.link,
      street: values.street,
      houseNumber: values.houseNumber,
      officeNumber: values.officeNumber,
      postIndex: values.postIndex,
      logo: logo,
      city: values.city,
    };
    await RegionsApi.EditRegion(currentRegion, newRegion);

    form.resetFields();

    notificationLogic("success", "Успішно змінено дані округу");
    history.push(`/regions/${currentRegion}`);
  };

  return (
    <Layout.Content className="createCity">
      <Card hoverable className="createCityCard">
        {loading === true ? (
          <Spinner />
        ) : (
          <Form name="basic" onFinish={handleSubmit} form={form}>
            <h1>Редагування даних округу</h1>
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
                  label="Назва регіону"
                  name="regionName"
                  initialValue={chosenRegion.regionName}
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
                  <Input
                    className={classes.inputField}
                    value={chosenRegion.regionName}
                  />
                </Form.Item>
              </Col>
              <Col md={{ span: 11, offset: 2 }} xs={24}>
                <Form.Item
                  className={classes.formField}
                  label="Опис"
                  name="description"
                  initialValue={chosenRegion?.description}
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
                  <Input
                    value={chosenRegion?.description}
                    className={classes.inputField}
                  />
                </Form.Item>
              </Col>

              <Col md={11} xs={24}>
                <Form.Item
                  className={classes.formField}
                  label="Номер телефону"
                  name="phoneNumber"
                  initialValue={chosenRegion?.phoneNumber}
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
                  <Input
                    value={chosenRegion?.phoneNumber}
                    className={classes.inputField}
                  />
                </Form.Item>
              </Col>

              <Col md={{ span: 11, offset: 2 }} xs={24}>
                <Form.Item
                  className={classes.formField}
                  label="Email"
                  name="email"
                  initialValue={chosenRegion?.email}
                  rules={[
                    {
                      required: true,
                      message: "Це поле має бути заповненим",
                    },
                    {
                      pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                      message: "Неправильна пошта",
                    },
                    {
                      max: 50,
                      message: "Максимальна довжина - 50 символів!",
                    },
                  ]}
                >
                  <Input
                    value={chosenRegion?.email}
                    className={classes.inputField}
                  />
                </Form.Item>
              </Col>

              <Col md={11} xs={24}>
                <Form.Item
                  className={classes.formField}
                  label="Link"
                  name="link"
                  initialValue={chosenRegion?.link}
                  rules={[
                    {
                      max: 500,
                      message: "Максимальна довжина - 500 символів!",
                    },
                  ]}
                >
                  <Input
                    value={chosenRegion?.link}
                    className={classes.inputField}
                  />
                </Form.Item>
              </Col>

              <Col md={{ span: 11, offset: 2 }} xs={24}>
                <Form.Item
                  className={classes.formField}
                  label="Місто"
                  name="city"
                  initialValue={chosenRegion?.city}
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
                  <Input
                    value={chosenRegion?.city}
                    className={classes.inputField}
                  />
                </Form.Item>
              </Col>

              <Col md={11} xs={24}>
                <Form.Item
                  className={classes.formField}
                  label="Вулиця"
                  name="street"
                  initialValue={chosenRegion?.street}
                  rules={[
                    {
                      max: 50,
                      message: "Максимальна довжина - 50 символів!",
                    },
                  ]}
                >
                  <Input
                    value={chosenRegion?.street}
                    className={classes.inputField}
                  />
                </Form.Item>
              </Col>
              <Col md={{ span: 11, offset: 2 }} xs={24}>
                <Form.Item
                  className={classes.formField}
                  label="Номер будинку"
                  name="houseNumber"
                  initialValue={chosenRegion?.houseNumber}
                  rules={[
                    {
                      max: 5,
                      message: "Максимальна довжина - 5 символів!",
                    },
                  ]}
                >
                  <Input
                    value={chosenRegion?.houseNumber}
                    className={classes.inputField}
                  />
                </Form.Item>
              </Col>
              <Col md={11} xs={24}>
                <Form.Item
                  className={classes.formField}
                  label="Номер офісу/квартири"
                  name="officeNumber"
                  initialValue={chosenRegion?.officeNumber}
                  rules={[
                    {
                      max: 5,
                      message: "Максимальна довжина - 5 символів!",
                    },
                  ]}
                >
                  <Input
                    value={chosenRegion?.officeNumber}
                    className={classes.inputField}
                  />
                </Form.Item>
              </Col>
              <Col md={{ span: 11, offset: 2 }} xs={24}>
                <Form.Item
                  className={classes.formField}
                  label="Поштовий індекс"
                  name="postIndex"
                  initialValue={chosenRegion.postIndex}
                  rules={[
                    {
                      max: 5,
                      min: 5,
                      message: "Довжина повинна бути - 5 символів!",
                    },
                    {
                      required: true,
                      message: "Це поле має бути заповненим",
                    },
                  ]}
                >
                  <Input
                    value={chosenRegion.postIndex}
                    className={classes.inputField}
                  />
                </Form.Item>
              </Col>

              <Col>
                <Form.Item style={{ textAlign: "right" }}>
                  <Button type="primary" htmlType="submit">
                    Змінити
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        )}
      </Card>
    </Layout.Content>
  );
};

export default RegionEditFormPage;
