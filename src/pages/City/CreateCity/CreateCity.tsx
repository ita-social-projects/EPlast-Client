import React, { useEffect, useRef, useState } from "react";
import { useParams, useHistory, useLocation } from "react-router-dom";
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
  Modal,
} from "antd";
import {
  DeleteOutlined,
  ExclamationCircleOutlined,
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
import { createRegionFollower, GetAllRegions, getRegionById, getRegionFollowerById, removeFollower } from "../../../api/regionsApi";
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
import RegionFollower from "../../../models/Region/RegionFollower";
import User from "../../../models/UserTable/User";
import UserApi from "../../../api/UserApi";
import TextArea from "antd/lib/input/TextArea";

const CreateCity = () => {
  const { id } = useParams();
  const history = useHistory();
  const location = useLocation();
  const followerPath = "/regions/follower/";

  const [loading, setLoading] = useState(false);
  const [appealRegion, setAppealRegion] = useState<RegionProfile>(new RegionProfile());
  const [regionFollower, setRegionFollower] = useState<RegionFollower>({} as RegionFollower);
  const [city, setCity] = useState<CityProfile>(new CityProfile());
  const [regions, setRegions] = useState<RegionProfile[]>([]);
  const [applicant, setApplicant] = useState<User>({} as User);
  const [activeUser, setActiveUser] = useState<User>({} as User);
  const [isFollowerPath, setIsFollowerPath] = useState<boolean>(location.pathname.includes(followerPath));

  useEffect (() => {
    if (isFollowerPath) {
      if (location.pathname.startsWith(followerPath + "edit")) {
        getRegionFollower(id); 
      } else {
        getActiveUser();
      }
      getRegions();
    } else {
      if (+id) {
        getCity().then(() => getRegions());
      } else {
        getRegions();
      }
    }
  }, []);

  const getBase64 = (img: Blob, callback: Function) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
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

  const handleUpload = (info: RcCustomRequestOptions) => {
    if (info !== null) {
      if (checkFile(info.file.size, info.file.name)) {
        getBase64(info.file, (base64: string) => {
          if (isFollowerPath) {
            setRegionFollower({...regionFollower, logo: base64});
          } else {
            setCity({ ...city, logo: base64 });
          }
        });
        notificationLogic("success", fileIsUpload("Фото"));
      }
    } else {
      notificationLogic("error", fileIsNotUpload("фото"));
    }
  };

  const removeLogo = (event: any) => {
    if (isFollowerPath) {
      setRegionFollower({...regionFollower, logo: undefined});
      notificationLogic("success", successfulDeleteAction("Фото"));
    } else {
      setCity({ ...city, logo: null });
      notificationLogic("success", successfulDeleteAction("Фото"));  
    }
    event.stopPropagation();
  };

  const getRegionFollower = async (followerId: number) => {
    setLoading(true);
    await getRegionFollowerById(followerId).then(async (followerResponse) =>{
      setRegionFollower(followerResponse.data);
      await UserApi.getById(followerResponse.data.userId).then((applicantResponse) => {
        setApplicant(applicantResponse.data.user);
      });
      await getRegionById(followerResponse.data.regionId).then((regionResponse) => {
        setAppealRegion(regionResponse.data); 
      });
    }).finally(() => {
      setLoading(false);
    });
  };

  const getCity = async () => {
    try{
      setLoading(true);
      let response = await getCityById(+id);

      if (response.data.logo !== null) {
        const logo = await getLogo(response.data.logo);
        response.data.logo = logo.data;
      }
  
      setCity(response.data);  
    } finally {
      setLoading(false)
    }
  };

  const getRegions = async () => {
    try{
      const response = await GetAllRegions();
      setRegions(response.data);  
    } finally {
    }
  };

  const getActiveUser = async () => {
    try{
      setLoading(true);
      const activeUserId = UserApi.getActiveUserId();
      const response = await UserApi.getById(activeUserId);
      setActiveUser(response.data.user);  
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    if (isFollowerPath) {
      const newRegionFollower: RegionFollower = {
        id: regionFollower.id,
        userId: location.pathname.startsWith(followerPath + "edit") ? applicant.id : activeUser.id,
        appeal: values.appeal,
        cityName: values.name,
        cityDescription: values.description,
        logo: regionFollower.logo?.length === 0 ? undefined : regionFollower.logo,
        regionId: values.region,
        street: values.street,
        houseNumber: values.houseNumber,
        officeNumber: values.officeNumber,
        postIndex: values.postIndex,
        cityURL: values.cityURL,
        email: values.email,
        phoneNumber: values.phoneNumber
      }; 
      
      if (!regionFollower.id) {
        seeAddFollowerModal(newRegionFollower);
      } else {
        seeConfirmFollowerModal(newRegionFollower);
      }  
    } else {
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
        CreateCity(newCity, -1);
      } else {
        EditCity(newCity);
      }  
    }
  };

  const CreateRegionFollower = async (newRegionFollower: RegionFollower) => {
    notificationLogic("info", "Створення...", <LoadingOutlined />);
    const responsePromise =  createRegionFollower(newRegionFollower);

    return responsePromise
      .then(() => {
        notificationLogic("success", successfulCreateAction("Заяву"));
        history.push(`/cities`);
      })
      .catch(() => {
        notificationLogic("error", failCreateAction("заяву"));
      });
  };

  const ConfirmRegionFollower = async (newRegionFollower: RegionFollower) => {
    const newCity: CityProfile = {
      cityURL: newRegionFollower.cityURL,
      description: newRegionFollower.cityDescription,
      email: newRegionFollower.email,
      head: city.head,
      headDeputy: city.headDeputy,
      houseNumber: newRegionFollower.houseNumber,
      id: city.id,
      logo: newRegionFollower.logo?.length === 0 ? null : newRegionFollower.logo!,
      officeNumber: newRegionFollower.officeNumber,
      name: newRegionFollower.cityName,
      phoneNumber: newRegionFollower.phoneNumber,
      postIndex: newRegionFollower.postIndex,
      region: appealRegion.regionName,
      street: newRegionFollower.street,
    }; 

    CreateCity(newCity, regionFollower.id);
  };

  const CreateCity = async (newCity: CityProfile, regionFollowerId: number) => {
    notificationLogic("info", "Створення...", <LoadingOutlined />);
    const responsePromise = createCity(JSON.stringify(newCity));
    const response = await responsePromise;
    city.id = response.data;

    return responsePromise
      .then(() => {
        if(location.pathname.startsWith(followerPath + "edit")){
          notificationLogic("success", successfulCreateAction("Станицю"));
          removeFollower(regionFollowerId);
          history.push(`/cities/${city.id}`);      
        } else {
          notificationLogic("success", successfulCreateAction("Станицю"));
          history.push(`${city.id}`);  
        }
      })
      .catch(() => {
        notificationLogic("error", failCreateAction("станицю"));
      });
  };

  const EditCity = async (newCity: CityProfile) => {
    
    return updateCity(city.id, JSON.stringify(newCity))
      .then(() => {
        notificationLogic("success", successfulUpdateAction("Станицю"));
        history.goBack();
      })
      .catch(() => {
        notificationLogic("error", failUpdateAction("станицю"));
      });
  };

  function seeAddFollowerModal(newRegionFollower: RegionFollower) {
    return Modal.confirm({
      title: `Ви впевнені, що хочете надіслати заявку на створення станиці ${newRegionFollower.cityName}?`,
      icon: <ExclamationCircleOutlined />,
      okText: "Так, надіслати!",
      okType: "danger",
      cancelText: "Скасувати",
      maskClosable: true,
      onOk() {
        {
          CreateRegionFollower(newRegionFollower);
        }
      },
    });
  }

  function seeDeleteFollowerModal() {
    return Modal.confirm({
      title: "Ви впевнені, що хочете відхилити заяву?",
      icon: <ExclamationCircleOutlined />,
      okText: "Так, відхилити",
      okType: "danger",
      cancelText: "Скасувати",
      maskClosable: true,
      onOk() {
        {
          removeFollower(regionFollower.id);
          notificationLogic("success", successfulDeleteAction("Заяву"));
          history.push(`/regions/followers/${regionFollower.regionId}`);
        }
      },
    });
  }

  function seeConfirmFollowerModal(regionFollower: RegionFollower) {
    return Modal.confirm({
      title: `Ви впевнені, що хочете підтвердити заявку на створення станиці ${regionFollower.cityName}?`,
      icon: <ExclamationCircleOutlined />,
      okText: "Так, підтвердити!",
      okType: "danger",
      cancelText: "Скасувати",
      maskClosable: true,
      onOk() {
        {
          ConfirmRegionFollower(regionFollower);
        }
      },
    });
  }

  return loading ? (
    <Spinner />
  ) : (
    <Layout.Content className="createCity">
      <Card hoverable className="createCityCard">
        {isFollowerPath ? (
          <Title level={2}>Заява на створення станиці</Title>
        ) : city.id ? (
          <Title level={2}>Редагування станиці</Title>
        ) : (
          <Title level={2}>Створення станиці</Title>
        )}
        <Form onFinish={handleSubmit}>
          <Form.Item name="logo" initialValue={isFollowerPath ? regionFollower.logo : city.logo}>
          <Upload
              name="avatar"
              listType="picture-card"
              showUploadList={false}
              accept=".jpeg,.jpg,.png"
              customRequest={handleUpload}
            >
              {isFollowerPath ? (
                regionFollower.logo?.length! > 0 ? (
                  <DeleteOutlined onClick={removeLogo} />
                ) : (
                <PlusOutlined />
                )
              ) : city.logo?.length! > 0 ? (
                <DeleteOutlined onClick={removeLogo} />
              ) : (
                <PlusOutlined />
              )}
              <img
                src={isFollowerPath ? (regionFollower?.logo ? regionFollower.logo : CityDefaultLogo)
                : city?.logo ? city.logo : CityDefaultLogo}
                alt="City"
                className="cityLogo"
              />
            </Upload>
          </Form.Item>
          <Row justify="center">
            {isFollowerPath ? (
              <Col md={{ span: 11, offset: 2 }} xs={24}>
                <Form.Item
                  name="applicant"
                  label="Заявник"
                  labelCol={{ span: 24 }}
                  initialValue={location.pathname.startsWith(followerPath + "edit") ? (
                    applicant.firstName + " " + applicant.lastName) : (
                    activeUser.firstName + " " + activeUser.lastName
                    )}
                  rules={[{ required: true, message: emptyInput("заявник") }]}
                >
                  <Input readOnly value={location.pathname.startsWith(followerPath + "edit") ? (
                    applicant.firstName + " " + applicant.lastName) : (
                      activeUser.firstName + " " + activeUser.lastName
                    )} maxLength={51} 
                    onClick={() => location.pathname.startsWith(followerPath + "edit") ? (
                      history.push(`/userpage/main/${applicant.id}`)) : undefined}
                  />
                </Form.Item>
              </Col>) 
            : null
            }
            {isFollowerPath ? (
              <Col md={{ span: 11, offset: 2 }} xs={24}>
                <Form.Item
                  name="appeal"
                  label="Заява"
                  labelCol={{ span: 24 }}
                  initialValue={regionFollower.appeal}
                  rules={[{ required: true, message: emptyInput("заява") }]}
                >
                  <Input value={regionFollower.appeal} maxLength={1001} />
                </Form.Item>
              </Col>
              ) : null
            }
            <Col md={11} xs={24}>
              <Form.Item
                name="name"
                label="Назва"
                labelCol={{ span: 24 }}
                initialValue={isFollowerPath ? regionFollower.cityName : city.name}
                rules={descriptionValidation.Name}
              >
                <Input value={isFollowerPath ? regionFollower.cityName : city.name} maxLength={51} />
              </Form.Item>
            </Col>
            <Col md={{ span: 11, offset: 2 }} xs={24}>
              <Form.Item
                name="description"
                label="Опис"
                labelCol={{ span: 24 }}
                initialValue={isFollowerPath ? regionFollower.cityDescription : city.description}
                rules={[descriptionValidation.Description]}
              >
                <Input value={isFollowerPath ? regionFollower.cityDescription : city.description} maxLength={1001} />
              </Form.Item>
            </Col>
            <Col md={11} xs={24}>
              <Form.Item
                name="cityURL"
                label="Посилання"
                labelCol={{ span: 24 }}
                initialValue={isFollowerPath ? regionFollower.cityURL : city.cityURL}
                rules={[descriptionValidation.Link]}
              >
                <Input value={isFollowerPath ? regionFollower.cityURL : city.cityURL} maxLength={257} />
              </Form.Item>
            </Col>
            <Col md={{ span: 11, offset: 2 }} xs={24}>
              <Form.Item
                name="phoneNumber"
                label="Номер телефону"
                labelCol={{ span: 24 }}
                initialValue={isFollowerPath ? regionFollower.phoneNumber : city.phoneNumber}
                rules={[descriptionValidation.Phone]}
              >
                <ReactInputMask
                  mask="+380(99)-999-99-99"
                  maskChar={null}
                  value={isFollowerPath ? regionFollower.phoneNumber : city.phoneNumber}
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
                initialValue={isFollowerPath ? regionFollower.email : city.email}
                rules={descriptionValidation.Email}
              >
                <Input value={isFollowerPath ? regionFollower.email : city.email} maxLength={51} />
              </Form.Item>
            </Col>
            <Col md={{ span: 11, offset: 2 }} xs={24}>
              <Form.Item
                name="region"
                label="Округа"
                labelCol={{ span: 24 }}
                initialValue={isFollowerPath ? appealRegion.regionName : city.region}
                rules={[{ required: true, message: emptyInput("округа") }]}
              >
                <Select
                  showSearch
                  optionFilterProp="children"
                >
                  {regions.map((item: RegionProfile) => (
                    <Select.Option key={item.id} value={isFollowerPath ? item.id : item.regionName}>
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
                initialValue={isFollowerPath ? regionFollower.street : city.street}
                rules={descriptionValidation.Street}
              >
                <Input value={isFollowerPath ? regionFollower.street : city.street} maxLength={51} />
              </Form.Item>
            </Col>
            <Col md={{ span: 11, offset: 2 }} xs={24}>
              <Form.Item
                name="houseNumber"
                label="Номер будинку"
                labelCol={{ span: 24 }}
                initialValue={isFollowerPath ? regionFollower.houseNumber : city.houseNumber}
                rules={descriptionValidation.houseNumber}
              >
                <Input value={isFollowerPath ? regionFollower.houseNumber : city.houseNumber} maxLength={6} />
              </Form.Item>
            </Col>
            <Col md={11} xs={24}>
              <Form.Item
                name="officeNumber"
                label="Номер офісу/квартири"
                labelCol={{ span: 24 }}
                initialValue={isFollowerPath ? regionFollower.officeNumber : city.officeNumber}
                rules={descriptionValidation.officeNumber}
              >
                <Input value={isFollowerPath ? regionFollower.officeNumber : city.officeNumber} maxLength={6} />
              </Form.Item>
            </Col>
            <Col md={{ span: 11, offset: 2 }} xs={24}>
              <Form.Item
                name="postIndex"
                label="Поштовий індекс"
                labelCol={{ span: 24 }}
                initialValue={isFollowerPath ? regionFollower.postIndex : city.postIndex}
                rules={descriptionValidation.postIndex}
              >
                <Input type="number" value={isFollowerPath ? regionFollower.postIndex : city.postIndex} />
              </Form.Item>
            </Col>
          </Row>
          <Row className="cityButtons" justify="center" gutter={[0, 6]}>
            <Col xs={24} sm={12}>
              {location.pathname.startsWith(followerPath + "edit") ? (                
                <Button
                  type="primary"
                  className="backButton"
                  onClick={() => seeDeleteFollowerModal()}
                >
                  Відхилити
                </Button>) : (
                <Button
                  type="primary"
                  className="backButton"
                  onClick={() => history.goBack()}
                >
                  Назад
                </Button>
              )}
            </Col>
            <Col xs={24} sm={12}>
              {location.pathname.startsWith(followerPath + "edit") ? (
                <Button htmlType="submit" type="primary">
                  Підтвердити
                </Button>
              ) : location.pathname.startsWith(followerPath + "new") ? (
                <Button htmlType="submit" type="primary">
                  Надіслати
                </Button>
              ) : (
                <Button htmlType="submit" type="primary">
                  Створити
                </Button>
              )}
            </Col>
          </Row>
        </Form>
      </Card>
    </Layout.Content>
  );
};

export default CreateCity;
