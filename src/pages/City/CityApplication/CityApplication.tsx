import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Button, Form, Input, Layout, Upload, Row, Col, Card } from "antd";
import ReactInputMask from "react-input-mask";
import Title from "antd/lib/typography/Title";
import CityDefaultLogo from "../../../assets/images/default_city_image.jpg";
import { getRegionById, getRegionFollowerById } from "../../../api/regionsApi";
import "../CreateCity/CreateCity.less";
import RegionProfile from "../../../models/Region/RegionProfile";
import Spinner from "../../Spinner/Spinner";
import { emptyInput } from "../../../components/Notifications/Messages";
import { descriptionValidation } from "../../../models/GllobalValidations/DescriptionValidation";
import RegionFollower from "../../../models/Region/RegionFollower";
import User from "../../../models/UserTable/User";
import UserApi from "../../../api/UserApi";
import { OblastsWithoutNotSpecified } from "../../../models/Oblast/OblastsRecord";
import TextArea from "antd/lib/input/TextArea";
import RollbackOutlined from "@ant-design/icons/lib/icons/RollbackOutlined";
import { getUserCityAccess } from "../../../api/citiesApi";
import jwt from "jwt-decode";
import AuthLocalStorage from "../../../AuthLocalStorage";

const CreateCity = () => {
  const [form] = Form.useForm();
  const { regionId, followerId } = useParams();
  const history = useHistory();
  const [isDataLoaded, setDataLoaded] = useState<boolean>(false);
  const [appealRegion, setAppealRegion] = useState<RegionProfile>(
    new RegionProfile()
  );
  const [regionFollower, setRegionFollower] = useState<RegionFollower>(
    {} as RegionFollower
  );
  const [applicant, setApplicant] = useState<User>({} as User);
  const [userAccess, setUserAccess] = useState<{ [key: string]: boolean }>({});

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
    });
  };

  const loadData = async () => {
    try {
      await getRegionFollower(followerId);
    } finally {
      const user: any = jwt(AuthLocalStorage.getToken() as string);
      const userAccess = await getUserCityAccess(followerId, user.nameid);
      setUserAccess(userAccess.data);
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
        <Title level={2}>Заява на створення станиці</Title>
        <Form form={form}>
          <Form.Item name="logo" initialValue={regionFollower.logo}>
            <Upload
              disabled
              name="avatar"
              listType="picture-card"
              showUploadList={false}
              accept=".jpeg,.jpg,.png"
            >
              <img
                src={
                  regionFollower?.logo ? regionFollower.logo : CityDefaultLogo
                }
                alt="City"
                className="cityLogo"
              />
            </Upload>
          </Form.Item>
          <Row justify="center" gutter={[16, 4]}>
            {
              <Col md={12} xs={24}>
                <Form.Item
                  name="applicant"
                  label="Заявник"
                  labelCol={{ span: 24 }}
                  initialValue={applicant.firstName + " " + applicant.lastName}
                  rules={[{ required: true, message: emptyInput("заявник") }]}
                >
                  <Input
                    readOnly
                    style={{ cursor: "pointer" }}
                    maxLength={51}
                    onClick={() =>
                      history.push(`/userpage/main/${applicant.id}`)
                    }
                  />
                </Form.Item>
              </Col>
            }
            {
              <Col md={12} xs={24}>
                <Form.Item
                  name="appeal"
                  label="Заява"
                  labelCol={{ span: 24 }}
                  initialValue={regionFollower.appeal}
                  rules={descriptionValidation.Appeal}
                >
                  <Input
                    readOnly
                    value={regionFollower.appeal}
                    maxLength={1001}
                  />
                </Form.Item>
              </Col>
            }
            <Col md={12} xs={24}>
              <Form.Item
                name="name"
                label="Назва"
                labelCol={{ span: 24 }}
                initialValue={regionFollower.cityName}
                rules={descriptionValidation.CityName}
              >
                <Input
                  readOnly
                  value={regionFollower.cityName}
                  maxLength={51}
                />
              </Form.Item>
            </Col>
            <Col md={12} xs={24}>
              <Form.Item
                name="level"
                label="Рівень"
                labelCol={{ span: 24 }}
                initialValue={regionFollower.level}
              >
                <Input readOnly></Input>
              </Form.Item>
            </Col>
            <Col md={12} xs={24}>
              <Form.Item
                name="oblast"
                label="Область"
                labelCol={{ span: 24 }}
                initialValue={
                  OblastsWithoutNotSpecified[regionFollower.oblast][1]
                }
                rules={[{ required: true, message: emptyInput("область") }]}
              >
                <Input readOnly></Input>
              </Form.Item>
            </Col>
            <Col md={12} xs={24}>
              <Form.Item
                name="region"
                label="Округа"
                labelCol={{ span: 24 }}
                initialValue={appealRegion.regionName}
                rules={[{ required: true, message: emptyInput("округа") }]}
              >
                <Input readOnly></Input>
              </Form.Item>
            </Col>
            <Col md={12} xs={24}>
              <Form.Item
                name="address"
                label="Адреса"
                labelCol={{ span: 24 }}
                initialValue={regionFollower.address}
                rules={descriptionValidation.Street}
              >
                <Input readOnly value={regionFollower.address} maxLength={51} />
              </Form.Item>
            </Col>
            <Col md={12} xs={24}>
              <Form.Item
                name="phoneNumber"
                label="Номер телефону"
                labelCol={{ span: 24 }}
                initialValue={regionFollower.phoneNumber}
                rules={[descriptionValidation.Phone]}
              >
                <Input readOnly />
              </Form.Item>
            </Col>
            <Col md={12} xs={24}>
              <Form.Item
                name="cityURL"
                label="Посилання"
                labelCol={{ span: 24 }}
                initialValue={regionFollower.cityURL}
                rules={descriptionValidation.Link}
              >
                <Input
                  readOnly
                  value={regionFollower.cityURL}
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
                initialValue={regionFollower.email}
              >
                <Input readOnly maxLength={51} />
              </Form.Item>
            </Col>
            <Col md={{ span: 24 }} xs={24}>
              <Form.Item
                name="description"
                label="Опис"
                labelCol={{ span: 24 }}
                initialValue={regionFollower.cityDescription}
                rules={descriptionValidation.DescriptionNotOnlyWhiteSpaces}
              >
                <TextArea
                  readOnly
                  value={regionFollower.cityDescription}
                  maxLength={1001}
                  rows={4}
                />
              </Form.Item>
            </Col>
          </Row>
          {userAccess["CreateCity"] && (
            <Row className="cityButtons" justify="center" gutter={[0, 6]}>
              <Col xs={24} sm={12}>
                <Button
                  type="primary"
                  href={`/regions/${regionFollower.regionId}/followers/${regionFollower.id}/edit`}
                >
                  Управління заявою
                </Button>
              </Col>
            </Row>
          )}
        </Form>
      </Card>
    </Layout.Content>
  );
};

export default CreateCity;
