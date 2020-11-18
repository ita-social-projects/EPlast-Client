import {
  Form,
  Input,
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
import ReactInputMask from "react-input-mask";
import Title from "antd/lib/typography/Title";

const AddNewRegionFormPage = () => {
  const [form] = Form.useForm();
  const history = useHistory();

  const [logo, setLogo] = useState<any>();
  const [currentPhoto, setCurrentPhoto] = useState(false);

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
        setCurrentPhoto(true);
      }
    } else {
      notificationLogic("error", "Проблема з завантаженням фото");
    }
  };

  const removePhoto = (event: any) => {
    setLogo(CityDefaultLogo);
    notificationLogic("success", "Фото видалено");
    event.stopPropagation();
    setCurrentPhoto(false);
  };

  return (
    <Layout.Content className="createCity">
      <Card hoverable className="createCityCard">
        <Title level={2}>Створення округу</Title>
        <Form name="basic" onFinish={handleSubmit} form={form}>
          <Form.Item name="logo">
            <Upload
              name="avatar"
              listType="picture-card"
              showUploadList={false}
              accept=".jpeg,.jpg,.png"
              customRequest={handleUpload}
            >
              {currentPhoto ? (
                <DeleteOutlined onClick={removePhoto} />
              ) : (
                <PlusOutlined />
              )}
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
                label="Назва округу"
                name="regionName"
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: "Це поле є обов'язковим",
                  },
                  {
                    max: 50,
                    message: "Максимальна довжина - 50 символів!",
                  },
                ]}
              >
                <Input maxLength={51} />
              </Form.Item>
            </Col>
            <Col md={{ span: 11, offset: 2 }} xs={24}>
              <Form.Item
                label="Опис"
                name="description"
                labelCol={{ span: 24 }}
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
                <Input maxLength={251} />
              </Form.Item>
            </Col>

            <Col md={11} xs={24}>
            <Form.Item
                name="phoneNumber"
                label="Номер телефону"
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: "Це поле має бути заповненим",
                  },
                  {
                    pattern: /^((\+?3)?8)?((0\(\d{2}\)?)|(\(0\d{2}\))|(0\d{2}))-\d{3}-\d{2}-\d{2}$/,
                    message: "Невірно вказаний номер",
                  },
                ]}
              >
                <ReactInputMask
                  mask="+380(99)-999-99-99"
                  maskChar={null}
                >
                  {(inputProps: any) => <Input {...inputProps} />}
                </ReactInputMask>
              </Form.Item>
            </Col>

            <Col md={{ span: 11, offset: 2 }} xs={24}>
              <Form.Item
                label="Електронна пошта"
                name="email"
                labelCol={{ span: 24 }}
                rules={[
                  {
                    pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/,
                    message: "Неправильний формат електронної пошти!",
                  },
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
                <Input maxLength={51}/>
              </Form.Item>
            </Col>

            <Col md={11} xs={24}>
              <Form.Item
                label="Посилання"
                name="link"
                labelCol={{ span: 24 }}
                rules={[
                  {
                    max: 256,
                    message: "Максимальна довжина - 256 символів!",
                  },
                ]}
              >
                <Input maxLength={257} />
              </Form.Item>
            </Col>

            <Col md={{ span: 11, offset: 2 }} xs={24}>
              <Form.Item
                label="Місто"
                name="city"
                labelCol={{ span: 24 }}
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
                <Input maxLength={51} />
              </Form.Item>
            </Col>

            <Col md={11} xs={24}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Вулиця"
                name="street"
                rules={[
                  { required: true, message: "Це поле є обов'язковим" },
                  {
                    max: 50,
                    message: "Максимальна довжина - 50 символів!",
                  },
                ]}
              >
                <Input  maxLength={51} />
              </Form.Item>
            </Col>

            <Col md={{ span: 11, offset: 2 }} xs={24}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Номер будинку"
                name="houseNumber"
                rules={[
                  { required: true, message: "Це поле є обов'язковим" },
                  {
                    max: 5,
                    message: "Максимальна довжина - 5 символів!",
                  },
                ]}
              >
                <Input maxLength={6} />
              </Form.Item>
            </Col>

            <Col md={11} xs={24}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Номер офісу/квартири"
                name="officeNumber"
                rules={[
                  {
                    max: 5,
                    message: "Максимальна довжина - 5 символів!",
                  },
                ]}
              >
                <Input maxLength={6} />
              </Form.Item>
            </Col>

            <Col md={{ span: 11, offset: 2 }} xs={24}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Поштовий індекс"
                name="postIndex"
                rules={[
                  {
                    validator: (_, value) => 
                    String(value).length == 5
                        ? Promise.resolve()
                        : Promise.reject(
                            `Довжина поштового індексу - 5 символів!`
                          )
                  },
                  {
                    validator: (_, value) =>
                      parseInt(value) >= 0 ||
                      value == null ||
                      String(value).length == 0
                        ? Promise.resolve()
                        : Promise.reject(
                            `Поле не може бути від'ємним`
                          ),
                  },
                ]}
              >
                <Input type="number"/>
              </Form.Item>
            </Col>
          </Row>

          <Row className="cityButtons" justify="center" gutter={[0, 6]}>
            <Col xs={24} sm={12}>
              <Button
                type="primary"
                className="backButton"
                onClick={() => history.goBack()}
              >
                Назад
              </Button>
            </Col>
            <Col xs={24} sm={12}>
              <Button htmlType="submit" type="primary">
                Підтвердити
              </Button>
            </Col>
          </Row>
        </Form>
        ;
      </Card>
    </Layout.Content>
  );
};

export default AddNewRegionFormPage;
