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
  getClubById,
  getLogo,
  updateClub,
} from "../../../api/clubsApi";
import "./CreateClub.less";
import ClubProfile from "../../../models/Club/ClubProfile";
import notificationLogic from "../../../components/Notifications/Notification";
import Title from "antd/lib/typography/Title";
import Spinner from "../../Spinner/Spinner";
import { descriptionValidation } from "../../../models/GllobalValidations/DescriptionValidation";
import{
  fileIsUpload,
  fileIsNotUpload, 
  possibleFileExtensions, 
  fileIsTooBig, 
  successfulCreateAction, 
  successfulUpdateAction, 
  failCreateAction,
  failUpdateAction,
  successfulDeleteAction
} from "../../../components/Notifications/Messages"

const nameMaxLength = 201;
const descriptionMaxLength = 1001;
const linkMaxLength = 257;
const emailMaxLength = 51;
const CreateClub = () => {
  const { id } = useParams();
  const history = useHistory();

  const [loading, setLoading] = useState(false);
  const [club, setClub] = useState<ClubProfile>(new ClubProfile());

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
          setClub({ ...club, logo: base64 });
        });
        notificationLogic("success", fileIsUpload("Фото"));
      }
    } else {
      notificationLogic("error", fileIsNotUpload("фото"));
    }
  };

  const removeLogo = (event: any) => {
    setClub({ ...club, logo: null });
    notificationLogic("success", successfulDeleteAction("Фото"));
    event.stopPropagation();
  };

  const getClub = async () => {
    try {
      setLoading(true);
      let response = await getClubById(+id);

      if (response.data.logo !== null) {
        const logo = await getLogo(response.data.logo);
        response.data.logo = logo.data;
      }

      setClub(response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (+id) {
      getClub();
    }
  }, [id]);

  const handleSubmit = async (values: any) => {
    const newClub: ClubProfile = {
      clubURL: values.clubURL,
      description: values.description,
      email: values.email,
      head: club.head,
      headDeputy: club.headDeputy,
      houseNumber: values.houseNumber,
      id: club.id,
      logo: club.logo?.length === 0 ? null : club.logo,
      officeNumber: values.officeNumber,
      name: values.name,
      phoneNumber: values.phoneNumber,
      postIndex: values.postIndex,
      street: values.street,
      isActive: club.isActive
    };
    if (!club.id) {
      CreateClub(newClub);
    } else {
      EditClub(newClub);
    }
  };

  const CreateClub = async (newClub: ClubProfile) => {
    try{
    notificationLogic("info", "Створення...", <LoadingOutlined />);
    const response = await createClub(JSON.stringify(newClub));
    club.id = response.data;
        notificationLogic("success", successfulCreateAction("Курінь"));
        history.push(`/clubs/${club.id}`);
      }
    catch(error) {
        notificationLogic("error", failCreateAction("курінь. Можливо курінь з даною назвою уже існує"));
      }
  };

  const EditClub = async (newClub: ClubProfile) => {
  
    return updateClub(club.id, JSON.stringify(newClub))
      .then(() => {
        notificationLogic("success", successfulUpdateAction("Курінь"));
        history.goBack();
      })
      .catch(() => {
        notificationLogic("error", failUpdateAction("курінь"));
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
            <Col md={10} xs={24}>
              <Form.Item
                name="name"
                label="Назва"
                labelCol={{ span: 24 }}
                initialValue={club.name}
                rules={descriptionValidation.ClubName}
              >
                <Input value={club.name} maxLength={nameMaxLength} />
              </Form.Item>
            </Col>
            <Col md={{ span: 10, offset: 2 }} xs={24}>
              <Form.Item
                name="description"
                label="Опис"
                labelCol={{ span: 24 }}
                initialValue={club.description}
                rules={[descriptionValidation.Description]}
              >
                <Input value={club.description} maxLength={descriptionMaxLength}/>
              </Form.Item>
            </Col>
            <Col md={10} xs={24}>
              <Form.Item
                name="clubURL"
                label="Посилання"
                labelCol={{ span: 24 }}
                initialValue={club.clubURL}
                rules={[descriptionValidation.Link]}
              >
                <Input value={club.clubURL} maxLength={linkMaxLength}/>
              </Form.Item>
            </Col>
            <Col md={{ span: 10, offset: 2 }} xs={24}>
              <Form.Item
                name="phoneNumber"
                label="Номер телефону"
                labelCol={{ span: 24 }}
                initialValue={club.phoneNumber}
                rules={[descriptionValidation.Phone]}
              >
                <ReactInputMask
                maskChar={null}
                  mask="+380(99)-999-99-99"
                  value={club.phoneNumber}
                >
                  {(inputProps: any) => <Input {...inputProps}/>}
                </ReactInputMask>
              </Form.Item>
            </Col>
            <Col md={10} xs={24}>
              <Form.Item
                name="email"
                label="Електронна пошта"
                labelCol={{ span: 24 }}
                initialValue={club.email}
                rules={descriptionValidation.Email}
              >
                <Input value={club.email} maxLength={emailMaxLength}/>
              </Form.Item>
            </Col>
            <Col md={{ span: 10, offset: 2 }} xs={24}>
            <Form.Item
                name="street"
                label="Вулиця"
                labelCol={{ span: 24 }}
                initialValue={club.street}
                rules={[descriptionValidation.Description]}
              >
                <Input value={club.description} maxLength={descriptionMaxLength}/>
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
    </Layout.Content>
  );
};

export default CreateClub;
