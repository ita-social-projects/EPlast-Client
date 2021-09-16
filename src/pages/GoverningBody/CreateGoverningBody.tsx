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
  ConsoleSqlOutlined,
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
  getGoverningBodyLogo,
  updateGoverningBody,
  getGoverningBodiesList
} from "../../api/governingBodiesApi";
import "../City/CreateCity/CreateCity.less";
import GoverningBodyProfile from "../../models/GoverningBody/GoverningBodyProfile";
import notificationLogic from "../../components/Notifications/Notification";
import Title from "antd/lib/typography/Title";
import Spinner from "../Spinner/Spinner";
import {
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
import { descriptionValidation, sameNameValidator} from "../../models/GllobalValidations/DescriptionValidation";

const CreateGoverningBody = () => {
  const { id } = useParams();
  const history = useHistory();

  const [loading, setLoading] = useState(false);
  const [governingBody, setGoverningBody] = useState<GoverningBodyProfile>(new GoverningBodyProfile());
  const [governingBodyNames, setGoverningBodyNames] = useState<string[] | undefined>();
  const orgName: string = 'Керівний орган'
  
  const getGoverningBodyNames = async () => {
    let governingBodies = (await getGoverningBodiesList() as any[])
    if(+id){
      let currentName = (await getGoverningBodyById(+id)).data.governingBodyViewModel.governingBodyName;
      setGoverningBodyNames(governingBodies.map(x => x.governingBodyName).filter(x => x !== currentName))
    }
    else
      setGoverningBodyNames(governingBodies.map(x => x.governingBodyName));
  }

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
      let response = (await getGoverningBodyById(+id)).data.governingBodyViewModel;
      if (response.logo !== null && response.logo !== '') {
        const logo = await getGoverningBodyLogo(response.logo);
        response.logo = logo.data;
      }
      setGoverningBody(response);
      console.log(response)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (+id) {
      getGoverningBody();
    }
    getGoverningBodyNames()
  }, [id]);

  const handleSubmit = async (values: any) => {
    const newGoverningBody: GoverningBodyProfile = {
      id: governingBody.id,
      description: values.description,
      email: values.email,
      governingBodyName: values.name,
      logo: governingBody.logo?.length === 0 ? null : governingBody.logo,
      phoneNumber: values.phoneNumber,
      head: governingBody.head,
    };

    if (!governingBody.id) {
      CreateGoverningBody(newGoverningBody);
    } else {
      EditGoverningBody(newGoverningBody);
    }
  };

  const CreateGoverningBody = async (newGoverningBody: GoverningBodyProfile) => {
    createGoverningBody(JSON.stringify(newGoverningBody))
    .then((response) => {
      governingBody.id = response.data;
      notificationLogic("success", successfulCreateAction("Керівний орган"));
      history.replace(`/governingBodies/${governingBody.id}`);
    })
    .catch(() => {
      getGoverningBodyNames()
      notificationLogic("error", failCreateAction("керівний орган"));
    });
  };

  const EditGoverningBody = async (newGoverningBody: GoverningBodyProfile) => {
    
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
    <Layout.Content className="createCity">
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
                initialValue={governingBody.governingBodyName}
                rules={[...descriptionValidation.Name, sameNameValidator(orgName,governingBodyNames)]}
              >
                <Input value={governingBody.governingBodyName} maxLength={51} />
              </Form.Item>
            </Col>
            <Col md={{ span: 11, offset: 2 }} xs={24}>
              <Form.Item
                name="description"
                label="Опис"
                labelCol={{ span: 24 }}
                initialValue={governingBody.description}
                rules={descriptionValidation.Description}
              >
                <Input value={governingBody.description} maxLength={1001} />
              </Form.Item>
            </Col>
            <Col md={11} xs={24}>
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
            <Col md={{ span: 11, offset: 2 }} xs={24}>
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
