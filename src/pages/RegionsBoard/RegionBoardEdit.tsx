import { Form, Input, Button, Layout, Card, Upload, Row, Col } from "antd";
import React, { useState, useEffect } from "react";
import RegionsApi from "../../api/regionsApi";
import ReactInputMask from "react-input-mask";
import "../Regions/CreateRegion.less";
import notificationLogic from "../../components/Notifications/Notification";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import CityDefaultLogo from "../../assets/images/default_city_image.jpg";
import { RcCustomRequestOptions } from "antd/es/upload/interface";
import { useHistory } from "react-router-dom";
import Spinner from "../Spinner/Spinner";
import Title from "antd/lib/typography/Title";
import RegionBoardProfile from "../../models/RegionBoard/RegionBoardProfile";
import { descriptionValidation } from "../../models/GllobalValidations/DescriptionValidation";
import {
  fileIsUpload,
  fileIsNotUpload,
  possibleFileExtensions,
  fileIsTooBig,
  successfulEditAction,
} from "../../components/Notifications/Messages";

const RegionBoardEditFormPage = () => {
  const [form] = Form.useForm();
  const history = useHistory();
  const [loading, setLoading] = useState<boolean>(true);
  const [logo, setLogo] = useState<any>();

  const [chosenRegion, setChosenRegion] = useState<RegionBoardProfile>(
    new RegionBoardProfile()
  );

  useEffect(() => {
    getRegion();
  }, []);

  const getRegion = async () => {
    try {
      const response = await RegionsApi.GetRegionsBoard();
      setChosenRegion(response.data);
      setLogo(response.data.logo);
    } finally {
      setLoading(false);
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
      }
    } else {
      notificationLogic("error", fileIsNotUpload("фото"));
    }
  };

  const removeLogo = (event: any) => {
    setLogo(null);
    notificationLogic("success", "Фото видалено");
    event.stopPropagation();
  };

  const handleSubmit = async (values: any) => {
    const newRegion: any = {
      regionName: values.regionName,
      description: values.description,
      phoneNumber: values.phoneNumber,
      email: values.email,
      link: chosenRegion.link,
      street: chosenRegion.street,
      houseNumber: chosenRegion.houseNumber,
      officeNumber: chosenRegion.officeNumber,
      postIndex: chosenRegion.postIndex,
      logo: logo,
      city: chosenRegion.city,
    };
    await RegionsApi.EditRegion(chosenRegion.id, newRegion);

    form.resetFields();

    notificationLogic(
      "success",
      successfulEditAction("Дані Крайового проводу")
    );
    history.push(`/regionsBoard`);
  };

  return (
    <Layout.Content className="createCity">
      <Card hoverable className="createCityCard">
        {loading === true ? (
          <Spinner />
        ) : (
          <Form name="basic" onFinish={handleSubmit} form={form}>
            <Title level={2}>Редагування Крайового Проводу Пласту</Title>
            <Form.Item name="logo" initialValue={chosenRegion.logo}>
              <Upload
                name="avatar"
                listType="picture-card"
                showUploadList={false}
                accept=".jpeg,.jpg,.png"
                customRequest={handleUpload}
              >
                {logo?.length! > 0 ? (
                  <DeleteOutlined onClick={removeLogo} />
                ) : (
                  <PlusOutlined />
                )}
                <img
                  src={logo ? logo : CityDefaultLogo}
                  alt="RegionsBoard"
                  className="cityLogo"
                />
              </Upload>
            </Form.Item>

            <Row justify="center">
              <Col md={11} xs={24}>
                <Form.Item
                  label="Назва"
                  name="regionName"
                  initialValue={chosenRegion.regionName}
                  labelCol={{ span: 24 }}
                  rules={descriptionValidation.Name}
                >
                  <Input
                    disabled
                    value={chosenRegion.regionName}
                    maxLength={51}
                  />
                </Form.Item>
              </Col>
              <Col md={{ span: 11, offset: 2 }} xs={24}>
                <Form.Item
                  label="Опис"
                  name="description"
                  initialValue={chosenRegion?.description}
                  labelCol={{ span: 24 }}
                  rules={descriptionValidation.Description}
                >
                  <Input value={chosenRegion?.description} maxLength={1001} />
                </Form.Item>
              </Col>

              <Col md={11} xs={24}>
                <Form.Item
                  name="phoneNumber"
                  label="Номер телефону"
                  labelCol={{ span: 24 }}
                  initialValue={chosenRegion?.phoneNumber}
                  rules={[descriptionValidation.Phone]}
                >
                  <ReactInputMask
                    mask="+380(99)-999-99-99"
                    maskChar={null}
                    value={chosenRegion?.phoneNumber}
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
                  initialValue={chosenRegion?.email}
                  rules={descriptionValidation.RegionEmail}
                >
                  <Input maxLength={51} value={chosenRegion?.email} />
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
        )}
      </Card>
    </Layout.Content>
  );
};

export default RegionBoardEditFormPage;
