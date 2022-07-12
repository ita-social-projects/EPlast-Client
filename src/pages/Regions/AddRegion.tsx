import {
  Form,
  Input,
  Button,
  Layout,
  Card,
  Upload,
  Col,
  Row,
  Modal,
  Select,
} from "antd";
import React, { useState } from "react";
import "./CreateRegion.less";
import { RcCustomRequestOptions } from "antd/es/upload/interface";
import {
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import ReactInputMask from "react-input-mask";
import Title from "antd/lib/typography/Title";
import notificationLogic from "../../components/Notifications/Notification";
import CityDefaultLogo from "../../assets/images/default_city_image.jpg";
import {
  descriptionValidation,
  getOnlyNums,
} from "../../models/GllobalValidations/DescriptionValidation";
import {
  fileIsUpload,
  fileIsNotUpload,
  possibleFileExtensions,
  fileIsTooBig,
  successfulDeleteAction,
  successfulCreateAction,
  failCreateAction,
  emptyInput,
} from "../../components/Notifications/Messages";
import { createRegion } from "../../api/regionsApi";
import Spinner from "../Spinner/Spinner";
import RegionProfile from "../../models/Region/RegionProfile";
import { OblastsWithoutNotSpecified } from "../../models/Oblast/OblastsRecord";

const classes = require("../Club/Club/Modal.module.css");

const AddNewRegionFormPage = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const history = useHistory();
  const [loadingButton, setLoadingButton] = useState(false);
  const [logo, setLogo] = useState<any>();
  const [currentPhoto, setCurrentPhoto] = useState(false);

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const newRegion: RegionProfile = {
        id: 0,
        regionName: values.regionName,
        description: values.description,
        phoneNumber: values.phoneNumber,
        email: values.email,
        link: values.link === "" ? null : values.link,
        logo,
        oblast: values.oblast,
        street: values.street,
        houseNumber: values.houseNumber,
        officeNumber: values.officeNumber,
        postIndex: values.postIndex,
        city: values.city,
        isActive: true,
      };
      await createRegion(newRegion);
      form.resetFields();
      notificationLogic("success", successfulCreateAction("Округу"));
      history.push("/regions/page/1");
    } catch (error) {
      notificationLogic("error", failCreateAction("округу"));
    }
  };

  const checkFile = (size: number, fileName: string) => {
    const extension = fileName.split(".").reverse()[0].toLowerCase();
    const isCorrectExtension =
      extension.indexOf("jpeg") !== -1 ||
      extension.indexOf("jpg") !== -1 ||
      extension.indexOf("png") !== -1;
    if (!isCorrectExtension) {
      notificationLogic("error", possibleFileExtensions("png, jpg, jpeg"));
    }

    const isSmaller2mb = size <= 3145728;
    if (!isSmaller2mb) {
      notificationLogic("error", fileIsTooBig(3));
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
        notificationLogic("success", fileIsUpload("Фото"));
        setCurrentPhoto(true);
      }
    } else {
      notificationLogic("error", fileIsNotUpload("фото"));
    }
  };

  const sureConfirm = () => {
    Modal.confirm({
      title: "Ваші дані будуть не збережені.",
      content: (
        <div className={classes.Style}>
          <b>Відмінити створення округи ?</b>{" "}
        </div>
      ),
      onCancel() { },
      onOk() {
        history.goBack();
      },
    });
  };

  const removePhoto = (event: any) => {
    setLogo(CityDefaultLogo);
    notificationLogic("success", successfulDeleteAction("Фото"));
    event.stopPropagation();
    setCurrentPhoto(false);
  };

  return (
    <Layout.Content className="createCity">
      <Card hoverable className="createCityCard">
        <Title level={2}>Створення округи</Title>
        {loading ? (
          <Spinner />
        ) : (
          <Form
            name="basic"
            onFinish={(values) => {
              handleSubmit(values);
              setLoadingButton(true);
            }}
            form={form}
          >
              <Row justify="center">
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
                      src={logo ?? CityDefaultLogo}
                      alt="Region"
                      className="cityLogo"
                    />
                  </Upload>
                </Form.Item>
              </Row>

              <Row justify="center" gutter={2}>
                <Col md={12} xs={24}>
                <Form.Item
                  label="Назва"
                  name="regionName"
                  labelCol={{ span: 24 }}
                  rules={descriptionValidation.RegionName}
                >
                  <Input maxLength={51} />
                </Form.Item>
                </Col>

                <Col md={12} xs={24}>
                <Form.Item
                  name="phoneNumber"
                  label="Номер телефону"
                  labelCol={{ span: 24 }}
                  rules={[
                    descriptionValidation.Phone,
                    descriptionValidation.Required,
                  ]}
                >
                  <ReactInputMask mask="+380(99)-999-99-99" maskChar={null}>
                    {(inputProps: any) => <Input {...inputProps} />}
                  </ReactInputMask>
                </Form.Item>
              </Col>

                <Col md={12} xs={24}>
                <Form.Item
                  label="Електронна пошта"
                  name="email"
                  labelCol={{ span: 24 }}
                  rules={descriptionValidation.Email}
                >
                  <Input maxLength={51} />
                </Form.Item>
              </Col>

                <Col md={12} xs={24}>
                <Form.Item
                  label="Посилання"
                  name="link"
                  labelCol={{ span: 24 }}
                  rules={descriptionValidation.Link}
                >
                  <Input maxLength={257} />
                </Form.Item>
              </Col>

                <Col md={12} xs={24}>
                  <Form.Item
                    name="oblast"
                    rules={[
                      { required: true, message: emptyInput() }
                    ]}
                    label="Область"
                    labelCol={{ span: 24 }}
                  >
                    <Select
                      aria-autocomplete="none"
                      placeholder="Оберіть область"
                    >
                      {OblastsWithoutNotSpecified.map(([key, value]) =>
                        <Select.Option key={key} value={key}>
                          {value}
                        </Select.Option>
                      )}
                    </Select>
                  </Form.Item>
                </Col>

                <Col md={12} xs={24}>
                <Form.Item
                  label="Місто"
                  name="city"
                  labelCol={{ span: 24 }}
                  rules={descriptionValidation.CityName}
                >
                  <Input maxLength={51} />
                </Form.Item>
              </Col>

                <Col md={12} xs={24}>
                <Form.Item
                  labelCol={{ span: 24 }}
                  label="Вулиця"
                  name="street"
                  rules={descriptionValidation.Street}
                >
                  <Input maxLength={51} />
                </Form.Item>
              </Col>

                <Col md={12} xs={24}>
                <Form.Item
                  labelCol={{ span: 24 }}
                  label="Номер будинку"
                  name="houseNumber"
                  rules={descriptionValidation.houseNumber}
                >
                  <Input maxLength={6} />
                </Form.Item>
              </Col>

                <Col md={12} xs={24}>
                <Form.Item
                  labelCol={{ span: 24 }}
                  label="Номер офісу/квартири"
                  name="officeNumber"
                  rules={descriptionValidation.officeNumber}
                >
                  <Input maxLength={6} />
                </Form.Item>
              </Col>

                <Col md={12} xs={24}>
                <Form.Item
                  labelCol={{ span: 24 }}
                  label="Поштовий індекс"
                  name="postIndex"
                  rules={descriptionValidation.postIndex}
                >
                  <Input
                    onChange={(e) => {
                      form.setFieldsValue({
                        postIndex: getOnlyNums(e.target.value),
                      });
                    }}
                    autoComplete="off"
                    maxLength={5}
                  />
                </Form.Item>
              </Col>

                <Col xs={24}>
                  <Form.Item
                    label="Опис"
                    name="description"
                    labelCol={{ span: 24 }}
                    rules={descriptionValidation.DescriptionNotOnlyWhiteSpaces}
                  >
                    <Input.TextArea rows={3} maxLength={1001} />
                  </Form.Item>
                </Col>
            </Row>

            <Row className="cityButtons" justify="center" gutter={[0, 6]}>
              <Col xs={24} sm={12}>
                <Button
                  type="primary"
                  className="backButton"
                  onClick={() => sureConfirm()}
                >
                  Назад
                </Button>
              </Col>
              <Col xs={24} sm={12}>
                <Button
                  htmlType="submit"
                  loading={loadingButton}
                  type="primary"
                >
                  Підтвердити
                </Button>
              </Col>
            </Row>
          </Form>
        )}
      </Card>
    </Layout.Content>
  );
};

export default AddNewRegionFormPage;
