import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import {
  Button,
  Form,
  Input,
  Layout,
  Upload,
  Row,
  Col,
  Select,
  Card,
} from "antd";
import {
  DeleteOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons/lib";
import ReactInputMask from "react-input-mask";
import { RcCustomRequestOptions } from "antd/lib/upload/interface";
import CityDefaultLogo from "../../../assets/images/default_city_image.jpg";
import {
  createCity,
  getCityById,
  getLogo,
  updateCity,
} from "../../../api/citiesApi";
import { GetAllRegions } from "../../../api/regionsApi";
import "./CreateCity.less";
import CityProfile from "../../../models/City/CityProfile";
import RegionProfile from "../../../models/Region/RegionProfile";
import notificationLogic from "../../../components/Notifications/Notification";
import Title from "antd/lib/typography/Title";
import Spinner from "../../Spinner/Spinner";
import{
  emptyInput,
  fileIsUpload,
  fileIsNotUpload, 
  possibleFileExtensions, 
  fileIsTooBig, 
  successfulDeleteAction, 
  successfulCreateAction, 
  successfulUpdateAction, 
  failCreateAction,
  failUpdateAction,
} from "../../../components/Notifications/Messages"
import { descriptionValidation } from "../../../models/GllobalValidations/DescriptionValidation";


const CreateCity = () => {
  const { id } = useParams();
  const history = useHistory();

  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState<CityProfile>(new CityProfile());
  const [regions, setRegions] = useState<RegionProfile[]>([]);

  const getBase64 = (img: Blob, callback: Function) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const checkFile = (size: number, fileName: string) => {
    const extension = fileName.split(".").reverse()[0];
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

  const handleUpload = (info: RcCustomRequestOptions) => {
    if (info !== null) {
      if (checkFile(info.file.size, info.file.name)) {
        getBase64(info.file, (base64: string) => {
          setCity({ ...city, logo: base64 });
        });
        notificationLogic("success", fileIsUpload("Фото"));
      }
    } else {
      notificationLogic("error", fileIsNotUpload("фото"));
    }
  };

  const removeLogo = (event: any) => {
    setCity({ ...city, logo: null });
    notificationLogic("success", successfulDeleteAction("Фото"));
    event.stopPropagation();
  };

  const getCity = async () => {
    try {
      setLoading(true);
      let response = await getCityById(+id);

      if (response.data.logo !== null) {
        const logo = await getLogo(response.data.logo);
        response.data.logo = logo.data;
      }

      setCity(response.data);
    } finally {
      setLoading(false);
    }
  };

  const getRegions = async () => {
    try {
      setLoading(true);
      const response = await GetAllRegions();
      setRegions(response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (+id) {
      getCity().then(() => getRegions());
    } else {
      getRegions();
    }
  }, [id]);

  const handleSubmit = async (values: any) => {
    const newCity: CityProfile = {
      cityURL: values.cityURL,
      description: values.description,
      email: values.email,
      head: city.head,
      headDeputy: city.headDeputy,
      houseNumber: values.houseNumber,
      id: city.id,
      logo: city.logo?.length === 0 ? null : city.logo,
      officeNumber: values.officeNumber,
      name: values.name,
      phoneNumber: values.phoneNumber,
      postIndex: values.postIndex,
      region: values.region,
      street: values.street,
    };

    if (!city.id) {
      CreateCity(newCity);
    } else {
      EditCity(newCity);
    }
  };

  const CreateCity = async (newCity: CityProfile) => {
    notificationLogic("info", "Створення...", <LoadingOutlined />);
    const responsePromise = createCity(JSON.stringify(newCity));
    const response = await responsePromise;
    city.id = response.data;

    return responsePromise
      .then(() => {
        notificationLogic("success", successfulCreateAction("Станицю"));
        history.push(`${city.id}`);
      })
      .catch(() => {
        notificationLogic("error", failCreateAction("станицю"));
      });
  };

  const EditCity = async (newCity: CityProfile) => {
    notificationLogic("info", "Оновлення...", <LoadingOutlined />);

    return updateCity(city.id, JSON.stringify(newCity))
      .then(() => {
        notificationLogic("success", successfulUpdateAction("Станицю"));
        history.goBack();
      })
      .catch(() => {
        notificationLogic("error", failUpdateAction("станицю"));
      });
  };

  return loading && city ? (
    <Spinner />
  ) : (
    <Layout.Content className="createCity">
      <Card hoverable className="createCityCard">
        {city.id ? (
          <Title level={2}>Редагування станиці</Title>
        ) : (
          <Title level={2}>Створення станиці</Title>
        )}
        <Form onFinish={handleSubmit}>
          <Form.Item name="logo" initialValue={city.logo}>
          <Upload
              name="avatar"
              listType="picture-card"
              showUploadList={false}
              accept=".jpeg,.jpg,.png"
              customRequest={handleUpload}
            >
              {city.logo?.length! > 0 ? (
                <DeleteOutlined onClick={removeLogo} />
              ) : (
                <PlusOutlined />
              )}
              <img
                src={city?.logo ? city.logo : CityDefaultLogo}
                alt="City"
                className="cityLogo"
              />
            </Upload>
          </Form.Item>
          <Row justify="center">
            <Col md={11} xs={24}>
              <Form.Item
                name="name"
                label="Назва"
                labelCol={{ span: 24 }}
                initialValue={city.name}
                rules={descriptionValidation.Name}
              >
                <Input value={city.name} maxLength={51} />
              </Form.Item>
            </Col>
            <Col md={{ span: 11, offset: 2 }} xs={24}>
              <Form.Item
                name="description"
                label="Опис"
                labelCol={{ span: 24 }}
                initialValue={city.description}
                rules={[descriptionValidation.Description]}
              >
                <Input value={city.description} maxLength={1001} />
              </Form.Item>
            </Col>
            <Col md={11} xs={24}>
              <Form.Item
                name="cityURL"
                label="Посилання"
                labelCol={{ span: 24 }}
                initialValue={city.cityURL}
                rules={[descriptionValidation.Link]}
              >
                <Input value={city.cityURL} maxLength={257} />
              </Form.Item>
            </Col>
            <Col md={{ span: 11, offset: 2 }} xs={24}>
              <Form.Item
                name="phoneNumber"
                label="Номер телефону"
                labelCol={{ span: 24 }}
                initialValue={city.phoneNumber}
                rules={[descriptionValidation.Phone]}
              >
                <ReactInputMask
                  mask="+380(99)-999-99-99"
                  maskChar={null}
                  value={city.phoneNumber}
                >
                  {(inputProps: any) => <Input {...inputProps} />}
                </ReactInputMask>
              </Form.Item>
            </Col>
            <Col md={11} xs={24}>
              <Form.Item
                name="email"
                label="Електронна пошта"
                labelCol={{ span: 24 }}
                initialValue={city.email}
                rules={descriptionValidation.Email}
              >
                <Input value={city.email} maxLength={51} />
              </Form.Item>
            </Col>
            <Col md={{ span: 11, offset: 2 }} xs={24}>
              <Form.Item
                name="region"
                label="Округа"
                labelCol={{ span: 24 }}
                initialValue={city.region}
                rules={[{ required: true, message: emptyInput("округа") }]}
              >
                <Select
                  showSearch
                  optionFilterProp="children"
                >
                  {regions.map((item: RegionProfile) => (
                    <Select.Option key={item.id} value={item.regionName}>
                      {item.regionName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col md={11} xs={24}>
              <Form.Item
                name="street"
                label="Вулиця"
                labelCol={{ span: 24 }}
                initialValue={city.street}
                rules={descriptionValidation.Street}
              >
                <Input value={city.street} maxLength={51} />
              </Form.Item>
            </Col>
            <Col md={{ span: 11, offset: 2 }} xs={24}>
              <Form.Item
                name="houseNumber"
                label="Номер будинку"
                labelCol={{ span: 24 }}
                initialValue={city.houseNumber}
                rules={descriptionValidation.houseNumber}
              >
                <Input value={city.houseNumber} maxLength={6} />
              </Form.Item>
            </Col>
            <Col md={11} xs={24}>
              <Form.Item
                name="officeNumber"
                label="Номер офісу/квартири"
                labelCol={{ span: 24 }}
                initialValue={city.officeNumber}
                rules={descriptionValidation.officeNumber}
              >
                <Input value={city.officeNumber} maxLength={6} />
              </Form.Item>
            </Col>
            <Col md={{ span: 11, offset: 2 }} xs={24}>
              <Form.Item
                name="postIndex"
                label="Поштовий індекс"
                labelCol={{ span: 24 }}
                initialValue={city.postIndex}
                rules={descriptionValidation.postIndex}
              >
                <Input type="number" value={city.postIndex} />
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
      </Card>
    </Layout.Content>
  );
};

export default CreateCity;
