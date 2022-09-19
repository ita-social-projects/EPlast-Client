import React, { useEffect, useState } from "react";
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
  PlusOutlined,
} from "@ant-design/icons/lib";
import ReactInputMask from "react-input-mask";
import { RcCustomRequestOptions } from "antd/lib/upload/interface";
import Title from "antd/lib/typography/Title";
import CityDefaultLogo from "../../../assets/images/default_city_image.jpg";
import {
  createCity,
  getCityById,
  getLogo,
  updateCity,
} from "../../../api/citiesApi";
import {
  createRegionFollower,
  getRegionAdministration,
  getRegionById,
  getRegionFollowerById,
  getRegionsNames,
  removeFollower,
} from "../../../api/regionsApi";
import "./CreateCity.less";
import CityProfile from "../../../models/City/CityProfile";
import RegionProfile from "../../../models/Region/RegionProfile";
import notificationLogic from "../../../components/Notifications/Notification";
import Spinner from "../../Spinner/Spinner";
import {
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
} from "../../../components/Notifications/Messages";
import {
  descriptionValidation,
  getOnlyNums,
} from "../../../models/GllobalValidations/DescriptionValidation";
import RegionFollower from "../../../models/Region/RegionFollower";
import User from "../../../models/UserTable/User";
import UserApi from "../../../api/UserApi";
import NotificationBoxApi from "../../../api/NotificationBoxApi";
import OblastsRecord, { OblastsWithoutNotSpecified } from "../../../models/Oblast/OblastsRecord";
import UkraineOblasts from "../../../models/Oblast/UkraineOblasts";
import TextArea from "antd/lib/input/TextArea";
import { getGoverningBodiesAdmins } from "../../../api/governingBodiesApi";
import { getSuperAdmins } from "../../../api/adminApi";
import { AdminTypes } from "../../../models/Admin/AdminTypesEnum";

const classes = require("../../Club/Club/Modal.module.css");

