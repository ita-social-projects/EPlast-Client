import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Button, Form, Input, Layout, Upload, notification, Row, Col, Spin, Table } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons/lib";
import ReactInputMask from "react-input-mask";
import moment from "moment";
import { RcFile } from "antd/lib/upload/interface";
import CityDefaultLogo from "../../assets/images/default_city_image.jpg";
import { createCity, getCityById, getLogo, updateCity } from "../../api/citiesApi";
import classes from "./CreateCity.module.css";

interface CityProps {
  id: number;
  name: string;
  logo: string | null;
  description: string;
  cityURL: string;
  phoneNumber: string;
  email: string;
  region: string;
  street: string;
  houseNumber: string;
  officeNumber: string;
  postIndex: string;
  members: MemberProps[];
  followers: MemberProps[];
  administration: AdminProps[];
  head: AdminProps;
}

interface MemberProps {
  id: number;
  user: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

interface AdminProps {
  id: number;
  user: {
    id: string;
    firstName: string;
    lastName: string;
  };
  adminType: {
    adminTypeName: string;
  };
  startDate: string;
  endDate: string;
}

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

  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    notification.error({
      message: "Файл повинен займати менше 2MB!",
    });
  }
  
  return isJpgOrPng && isLt2M;
};

const CreateCity = () => {
  const { id } = useParams();
  const history = useHistory();

  const [servLoading, setServLoading] = useState(false);
  const [city, setCity] = useState<CityProps>({
    id: 0,
    name: "",
    logo: "",
    description: "",
    cityURL: "",
    phoneNumber: "",
    email: "",
    region: "",
    street: "",
    houseNumber: "",
    officeNumber: "",
    postIndex: "",
    members: [
      {
        id: 0,
        user: {
          id: "",
          firstName: "",
          lastName: "",
        },
      },
    ],
    followers: [
      {
        id: 0,
        user: {
          id: "",
          firstName: "",
          lastName: "",
        },
      },
    ],
    administration: [
      {
        id: 0,
        user: {
          id: "",
          firstName: "",
          lastName: "",
        },
        adminType: {
          adminTypeName: "",
        },
        startDate: "1000-10-10",
        endDate: "1000-10-10",
      },
    ],
    head: {
      id: 0,
      user: {
        id: "",
        firstName: "",
        lastName: "",
      },
      adminType: {
        adminTypeName: "",
      },
      startDate: "1000-10-10",
      endDate: "1000-10-10",
    },
  });

  const getCity = async () => {
    setServLoading(true);
    try {
      const response = await getCityById(+id);

      if (response.data.logo === null) {
        response.data.logo = CityDefaultLogo;
      } else {
        const logo = await getLogo(response.data.logo);
        response.data.logo = logo.data;
      }

      setCity(response.data);
    } finally {
      setServLoading(false);
    }
  };

  const getTableAdmins = (city: CityProps) => {
    if ([...city.administration, city.head].length > 0) {
      return [...city.administration, city.head].map((member: AdminProps) => ({
        key: member.id,
        name: `${member.user.firstName} ${member.user.lastName}`,
        status: member.adminType ? "Адміністратор" : "",
        type: member.adminType ? member.adminType.adminTypeName : "",
        startDate: member.startDate
          ? moment(member.startDate).format("DD-MM-YYYY")
          : "",
        endDate: member.endDate
          ? moment(member.endDate).format("DD-MM-YYYY")
          : "",
      }));
    }
    return [];
  };

  const getTableMembers = (city: CityProps) => {
    const arr = city.members.filter((member: MemberProps) => {
      return ![...city.administration, city.head].find((admin: AdminProps) => {
        return admin?.user.id === member.user.id;
      });
    });

    return arr.map((member: MemberProps) => ({
      key: member.id,
      name: `${member.user.firstName} ${member.user.lastName}`,
      status: "Член станиці",
    }));
  };

  const getTableFollowers = (city: CityProps) => {
    return city.followers.map((member: MemberProps) => ({
      key: member.id,
      name: `${member.user.firstName} ${member.user.lastName}`,
      status: "Прихильник станиці",
    }));
  };

  const membersColumns = [
    {
      title: "ПІБ",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Статус",
      dataIndex: "status",
      key: "status",
    },
  ];
  const administrationsColumns = [
    {
      title: "ПІБ",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Статус",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Тип посади",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Час вступу на посаду",
      dataIndex: "startDate",
      key: "startDate",
    },
    {
      title: "Час завершення терміну",
      dataIndex: "endDate",
      key: "endDate",
    },
  ];

  useEffect(() => {
    if (id) {
      getCity();
    } else {
      setServLoading(false);
    }
  }, [id]);

  const [loading, setLoading] = useState(false);
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
    city.id = response.data.id;

    return responsePromise
      .then(() => {
        notification.success({
          message: "Станицю успішно створено",
        });
        history.push(`${city.id}`);
      })
      .catch(() => {
        notification.error({
          message: "Не вдалося створити станицю",
        });
      });
  };

  const EditCity = async () => {
    notification.info({
      message: "Оновлення...",
      icon: <LoadingOutlined />,
    });

    return updateCity(city.id, JSON.stringify(city))
      .then(() => {
        notification.success({
          message: "Станицю успішно оновлено",
        });
        history.goBack();
      })
      .catch(() => {
        notification.error({
          message: "Не вдалося оновити станицю",
        });
      });
  };

  const handleSubmit = () => {
    if (city.logo != null && city.logo.indexOf("default_city_image") !== -1) {
      city.logo = null;
    }

    if (city && !city.id) {
      CreateCity();
    } else {
      EditCity();
    }
  };

  const onChange = (event: any, key: string) => {
    setCity({ ...city, [key]: event.target.value });
  };

  return !servLoading && city ? (
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
                  className={classes.formField}
                  initialValue={city.phoneNumber}
                >
                  <ReactInputMask
                    mask="+38(999)-999-99-99"
                    value={city.phoneNumber}
                    onChange={(event) => onChange(event, "phoneNumber")}
                  >
                    {(inputProps: any) => <Input {...inputProps} type="tel" />}
                  </ReactInputMask>
                </Form.Item>
              </Col>
              <Col span={9}>
                <Form.Item
                  name={["city", "email"]}
                  label="Електронна пошта"
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
                  rules={[{ required: true }]}
                  className={classes.formField}
                  initialValue={city.region}
                >
                  <Input
                    value={city.region}
                    onChange={(event) => onChange(event, "region")}
                  />
                </Form.Item>
              </Col>
              <Col span={9}>
                <Form.Item
                  name={["city", "street"]}
                  label="Вулиця"
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
  ) : (
    <Layout.Content className={classes.spiner}>
      <Spin size="large" />
    </Layout.Content>
  );
};
export default CreateCity;
