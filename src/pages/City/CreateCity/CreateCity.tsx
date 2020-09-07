import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Button, Form, Input, Layout, Upload, notification, Row, Col, Spin, Table, Select, Divider, Card } from "antd";
import { DeleteOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons/lib";
import ReactInputMask from "react-input-mask";
import moment from "moment";
import { RcCustomRequestOptions, RcFile } from "antd/lib/upload/interface";
import CityDefaultLogo from "../../../assets/images/default_city_image.jpg";
import { createCity, getCityById, getLogo, updateCity } from "../../../api/citiesApi";
import { GetAllRegions } from '../../../api/regionsApi';
import classes from "./CreateCity.module.css";
import "./CreateCity.less"
import CityProfile from '../../../models/City/CityProfile';
import CityAdmin from '../../../models/City/CityAdmin';
import CityMember from '../../../models/City/CityMember';
import RegionProfile from '../../../models/Region/RegionProfile';
import { membersColumns, administrationsColumns } from "./CityTableColumns";
import notificationLogic from '../../../components/Notifications/Notification';
import Title from "antd/lib/typography/Title";

const CreateCity = () => {
  const {id} = useParams();
  const history = useHistory();

  const [servLoading, setServLoading] = useState(false);
  const [city, setCity] = useState<CityProfile>(new CityProfile());
  const [regions, setRegions] = useState<RegionProfile[]>([]);
  const [admins, setAdmins] = useState<CityAdmin[]>([]);
  const [members, setMembers] = useState<CityMember[]>([]);
  const [followers, setFollowers] = useState<CityMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [cityLogo, setCityLogo] = useState<string>("");

  const dummyRequest = ({ onSuccess }: any) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };
  
  const getBase64 = (img: Blob, callback: Function) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };
  
  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      notification.error({
        message: "Можна загружати лише JPG/PNG файли!",
      });
    }
  
    const isSmaller2mb =  file.size < 2097152;
    if (!isSmaller2mb) {
      notification.error({
        message: "Файл повинен займати менше 2MB!",
      });
    }
    
    return isJpgOrPng && isSmaller2mb;
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
  
    const isSmaller2mb =  size < 2097152;
    if (!isSmaller2mb) {
      notificationLogic("error", "Розмір файлу перевищує 3 Мб");
    }
    
    return isCorrectExtension && isSmaller2mb;
  }

  const handleUpload = (info: RcCustomRequestOptions) => {
    if (info !== null) {
      if (checkFile(info.file.size, info.file.name)) {
          getBase64(info.file, (base64: string) => {
            setLoading(true);
            setCityLogo(base64);
            setLoading(false);
          });
              // if (info.file.status === "uploading") {
              //   setLoading(true);
              //   return;
              // }
              // if (info. status === "done") {
              //   getBase64(
              //     info.file.originFileObj,
              //     (imageUrl: React.SetStateAction<boolean>) => {
              //       setLoading(false);
              //       setCity({ ...city, [key]: imageUrl });
              //     }
              //   );
              // }
          notificationLogic("success", "Фото завантажено");
      }
    } else {
      notificationLogic("error", "Проблема з завантаженням фото");
    }
  }

  const removeLogo = (event: any) => {
    setCityLogo("");
    notificationLogic("success", "Фото видалено");
    event.stopPropagation();
  }

  function onSearch(val: any) {
  }

  const getCity = async () => {
    setServLoading(true);
    
    try {
      const response = await getCityById(+id);
      
      if (response.data.logo === null) {
        response.data.logo = CityDefaultLogo;
      } else {
        const logo = await getLogo(response.data.logo);
        response.data.logo = logo.data;
        setCityLogo(logo.data);
      }

      setCity(response.data);
      setAdmins(response.data.administration);
      setMembers(response.data.members);
      setFollowers(response.data.followers);
    } finally {
      setServLoading(false);
    }
  };

  const getRegions = async () => {
    setServLoading(true);

    try {
      const response = await GetAllRegions();
      setRegions(response.data);
    } finally {
      setServLoading(false);
    }
  }

  const getTableAdmins = (city: CityProfile): any[] => {
    if (admins.length > 0 || city.head != null) {
      const tableAdmins = [...admins, city.head].map((member: CityAdmin) =>
        convertToTableAdmin(member)
      );

      return tableAdmins.filter((a) => a !== null);
    }

    return [];
  };

  const convertToTableAdmin = (admin: CityAdmin) => {
    return admin
      ? {
          key: admin.id,
          name: `${admin.user.firstName} ${admin.user.lastName}`,
          status: "Адміністратор",
          type: admin.adminType.adminTypeName,
          startDate: moment(admin.startDate).format("DD-MM-YYYY"),
          endDate: admin.endDate
            ? moment(admin.endDate).format("DD-MM-YYYY")
            : "Не визначено",
        }
      : null;
  };

  const getTableMembers = (city: CityProfile) => {
    const arr = members.filter((member: CityMember) => {
      return ![...admins, city.head].find((admin: CityAdmin) => {
        return admin?.user.id === member.user.id;
      });
    });

    return arr.map((member: CityMember) => ({
      key: member.id,
      name: `${member.user.firstName} ${member.user.lastName}`,
      status: "Член станиці",
    }));
  };

  const getTableFollowers = (city: CityProfile) => {
    return followers.map((member: CityMember) => ({
      key: member.id,
      name: `${member.user.firstName} ${member.user.lastName}`,
      status: "Прихильник станиці",
    }));
  };

  useEffect(() => {
    if (id) {
      getCity()
      .then(() => getRegions())
    }
    else {
      getRegions();
    }
  }, [id]);

  const handleChange = (info: any, key: string) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      getBase64(
        info.file.originFileObj,
        (imageUrl: React.SetStateAction<boolean>) => {
          setLoading(false);
          setCity({ ...city, [key]: imageUrl });
        }
      );
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <img src={CityDefaultLogo} alt="City" style={{ width: "300px" }} />
    </div>
  );

  const validateMessages = {
    required: "Це поле є обов`язковим!",
    types: {
      email: "Невалідний email!",
    },
  };

  const CreateCity = async () => {
    notification.info({
      message: "Створення...",
      icon: <LoadingOutlined />,
    });

    const responsePromise = createCity(JSON.stringify(city));
    const response = await responsePromise;
    city.id = response.data;

    return responsePromise
      .then(() => {
        notificationLogic("success", "Станицю успішно створено");
        history.push(`${city.id}`);
      })
      .catch(() => {
        notificationLogic("error", "Не вдалося створити станицю");
      });
  };

  const EditCity = async () => {
    notification.info({
      message: "Оновлення...",
      icon: <LoadingOutlined />,
    });

    return updateCity(city.id, JSON.stringify(city))
      .then(() => {
        notificationLogic("success", "Станицю успішно оновлено");
        history.goBack();
      })
      .catch(() => {
        notificationLogic("error", "Не вдалося оновити станицю");
      });
  };

  const handleSubmit = () => {
    if (city.logo?.indexOf("default_city_image") !== -1) {
      city.logo = null;
    }

    if (city && !city.id) {
      CreateCity();
    } else {
      EditCity();
    }
  };

  const handleSubmitNew = async (values: any) => {
    console.log("handle submit");
  };

  const onChange = (event: any, key: string) => {
    setCity({ ...city, [key]: event.target.value });
  };

  return !servLoading && city ? (
    <div>
      <Layout.Content className="createCity">
        <Card hoverable className="createCityCard">
          {city.id ? (
            <Title level={2}>Редагування станиці</Title>
          ) : (
            <Title level={2}>Створення станиці</Title>
          )}
          <Form validateMessages={validateMessages} onFinish={handleSubmitNew}>
            <Form.Item initialValue={city.logo}>
              <Upload
                name="avatar"
                listType="picture-card"
                showUploadList={false}
                accept=".jpeg,.jpg,.png"
                customRequest={handleUpload}
                // beforeUpload={beforeUpload}
                // onChange={(event) => handleChange(event, "logo")}
              >
                {cityLogo.length > 0 ? (
                  <DeleteOutlined onClick={removeLogo} />
                ) : (
                  <PlusOutlined />
                )}
                <img
                  src={cityLogo.length > 0 ? cityLogo : CityDefaultLogo}
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
                  rules={[{ required: true }]}
                >
                  <Input
                    value={city.name}
                    //onChange={(event) => onChange(event, "name")}
                  />
                </Form.Item>
              </Col>
              <Col md={{ span: 11, offset: 2 }} xs={24}>
                <Form.Item
                  name="description"
                  label="Опис"
                  labelCol={{ span: 24 }}
                  initialValue={city.description}
                >
                  <Input
                    value={city.description}
                    //onChange={(event) => onChange(event, "description")}
                  />
                </Form.Item>
              </Col>
              <Col md={11} xs={24}>
                <Form.Item
                  name="cityURL"
                  label="Посилання"
                  labelCol={{ span: 24 }}
                  initialValue={city.cityURL}
                >
                  <Input
                    value={city.cityURL}
                    //onChange={(event) => onChange(event, "cityURL")}
                  />
                </Form.Item>
              </Col>
              <Col md={{ span: 11, offset: 2 }} xs={24}>
                <Form.Item
                  name="phoneNumber"
                  label="Номер телефону"
                  labelCol={{ span: 24 }}
                  initialValue={city.phoneNumber}
                >
                  <ReactInputMask
                    mask="+38(999)-999-99-99"
                    value={city.phoneNumber}
                    //onChange={(event) => onChange(event, "phoneNumber")}
                  >
                    {(inputProps: any) => <Input {...inputProps} type="tel" />}
                  </ReactInputMask>
                </Form.Item>
              </Col>
              <Col md={11} xs={24}>
                <Form.Item
                  name="email"
                  label="Електронна пошта"
                  labelCol={{ span: 24 }}
                  initialValue={city.email}
                  //rules={[{ type: "email" }]}
                >
                  <Input
                    value={city.email}
                    //onChange={(event) => onChange(event, "email")}
                  />
                </Form.Item>
              </Col>
              <Col md={{ span: 11, offset: 2 }} xs={24}>
                <Form.Item
                  name="region"
                  label="Округ"
                  labelCol={{ span: 24 }}
                  initialValue={city.region}
                  rules={[{ required: true }]}
                >
                  <Select
                    showSearch
                    optionFilterProp="children"
                    onSearch={onSearch}
                    // onChange={(event) =>
                    //   setCity({ ...city, ["region"]: event as string })
                    // }
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
                  rules={[{ required: true }]}
                >
                  <Input
                    value={city.street}
                    //onChange={(event) => onChange(event, "street")}
                  />
                </Form.Item>
              </Col>
              <Col md={{ span: 11, offset: 2 }} xs={24}>
                <Form.Item
                  name="houseNumber"
                  label="Номер будинку"
                  labelCol={{ span: 24 }}
                  initialValue={city.houseNumber}
                  rules={[{ required: true }]}
                >
                  <Input
                    value={city.houseNumber}
                    //onChange={(event) => onChange(event, "houseNumber")}
                  />
                </Form.Item>
              </Col>
              <Col md={11} xs={24}>
                <Form.Item
                  name="officeNumber"
                  label="Номер офісу/квартири"
                  labelCol={{ span: 24 }}
                  initialValue={city.officeNumber}
                >
                  <Input
                    value={city.officeNumber}
                    //onChange={(event) => onChange(event, "officeNumber")}
                  />
                </Form.Item>
              </Col>
              <Col md={{ span: 11, offset: 2 }} xs={24}>
                <Form.Item
                  name="postIndex"
                  label="Поштовий індекс"
                  labelCol={{ span: 24 }}
                  initialValue={city.postIndex}
                >
                  <Input
                    type="number"
                    value={city.postIndex}
                    //onChange={(event) => onChange(event, "postIndex")}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row className="cityButtons" justify="center" gutter={[0, 6]}>
              <Col xs={24} sm={12}>
                <Button htmlType="submit" type="primary">
                  Підтвердити
                </Button>
              </Col>
              <Col xs={24} sm={12}>
                <Button type="primary" onClick={() => history.goBack()}>
                  Назад
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
        {city.id ? (
          <Card hoverable className="cityMembersCard">
            <Row justify="space-between">
              <Col span={24}>
                <Table
                  dataSource={getTableAdmins(city)}
                  columns={administrationsColumns}
                  pagination={{ defaultPageSize: 4 }}
                  scroll={{x: "30vw"}}
                />
              </Col>
              <Col md={10} xs={24}>
                <Table
                  dataSource={getTableMembers(city)}
                  columns={membersColumns}
                  pagination={{ defaultPageSize: 4 }}
                />
              </Col>
              <Col md={{ span: 10, offset: 2 }} xs={24}>
                <Table
                  dataSource={getTableFollowers(city)}
                  columns={membersColumns}
                  pagination={{ defaultPageSize: 4 }}
                />
              </Col>
            </Row>
          </Card>
        ) : null}
      </Layout.Content>
      <Divider> CREATE OR EDIT CITY </Divider>
      <Layout.Content className={classes.createCity}>
        <section className={classes.container}>
          {city.id ? (
            <h1 className={classes.mainTitle}>Редагування станиці</h1>
          ) : (
            <h1 className={classes.mainTitle}>Створення станиці</h1>
          )}
          <Row
            justify="space-around"
            gutter={[0, 20]}
            style={{ overflow: "hidden" }}
          >
            <Col>
              <Form
                className={classes.cityForm}
                validateMessages={validateMessages}
                layout="inline"
                onFinish={handleSubmit}
              >
                <Col
                  span={20}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <Form.Item initialValue={city.logo}>
                    <Upload
                      name="avatar"
                      listType="picture-card"
                      className="avatar-uploader"
                      showUploadList={false}
                      customRequest={dummyRequest}
                      beforeUpload={beforeUpload}
                      onChange={(event) => handleChange(event, "logo")}
                    >
                      {city.logo ? (
                        <img
                          src={city.logo}
                          alt="City"
                          style={{ width: "300px" }}
                        />
                      ) : (
                        uploadButton
                      )}
                    </Upload>
                  </Form.Item>
                </Col>
                <Col span={9}>
                  <Form.Item
                    name={["city", "name"]}
                    label="Назва"
                    labelAlign="left"
                    rules={[{ required: true }]}
                    className={classes.formField}
                    initialValue={city.name}
                  >
                    <Input
                      value={city.name}
                      onChange={(event) => onChange(event, "name")}
                    />
                  </Form.Item>
                </Col>
                <Col span={9}>
                  <Form.Item
                    name={["city", "description"]}
                    label="Опис"
                    labelAlign="left"
                    className={classes.formField}
                    initialValue={city.description}
                  >
                    <Input
                      value={city.description}
                      onChange={(event) => onChange(event, "description")}
                    />
                  </Form.Item>
                </Col>
                <Col span={9}>
                  <Form.Item
                    name={["city", "cityURL"]}
                    label="Посилання"
                    labelAlign="left"
                    className={classes.formField}
                    initialValue={city.cityURL}
                  >
                    <Input
                      value={city.cityURL}
                      onChange={(event) => onChange(event, "cityURL")}
                    />
                  </Form.Item>
                </Col>
                <Col span={9}>
                  <Form.Item
                    name={["city", "phoneNumber"]}
                    label="Номер телефону"
                    labelAlign="left"
                    className={classes.formField}
                    initialValue={city.phoneNumber}
                  >
                    <ReactInputMask
                      mask="+38(999)-999-99-99"
                      value={city.phoneNumber}
                      onChange={(event) => onChange(event, "phoneNumber")}
                    >
                      {(inputProps: any) => (
                        <Input {...inputProps} type="tel" />
                      )}
                    </ReactInputMask>
                  </Form.Item>
                </Col>
                <Col span={9}>
                  <Form.Item
                    name={["city", "email"]}
                    label="Електронна пошта"
                    labelAlign="left"
                    rules={[{ type: "email" }]}
                    className={classes.formField}
                    initialValue={city.email}
                  >
                    <Input
                      value={city.email}
                      onChange={(event) => onChange(event, "email")}
                    />
                  </Form.Item>
                </Col>
                <Col span={9}>
                  <Form.Item
                    name={["city", "region"]}
                    label="Округ"
                    labelAlign="left"
                    rules={[{ required: true }]}
                    className={classes.formField}
                    initialValue={city.region}
                  >
                    <Select
                      showSearch
                      optionFilterProp="children"
                      onSearch={onSearch}
                      onChange={(event) =>
                        setCity({ ...city, ["region"]: event as string })
                      }
                      className={classes.selectField}
                    >
                      {regions.map((item: RegionProfile) => (
                        <Select.Option key={item.id} value={item.regionName}>
                          {item.regionName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={9}>
                  <Form.Item
                    name={["city", "street"]}
                    label="Вулиця"
                    labelAlign="left"
                    rules={[{ required: true }]}
                    className={classes.formField}
                    initialValue={city.street}
                  >
                    <Input
                      value={city.street}
                      onChange={(event) => onChange(event, "street")}
                    />
                  </Form.Item>
                </Col>
                <Col span={9}>
                  <Form.Item
                    name={["city", "houseNumber"]}
                    label="Номер будинку"
                    labelAlign="left"
                    rules={[{ required: true }]}
                    className={classes.formField}
                    initialValue={city.houseNumber}
                  >
                    <Input
                      value={city.houseNumber}
                      onChange={(event) => onChange(event, "houseNumber")}
                    />
                  </Form.Item>
                </Col>
                <Col span={9}>
                  <Form.Item
                    name={["city", "officeNumber"]}
                    label="Номер офісу/квартири"
                    labelAlign="left"
                    className={classes.formField}
                    initialValue={city.officeNumber}
                  >
                    <Input
                      value={city.officeNumber}
                      onChange={(event) => onChange(event, "officeNumber")}
                    />
                  </Form.Item>
                </Col>
                <Col span={9}>
                  <Form.Item
                    name={["city", "postIndex"]}
                    label="Поштовий індекс"
                    labelAlign="left"
                    className={classes.formField}
                    initialValue={city.postIndex}
                  >
                    <Input
                      type="number"
                      value={city.postIndex}
                      onChange={(event) => onChange(event, "postIndex")}
                    />
                  </Form.Item>
                </Col>
                <Col span={9} style={{ marginTop: "auto" }}>
                  <Form.Item>
                    <Button
                      htmlType="submit"
                      type="primary"
                      className={classes.createButton}
                    >
                      Підтвердити
                    </Button>
                  </Form.Item>
                </Col>
              </Form>
            </Col>
          </Row>
        </section>
        {city.id ? (
          <div className={classes.container}>
            <Row justify="space-between" className={classes.tablesContainer}>
              <Col
                flex="0 1 100%"
                style={{
                  marginBottom: "20px",
                  borderBottom: "2px solid #3c5438",
                }}
              >
                <Table
                  dataSource={getTableAdmins(city)}
                  columns={administrationsColumns}
                  pagination={{ defaultPageSize: 4 }}
                />
              </Col>
              <Col flex="0 1 40%" style={{ borderBottom: "2px solid #3c5438" }}>
                <Table
                  dataSource={getTableMembers(city)}
                  columns={membersColumns}
                  pagination={{ defaultPageSize: 4 }}
                />
              </Col>
              <Col flex="0 1 40%" style={{ borderBottom: "2px solid #3c5438" }}>
                <Table
                  dataSource={getTableFollowers(city)}
                  columns={membersColumns}
                  pagination={{ defaultPageSize: 4 }}
                />
              </Col>
            </Row>
            <Button
              type="primary"
              className={classes.backButton}
              onClick={() => history.goBack()}
            >
              Назад
            </Button>
          </div>
        ) : null}
      </Layout.Content>
    </div>
  ) : (
    <Layout.Content className={classes.spiner}>
      <Spin size="large" />
    </Layout.Content>
  );
};

export default CreateCity;