const CreateCity = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const history = useHistory();
  const location = useLocation();
  const followerPath = "/regions/follower/";
  const isFollowerPath = location.pathname.includes(followerPath);
  const [isDataLoaded, setDataLoaded] = useState<boolean>(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const [appealRegion, setAppealRegion] = useState<RegionProfile>(
    new RegionProfile()
  );
  const [regionFollower, setRegionFollower] = useState<RegionFollower>(
    {} as RegionFollower
  );
  const [city, setCity] = useState<CityProfile>({} as CityProfile);
  const [regions, setRegions] = useState<RegionProfile[]>([]);
  const [applicant, setApplicant] = useState<User>({} as User);
  const [activeUser, setActiveUser] = useState<User>({} as User);
  const levels = [1, 2, 3];
  const isCreating = !city.id;

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
            setRegionFollower({ ...regionFollower, logo: base64 });
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
      setRegionFollower({ ...regionFollower, logo: undefined });
      notificationLogic("success", successfulDeleteAction("Фото"));
    } else {
      setCity({ ...city, logo: null });
      notificationLogic("success", successfulDeleteAction("Фото"));
    }
    event.stopPropagation();
  };

  const getNotificationReceivers = async (regionId: number) => {
    let listOfReceivers: string[] = [];

    getGoverningBodiesAdmins()
      .then((response) => {
        let user = response.data.find((admin: any) => admin.adminTypeId === AdminTypes.GoverningBodyAdmin && admin.status === true);
        if (user) listOfReceivers.push(user.userId);
      });

    getRegionAdministration(regionId)
      .then((response) => {
        let user = response.data.find((admin: any) => admin.adminTypeId === AdminTypes.OkrugaHead && admin.status === true);
        if (user) listOfReceivers.push(user.userId);
      });

    getSuperAdmins()
      .then((response) => {
        response.data.map((user: any) => listOfReceivers.push(user.id));
      });

    return listOfReceivers;
  }

  const getRegionFollower = async (followerId: number) => {
    await getRegionFollowerById(followerId).then(async (followerResponse) => {
      setRegionFollower(followerResponse.data);
      await UserApi.getById(followerResponse.data.userId).then(
        (applicantResponse) => {
          setApplicant(applicantResponse.data.user);
        }
      );
      await getRegionById(followerResponse.data.regionId).then(
        (regionResponse) => {
          setAppealRegion(regionResponse.data);
        }
      );
    })
  };

  const getCity = async () => {
    const response = await getCityById(+id);
    if (response.data.logo !== null) {
      const logo = await getLogo(response.data.logo);
      response.data.logo = logo.data;
    }
    setCity(response.data);
  };

  const getRegions = async () => {
    const response = await getRegionsNames();
    setRegions(response.data);
  };

  const getActiveUser = async () => {
    const activeUserId = UserApi.getActiveUserId();
    const response = await UserApi.getById(activeUserId);
    setActiveUser(response.data.user);
  };

  const handleSubmit = async (values: any) => {
    if (isFollowerPath) {
      const newRegionFollower: RegionFollower = {
        id: regionFollower.id,
        userId: location.pathname.startsWith(followerPath + "edit")
          ? applicant.id
          : activeUser.id,
        appeal: values.appeal,
        cityName: values.name,
        cityDescription: values.description,
        logo:
          regionFollower.logo?.length === 0 ? undefined : regionFollower.logo,
        regionId: values.region,
        address: values.address,
        level: values.level,
        cityURL: values.cityURL === "" ? null : values.cityURL,
        email: values.email,
        phoneNumber: values.phoneNumber === "" ? null : values.phoneNumber,
        oblast: values.oblast,
      };
      if (!regionFollower.id) {
        seeAddFollowerModal(newRegionFollower);
      } else {
        seeConfirmFollowerModal(newRegionFollower);
      }
    } else {
      const newCity: CityProfile = {
        cityURL: values.cityURL === "" ? null : values.cityURL,
        description: values.description,
        email: values.email,
        head: city.head,
        headDeputy: city.headDeputy,
        id: city.id,
        logo: city.logo?.length === 0 ? null : city.logo,
        name: values.name,
        phoneNumber: values.phoneNumber === "" ? null : values.phoneNumber,
        level: values.level,
        region: values.region,
        address: values.address,
        isActive: city.isActive,
        oblast: values.oblast,
      };
      if (isCreating) {
        CreateCity(newCity, -1);
      } else {
        EditCity(newCity);
      }
    }
  };

  const CreateRegionFollower = async (newRegionFollower: RegionFollower) => {
    const responsePromise = createRegionFollower(newRegionFollower);
    return responsePromise
      .then(async (response) => {
        let peopleToReceiveNotification = await getNotificationReceivers(parseInt(newRegionFollower.regionId));
        notificationLogic("success", successfulCreateAction("Заяву"));
        await createNotification(
          newRegionFollower.userId,
          `Вітаємо, вашу заяву на створення станиці ${newRegionFollower.cityName} успішно створено! Заява очікує розгляду адміністрацією округи.`
        );
        await NotificationBoxApi.createNotifications(
          peopleToReceiveNotification,
          `На ваш розгляд чекає заява на створення станиці `,
          NotificationBoxApi.NotificationTypes.UserNotifications,
          `/regions/follower/edit/${response.data}`,
          `${newRegionFollower.cityName}.`
        )
        history.push(`/cities/page/1`);
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
      id: city.id,
      logo:
        newRegionFollower.logo?.length === 0 ? null : newRegionFollower.logo!,
      name: newRegionFollower.cityName,
      phoneNumber: newRegionFollower.phoneNumber,
      level: newRegionFollower.level,
      region: appealRegion.regionName,
      address: newRegionFollower.address,
      isActive: city.isActive,
      oblast: newRegionFollower.oblast,
    };

    CreateCity(newCity, regionFollower.id);
  };

  const CreateCity = async (newCity: CityProfile, regionFollowerId: number) => {
    const responsePromise = createCity(JSON.stringify(newCity));
    const response = await responsePromise;
    city.id = response.data;

    return responsePromise
      .then(() => {
        if (location.pathname.startsWith(followerPath + "edit")) {
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
      title: `Ви впевнені, що хочете надіслати заяву на створення станиці ${newRegionFollower.cityName}?`,
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
      title: `Ви впевнені, що хочете підтвердити заяву на створення станиці ${regionFollower.cityName}?`,
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

  const sureConfirm = () => {
    Modal.confirm({
      title: "Ваші дані будуть не збережені.",
      content: (
        <div className={classes.Style}>
          {isCreating
            ? <b>Відмінити створення станиці ?</b>
            : <b>Відмінити редагування станиці ?</b>}

        </div>
      ),
      onCancel() { },
      onOk() {
        history.goBack();
      },
    });
  };

  const createNotification = async (userId: string, message: string) => {
    await NotificationBoxApi.createNotifications(
      [userId],
      message,
      NotificationBoxApi.NotificationTypes.UserNotifications
    );
  };

  const loadData = async () => {
    try {
      if (isFollowerPath) {
        if (location.pathname.startsWith(`${followerPath}edit`)) {
          await getRegionFollower(id);
        } else {
          await getActiveUser();
        }
      } else if (+id) await getCity();

      await getRegions();
    } finally {
      setDataLoaded(true);
    }
  };

  useEffect(() => {
    if (!isDataLoaded) loadData();
  }, [isDataLoaded]);

  return !isDataLoaded ? (
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
        <Form
          form={form}
          onFinish={(values) => {
            handleSubmit(values);
            setLoadingButton(true);
          }}
        >
          <Form.Item
            name="logo"
            initialValue={isFollowerPath ? regionFollower.logo : city.logo}
          >
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
                src={
                  isFollowerPath
                    ? regionFollower?.logo
                      ? regionFollower.logo
                      : CityDefaultLogo
                    : city?.logo
                      ? city.logo
                      : CityDefaultLogo
                }
                alt="City"
                className="cityLogo"
              />
            </Upload>
          </Form.Item>
          <Row justify="center" gutter={[16, 4]}>
            {isFollowerPath ? (
              <Col md={12} xs={24}>
                <Form.Item
                  name="applicant"
                  label="Заявник"
                  labelCol={{ span: 24 }}
                  initialValue={
                    location.pathname.startsWith(followerPath + "edit")
                      ? applicant.firstName + " " + applicant.lastName
                      : activeUser.firstName + " " + activeUser.lastName
                  }
                  rules={[{ required: true, message: emptyInput("заявник") }]}
                >
                  <Input
                    style={{ cursor: "pointer" }}
                    readOnly
                    maxLength={51}
                    onClick={() =>
                      location.pathname.startsWith(followerPath + "edit")
                        ? history.push(`/userpage/main/${applicant.id}`)
                        : undefined
                    }
                  />
                </Form.Item>
              </Col>
            ) : null}
            {isFollowerPath ? (
              <Col md={12} xs={24}>
                <Form.Item
                  name="appeal"
                  label="Заява"
                  labelCol={{ span: 24 }}
                  initialValue={regionFollower.appeal}
                  rules={descriptionValidation.Appeal}
                >
                  <Input value={regionFollower.appeal} maxLength={1001} />
                </Form.Item>
              </Col>
            ) : null}
            <Col md={12} xs={24}>
              <Form.Item
                name="name"
                label="Назва"
                labelCol={{ span: 24 }}
                initialValue={
                  isFollowerPath ? regionFollower.cityName : city.name
                }
                rules={descriptionValidation.CityName}
              >
                <Input
                  value={isFollowerPath ? regionFollower.cityName : city.name}
                  maxLength={51}
                />
              </Form.Item>
            </Col>
            <Col md={12} xs={24}>
              <Form.Item
                name="level"
                label="Рівень"
                labelCol={{ span: 24 }}
                initialValue={
                  isFollowerPath ? regionFollower.level : 1
                }
              >
                <Select
                  showSearch
                  optionFilterProp="children"
                >
                  {levels.map((item: number) => (
                    <Select.Option value={item}>
                      {item}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col><Col md={12} xs={24}>
              <Form.Item
                name="oblast"
                label="Область"
                labelCol={{ span: 24 }}
                initialValue={
                  isFollowerPath ? regionFollower.oblast : city.oblast
                }
                rules={[{ required: true, message: emptyInput("область") }]}
              >
                <Select
                  showSearch
                  optionFilterProp="children"
                  disabled={
                    location.pathname.startsWith(followerPath + "edit")
                  }
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
                name="region"
                label="Округа"
                labelCol={{ span: 24 }}
                initialValue={
                  isFollowerPath ? appealRegion.regionName : city.region
                }
                rules={[{ required: true, message: emptyInput("округа") }]}
              >
                <Select
                  showSearch
                  optionFilterProp="children"
                  disabled={
                    location.pathname.startsWith(followerPath + "edit")
                  }
                >
                  {regions
                    .sort((a, b) => a.regionName.localeCompare(b.regionName))
                    .map((item: RegionProfile) => (
                      <Select.Option
                        key={item.id}
                        value={isFollowerPath ? item.id : item.regionName}
                      >
                        {item.regionName}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
            <Col md={12} xs={24}>
              <Form.Item
                name="address"
                label="Адреса"
                labelCol={{ span: 24 }}
                initialValue={
                  isFollowerPath ? regionFollower.address : city.address
                }
                rules={descriptionValidation.Street}
              >
                <Input
                  value={isFollowerPath ? regionFollower.address : city.address}
                  maxLength={51}
                />
              </Form.Item>
            </Col>
            <Col md={12} xs={24}>
              <Form.Item
                name="phoneNumber"
                label="Номер телефону"
                labelCol={{ span: 24 }}
                initialValue={
                  isFollowerPath ? regionFollower.phoneNumber : city.phoneNumber
                }
                rules={[descriptionValidation.Phone]}
              >
                <ReactInputMask
                  mask="+380(99)-999-99-99"
                  maskChar={null}
                >
                  {(inputProps: any) => <Input {...inputProps} />}
                </ReactInputMask>
              </Form.Item>
            </Col>
            <Col md={12} xs={24}>
              <Form.Item
                name="cityURL"
                label="Посилання"
                labelCol={{ span: 24 }}
                initialValue={
                  isFollowerPath ? regionFollower.cityURL : city.cityURL
                }
                rules={descriptionValidation.Link}
              >
                <Input
                  value={isFollowerPath ? regionFollower.cityURL : city.cityURL}
                  maxLength={257}
                />
              </Form.Item>
            </Col>
            <Col md={12} xs={24}>
              <Form.Item
                name="email"
                label="Електронна пошта"
                labelCol={{ span: 24 }}
                rules={descriptionValidation.Email}
                initialValue={isFollowerPath ? regionFollower.email : city.email}
              >
                <Input
                  maxLength={51}
                />
              </Form.Item>
            </Col>
            <Col md={{ span: 24 }} xs={24}>
              <Form.Item
                name="description"
                label="Опис"
                labelCol={{ span: 24 }}
                initialValue={
                  isFollowerPath
                    ? regionFollower.cityDescription
                    : city.description
                }
                rules={descriptionValidation.DescriptionNotOnlyWhiteSpaces}
              >
                <TextArea
                  value={
                    isFollowerPath
                      ? regionFollower.cityDescription
                      : city.description
                  }
                  maxLength={1001}
                  rows={4}
                />
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
                </Button>
              ) : (
                <Button
                  type="primary"
                  className="backButton"
                  onClick={() => sureConfirm()}
                >
                  Назад
                </Button>
              )}
            </Col>
            <Col xs={24} sm={12}>
              {location.pathname.startsWith(followerPath + "edit") ||
                location.pathname.startsWith("/cities/edit/") ? (
                <Button
                  htmlType="submit"
                  loading={loadingButton}
                  type="primary"
                >
                  Підтвердити
                </Button>
              ) : location.pathname.startsWith(followerPath + "new") ? (
                <Button
                  htmlType="submit"
                  loading={loadingButton}
                  type="primary"
                >
                  Надіслати
                </Button>
              ) : (
                <Button
                  htmlType="submit"
                  loading={loadingButton}
                  type="primary"
                >
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
