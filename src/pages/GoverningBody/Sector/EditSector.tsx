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
import DefaultLogo from "../../../assets/images/default_city_image.jpg";
import {
  getSectorById,
  getSectorLogo,
  getSectorsListByGoverningBodyId,
  updateSector,
} from "../../../api/governingBodySectorsApi";
import "../../City/CreateCity/CreateCity.less";
import SectorProfile from "../../../models/GoverningBody/Sector/SectorProfile";
import notificationLogic from "../../../components/Notifications/Notification";
import Title from "antd/lib/typography/Title";
import Spinner from "../../Spinner/Spinner";
import {
  fileIsUpload,
  fileIsNotUpload,
  possibleFileExtensions,
  fileIsTooBig,
  successfulDeleteAction,
  successfulUpdateAction,
  failUpdateAction,
} from "../../../components/Notifications/Messages"
import { descriptionValidation, sameNameValidator } from "../../../models/GllobalValidations/DescriptionValidation";

const EditSector = () => {
  const { governingBodyId, sectorId } = useParams();
  const history = useHistory();

  const [loading, setLoading] = useState(false);
  const [sector, setSector] = useState<SectorProfile>(new SectorProfile());
  const [sectorNames, setSectorNames] = useState<string[]>([]);
  const orgName: string = 'Сектор'

  useEffect(() => {
    getSectorNames();
  },[]);

  const getSectorNames = async () => {
    let sectors = (await getSectorsListByGoverningBodyId(governingBodyId) as any[])
    let currentName = (await getSectorById(sectorId)).data.sectorViewModel.name
    setSectorNames(sectors.map(x => x.name).filter(x => x !== currentName));
  }


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
          setSector({ ...sector, logo: base64 });
        });
        notificationLogic("success", fileIsUpload("Фото"));
      }
    } else {
      notificationLogic("error", fileIsNotUpload("фото"));
    }
  };

  const removeLogo = (event: any) => {
    setSector({ ...sector, logo: null });
    notificationLogic("success", successfulDeleteAction("Фото"));
    event.stopPropagation();
  };

  const getSector = async () => {
    try {
      setLoading(true);
      let response = await getSectorById(+sectorId);
      const sectorViewModel = response.data.sectorViewModel;

      if (sectorViewModel.logo !== null && sectorViewModel.logo !== '') {
        const logo = await getSectorLogo(sectorViewModel.logo);
        sectorViewModel.logo = logo.data;
      }
      setSector(sectorViewModel);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (+sectorId) {
      getSector();
    }
  }, [sectorId]);

  const handleSubmit = async (values: any) => {
    const newSector: SectorProfile = {
      id: sector.id,
      governingBodyId: governingBodyId,
      description: values.description,
      email: values.email,
      name: (values.name as string).trim(),
      logo: sector.logo?.length === 0 ? null : sector.logo,
      phoneNumber: values.phoneNumber,
      head: sector.head,
      isActive: true
    };

    await EditSector(newSector);
  };

  const EditSector = async (newSector: SectorProfile) => {

    return updateSector(newSector.id, JSON.stringify(newSector))
      .then(() => {
        notificationLogic("success", successfulUpdateAction("Напрям керівного органу"));
        history.goBack();
      })
      .catch(() => {
        notificationLogic("error", failUpdateAction("напрям керівного органу"));
      });
  };

  return loading && sector ? (
    <Spinner />
  ) : (
    <Layout.Content className="createCity">
      <Card hoverable className="createCityCard">
        {sector.id ? (
          <Title level={2}>Редагування напряму керівного органу</Title>
        ) : (
          <Title level={2}>Створення напряму керівного органу</Title>
        )}
        <Form onFinish={handleSubmit}>
          <Form.Item name="logo" initialValue={sector.logo}>
            <Upload
              name="avatar"
              listType="picture-card"
              showUploadList={false}
              accept=".jpeg,.jpg,.png"
              customRequest={handleUpload}
            >
              {sector.logo?.length! > 0 ? (
                <DeleteOutlined onClick={removeLogo} />
              ) : (
                <PlusOutlined />
              )}
              <img
                src={sector?.logo ? sector.logo : DefaultLogo}
                alt="GoverningBodySector"
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
                initialValue={sector.name}
                rules={[...descriptionValidation.Name, sameNameValidator(orgName,sectorNames)]}
              >
                <Input value={sector.name} maxLength={51} />
              </Form.Item>
            </Col>
            <Col md={{ span: 11, offset: 2 }} xs={24}>
              <Form.Item
                name="description"
                label="Опис"
                labelCol={{ span: 24 }}
                initialValue={sector.description}
                rules={descriptionValidation.Description}
              >
                <Input value={sector.description} maxLength={1001} />
              </Form.Item>
            </Col>
            <Col md={11} xs={24}>
              <Form.Item
                name="phoneNumber"
                label="Номер телефону"
                labelCol={{ span: 24 }}
                initialValue={sector.phoneNumber}
                rules={[descriptionValidation.Phone]}
              >
                <ReactInputMask
                  mask="+380(99)-999-99-99"
                  maskChar={null}
                  value={sector.phoneNumber}
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
                initialValue={sector.email}
                rules={descriptionValidation.Email}
              >
                <Input value={sector.email} maxLength={51} />
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

export default EditSector;
