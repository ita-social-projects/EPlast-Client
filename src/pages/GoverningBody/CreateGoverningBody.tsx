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
import GoverningBodyDefaultLogo from "../../assets/images/default_city_image.jpg";
import {
  createGoverningBody,
  getGoverningBodyById,
  getLogo,
  updateGoverningBody,
} from "../../api/governingBodiesApi";
import "../City/CreateCity/CreateCity.less";
import GoverningBodyProfile from "../../models/GoverningBody/GoverningBodyProfile";
import RegionBoardProfile from "../../models/RegionBoard/RegionBoardProfile";
import notificationLogic from "../../components/Notifications/Notification";
import Title from "antd/lib/typography/Title";
import Spinner from "../Spinner/Spinner";
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
} from "../../components/Notifications/Messages"
import { descriptionValidation } from "../../models/GllobalValidations/DescriptionValidation";
import { GetRegionsBoard } from "../../api/regionsApi";


const CreateGoverningBody = () => {
  const { id } = useParams();
  const history = useHistory();

  const [loading, setLoading] = useState(false);
  const [governingBody, setGoverningBody] = useState<GoverningBodyProfile>(new GoverningBodyProfile());
  const [regionsBoard, setRegionsBoard] = useState<RegionBoardProfile[]>([]);

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
          setGoverningBody({ ...governingBody, logo: base64 });
        });
        notificationLogic("success", fileIsUpload("Фото"));
      }
    } else {
      notificationLogic("error", fileIsNotUpload("фото"));
    }
  };

  const removeLogo = (event: any) => {
    setGoverningBody({ ...governingBody, logo: null });
    notificationLogic("success", successfulDeleteAction("Фото"));
    event.stopPropagation();
  };

  const getGoverningBody = async () => {
    try {
      setLoading(true);
      let response = await getGoverningBodyById(+id);

      if (response.data.logo !== null) {
        const logo = await getLogo(response.data.logo);
        response.data.logo = logo.data;
      }

      setGoverningBody(response.data);
    } finally {
      setLoading(false);
    }
  };

  const getRegionsBoard = async () => {
    try {
      setLoading(true);
      const response = await GetRegionsBoard();
      setRegionsBoard(response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (+id) {
      getGoverningBody().then(() => getRegionsBoard());
    } else {
      getRegionsBoard();
    }
  }, [id]);

  const handleSubmit = async (values: any) => {
    const newGoverningBody: GoverningBodyProfile = {
      governingBodyURL: values.governingBodyURL,
      description: values.description,
      email: values.email,
      head: governingBody.head,
      houseNumber: values.houseNumber,
      id: governingBody.id,
      logo: governingBody.logo?.length === 0 ? null : governingBody.logo,
      officeNumber: values.officeNumber,
      name: values.name,
      phoneNumber: values.phoneNumber,
      postIndex: values.postIndex,
      region: values.region,
      street: values.street,
    };

    if (!governingBody.id) {
      CreateGoverningBody(newGoverningBody);
    } else {
      EditGoverningBody(newGoverningBody);
    }
  };

  const CreateGoverningBody = async (newGoverningBody: GoverningBodyProfile) => {
    notificationLogic("info", "Створення...", <LoadingOutlined />);
    const responsePromise = createGoverningBody(JSON.stringify(newGoverningBody));
    const response = await responsePromise;
    governingBody.id = response.data;

    return responsePromise
      .then(() => {
        notificationLogic("success", successfulCreateAction("Керівний орган"));
        history.push(`${governingBody.id}`);
      })
      .catch(() => {
        notificationLogic("error", failCreateAction("керівний орган"));
      });
  };

  const EditGoverningBody = async (newGoverningBody: GoverningBodyProfile) => {
    notificationLogic("info", "Оновлення...", <LoadingOutlined />);

    return updateGoverningBody(governingBody.id, JSON.stringify(newGoverningBody))
      .then(() => {
        notificationLogic("success", successfulUpdateAction("Керівний орган"));
        history.goBack();
      })
      .catch(() => {
        notificationLogic("error", failUpdateAction("керівний орган"));
      });
  };

  return loading && governingBody ? (
    <Spinner />
  ) : (
    <Layout.Content className="createGoverningBody">
      <Card hoverable className="createCityCard">
        {governingBody.id ? (
          <Title level={2}>Редагування керівного органу</Title>
        ) : (
          <Title level={2}>Створення керівного органу</Title>
        )}
        <Form onFinish={handleSubmit}>
          <Form.Item name="logo" initialValue={governingBody.logo}>
          <Upload
              name="avatar"
              listType="picture-card"
              showUploadList={false}
              accept=".jpeg,.jpg,.png"
              customRequest={handleUpload}
            >
              {governingBody.logo?.length! > 0 ? (
                <DeleteOutlined onClick={removeLogo} />
              ) : (
                <PlusOutlined />
              )}
              <img
                src={governingBody?.logo ? governingBody.logo : GoverningBodyDefaultLogo}
                alt="GoverningBody"
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
                initialValue={governingBody.name}
                rules={descriptionValidation.Name}
              >
                <Input value={governingBody.name} maxLength={51} />
              </Form.Item>
            </Col>
            <Col md={{ span: 11, offset: 2 }} xs={24}>
              <Form.Item
                name="description"
                label="Опис"
                labelCol={{ span: 24 }}
                initialValue={governingBody.description}
                rules={[descriptionValidation.Description]}
              >
                <Input value={governingBody.description} maxLength={1001} />
              </Form.Item>
            </Col>
            <Col md={11} xs={24}>
              <Form.Item
                name="governingBodyURL"
                label="Посилання"
                labelCol={{ span: 24 }}
                initialValue={governingBody.governingBodyURL}
                rules={[descriptionValidation.Link]}
              >
                <Input value={governingBody.governingBodyURL} maxLength={257} />
              </Form.Item>
            </Col>
            <Col md={{ span: 11, offset: 2 }} xs={24}>
              <Form.Item
                name="phoneNumber"
                label="Номер телефону"
                labelCol={{ span: 24 }}
                initialValue={governingBody.phoneNumber}
                rules={[descriptionValidation.Phone]}
              >
                <ReactInputMask
                  mask="+380(99)-999-99-99"
                  maskChar={null}
                  value={governingBody.phoneNumber}
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
                initialValue={governingBody.email}
                rules={descriptionValidation.Email}
              >
                <Input value={governingBody.email} maxLength={51} />
              </Form.Item>
            </Col>
            <Col md={{ span: 11, offset: 2 }} xs={24}>
              <Form.Item
                name="region"
                label="Округа"
                labelCol={{ span: 24 }}
                initialValue={governingBody.region}
                rules={[{ required: true, message: emptyInput("округа") }]}
              >
                <Select
                  showSearch
                  optionFilterProp="children"
                >
                  {regionsBoard.map((item: RegionBoardProfile) => (
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
                initialValue={governingBody.street}
                rules={descriptionValidation.Street}
              >
                <Input value={governingBody.street} maxLength={51} />
              </Form.Item>
            </Col>
            <Col md={{ span: 11, offset: 2 }} xs={24}>
              <Form.Item
                name="houseNumber"
                label="Номер будинку"
                labelCol={{ span: 24 }}
                initialValue={governingBody.houseNumber}
                rules={descriptionValidation.houseNumber}
              >
                <Input value={governingBody.houseNumber} maxLength={6} />
              </Form.Item>
            </Col>
            <Col md={11} xs={24}>
              <Form.Item
                name="officeNumber"
                label="Номер офісу/квартири"
                labelCol={{ span: 24 }}
                initialValue={governingBody.officeNumber}
                rules={descriptionValidation.officeNumber}
              >
                <Input value={governingBody.officeNumber} maxLength={6} />
              </Form.Item>
            </Col>
            <Col md={{ span: 11, offset: 2 }} xs={24}>
              <Form.Item
                name="postIndex"
                label="Поштовий індекс"
                labelCol={{ span: 24 }}
                initialValue={governingBody.postIndex}
                rules={descriptionValidation.postIndex}
              >
                <Input type="number" value={governingBody.postIndex} />
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

export default CreateGoverningBody;
