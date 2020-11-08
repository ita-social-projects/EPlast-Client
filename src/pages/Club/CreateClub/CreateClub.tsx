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
  Table,
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
import ClubDefaultLogo from "../../../assets/images/default_club_image.jpg";
import {
  createClub,
  getAllAdmins,
  getAllFollowers,
  getAllMembers,
  getClubById,
  getLogo,
  updateClub,
} from "../../../api/clubsApi";
import { GetAllRegions } from "../../../api/regionsApi";
import "./CreateClub.less";
import ClubProfile from "../../../models/Club/ClubProfile";
import ClubAdmin from "../../../models/Club/ClubAdmin";
import ClubMember from "../../../models/Club/ClubMember";
import RegionProfile from "../../../models/Region/RegionProfile";
import {
  membersColumns,
  administrationsColumns,
  getTableAdmins,
  getTableMembers,
  getTableFollowers,
} from "./ClubTableColumns";
import notificationLogic from "../../../components/Notifications/Notification";
import Title from "antd/lib/typography/Title";
import Spinner from "../../Spinner/Spinner";

const CreateClub = () => {
  const { id } = useParams();
  const history = useHistory();

  const [loading, setLoading] = useState(false);
  const [club, setClub] = useState<ClubProfile>(new ClubProfile());
  const [regions, setRegions] = useState<RegionProfile[]>([]);
  const [admins, setAdmins] = useState<ClubAdmin[]>([]);
  const [members, setMembers] = useState<ClubMember[]>([]);
  const [followers, setFollowers] = useState<ClubMember[]>([]);

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
      notificationLogic("error", "Можливі розширення фото: png, jpg, jpeg");
    }

    const isSmaller2mb = size <= 3145728;
    if (!isSmaller2mb) {
      notificationLogic("error", "Розмір файлу перевищує 3 Мб");
    }

    return isCorrectExtension && isSmaller2mb;
  };

  const handleUpload = (info: RcCustomRequestOptions) => {
    if (info !== null) {
      if (checkFile(info.file.size, info.file.name)) {
        getBase64(info.file, (base64: string) => {
          setClub({ ...club, logo: base64 });
        });
        notificationLogic("success", "Фото завантажено");
      }
    } else {
      notificationLogic("error", "Проблема з завантаженням фото");
    }
  };

  const removeLogo = (event: any) => {
    setClub({ ...club, logo: null });
    notificationLogic("success", "Фото видалено");
    event.stopPropagation();
  };

  function onSearch(val: any) {}

  const getClub = async () => {
    try {
      setLoading(true);
      let response = await getClubById(+id);

      if (response.data.logo !== null) {
        const logo = await getLogo(response.data.logo);
        response.data.logo = logo.data;
      }

      setClub(response.data);
      setAdmins((await getAllAdmins(+id)).data.administration);
      setMembers((await getAllMembers(+id)).data.members);
      setFollowers((await getAllFollowers(+id)).data.followers);
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
      getClub().then(() => getRegions());
    } else {
      getRegions();
    }
  }, [id]);

  const handleSubmit = async (values: any) => {
    const newClub: ClubProfile = {
      clubURL: values.clubURL,
      description: values.description,
      email: values.email,
      head: club.head,
      houseNumber: values.houseNumber,
      id: club.id,
      logo: club.logo?.length === 0 ? null : club.logo,
      officeNumber: values.officeNumber,
      name: values.name,
      phoneNumber: values.phoneNumber,
      postIndex: values.postIndex,
      street: values.street,
    };

    if (!club.id) {
      CreateClub(newClub);
    } else {
      EditClub(newClub);
    }
  };

  const CreateClub = async (newClub: ClubProfile) => {
    notificationLogic("info", "Створення...", <LoadingOutlined />);
    const responsePromise = createClub(JSON.stringify(newClub));
    const response = await responsePromise;
    club.id = response.data;

    return responsePromise
      .then(() => {
        notificationLogic("success", "Курінь успішно створено");
        history.push(`${club.id}`);
      })
      .catch(() => {
        notificationLogic("error", "Не вдалося створити курінь");
      });
  };

  const EditClub = async (newClub: ClubProfile) => {
    notificationLogic("info", "Оновлення...", <LoadingOutlined />);

    return updateClub(club.id, JSON.stringify(newClub))
      .then(() => {
        notificationLogic("success", "Курінь успішно оновлено");
        history.goBack();
      })
      .catch(() => {
        notificationLogic("error", "Не вдалося оновити курінь");
      });
  };

  return loading && club ? (
    <Spinner />
  ) : (
    <Layout.Content className="createClub">
      <Card hoverable className="createClubCard">
        {club.id ? (
          <Title level={2}>Редагування Куреня</Title>
        ) : (
          <Title level={2}>Створення Куреня</Title>
        )}
        <Form onFinish={handleSubmit}>
          <Form.Item name="logo" initialValue={club.logo}>
            <Upload
              name="avatar"
              listType="picture-card"
              showUploadList={false}
              accept=".jpeg,.jpg,.png"
              customRequest={handleUpload}
            >
              {club.logo?.length! > 0 ? (
                <DeleteOutlined onClick={removeLogo} />
              ) : (
                <PlusOutlined />
              )}
              <img
                src={club?.logo ? club.logo : ClubDefaultLogo}
                alt="Club"
                className="clubLogo"
              />
            </Upload>
          </Form.Item>
          <Row justify="center">
            <Col md={11} xs={24}>
              <Form.Item
                name="name"
                label="Назва"
                labelCol={{ span: 24 }}
                initialValue={club.name}
                rules={[
                  { required: true, message: "Це поле є обов'язковим" },
                  {
                    max: 50,
                    message: "Максимальна довжина - 50 символів!",
                  },
                ]}
              >
                <Input value={club.name} maxLength={51} />
              </Form.Item>
            </Col>
            <Col md={{ span: 11, offset: 2 }} xs={24}>
              <Form.Item
                name="description"
                label="Опис"
                labelCol={{ span: 24 }}
                initialValue={club.description}
                rules={[
                  {
                    max: 1000,
                    message: "Максимальна довжина - 1000 символів!",
                  },
                ]}
              >
                <Input value={club.description} maxLength={1001}/>
              </Form.Item>
            </Col>
            <Col md={11} xs={24}>
              <Form.Item
                name="clubURL"
                label="Посилання"
                labelCol={{ span: 24 }}
                initialValue={club.clubURL}
                rules={[
                  {
                    max: 500,
                    message: "Максимальна довжина - 500 символів!",
                  },
                ]}
              >
                <Input value={club.clubURL} maxLength={501}/>
              </Form.Item>
            </Col>
            <Col md={{ span: 11, offset: 2 }} xs={24}>
              <Form.Item
                name="phoneNumber"
                label="Номер телефону"
                labelCol={{ span: 24 }}
                initialValue={club.phoneNumber}
                rules={[{ min: 18, message: "Неправильний телефон" }]}
              >
                <ReactInputMask
                  mask="+38(999)-999-99-99"
                  value={club.phoneNumber}
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
                initialValue={club.email}
                rules={[
                  {
                    pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/,
                    message: "Неправильна пошта",
                  },
                  {
                    max: 50,
                    message: "Максимальна довжина - 50 символів!",
                  },
                ]}
              >
                <Input value={club.email} maxLength={51}/>
              </Form.Item>
            </Col>
            <Col md={{ span: 11, offset: 2 }} xs={24}>
            <Form.Item
                name="street"
                label="Гасло"
                labelCol={{ span: 24 }}
                initialValue={club.street}
                rules={[
                  {
                    max: 1000,
                    message: "Максимальна довжина - 1000 символів!",
                  },
                ]}
              >
                <Input value={club.description} maxLength={1001}/>
                </Form.Item>
            </Col>
          </Row>
          <Row className="clubButtons" justify="center" gutter={[0, 6]}>
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
      {club.id ? (
        <Card hoverable className="clubMembersCard">
          <Row justify="space-between" gutter={[0, 12]}>
            <Col span={24}>
              <Table
                dataSource={getTableAdmins(admins, club.head)}
                columns={administrationsColumns}
                pagination={{ defaultPageSize: 4 }}
                className="table"
              />
            </Col>
            <Col md={10} xs={24}>
              <Table
                dataSource={getTableMembers(members, admins, club.head)}
                columns={membersColumns}
                pagination={{ defaultPageSize: 4 }}
              />
            </Col>
            <Col md={{ span: 10, offset: 2 }} xs={24}>
              <Table
                dataSource={getTableFollowers(followers)}
                columns={membersColumns}
                pagination={{ defaultPageSize: 4 }}
              />
            </Col>
          </Row>
        </Card>
      ) : null}
    </Layout.Content>
  );
};

export default CreateClub;
