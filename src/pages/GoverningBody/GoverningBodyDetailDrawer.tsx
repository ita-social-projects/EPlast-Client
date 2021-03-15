import React from "react";
import { Drawer, Button, Col, Row, Form, Input } from "antd";
import "../City/CityDetailDrawer/CityDetailDrawer.less";
import GoverningBodyProfile from "../../models/GoverningBody/GoverningBodyProfile";
import TextArea from "antd/lib/input/TextArea";

interface Props {
  visibleDrawer: boolean;
  setVisibleDrawer: (visibleDrawer: boolean) => void;
  governingBody: GoverningBodyProfile;
}

const GoverningBodyDetailDrawer = (props: Props) => {
  return (
    <Drawer
      title={`Деталі керівного органу ${props.governingBody.name?.length > 0 ? props.governingBody.name : ""}`}
      onClose={() => props.setVisibleDrawer(false)}
      visible={props.visibleDrawer}
      footer={null}
      forceRender={true}
      width=""
      className="cityDetail"
    >
      <Form className="detailsForm">
        <Row justify="center" gutter={[12, 0]}>
          <Col md={12} xs={24}>
            <Form.Item
              name="governingBodyURL"
              label="Посилання"
              labelCol={{ span: 24 }}
              initialValue={
                props.governingBody.governingBodyURL?.length > 0 ? props.governingBody.governingBodyURL : "---"
              }
            >
              <a href={props.governingBody.governingBodyURL} target="_blank">
                <Input
                  value={
                    props.governingBody.governingBodyURL?.length > 0 ? props.governingBody.governingBodyURL : "---"
                  }
                  disabled
                />
              </a>
            </Form.Item>
          </Col>
          <Col md={12} xs={24}>
            <Form.Item
              name="phoneNumber"
              label="Номер телефону"
              labelCol={{ span: 24 }}
              initialValue={
                props.governingBody.phoneNumber?.length > 0
                  ? props.governingBody.phoneNumber
                  : "---"
              }
            >
              <Input
                value={
                  props.governingBody.phoneNumber?.length > 0
                    ? props.governingBody.phoneNumber
                    : "---"
                }
                disabled
              />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="center" gutter={[12, 0]}>
          <Col md={12} xs={24}>
            <Form.Item
              name="email"
              label="Електронна пошта"
              labelCol={{ span: 24 }}
              initialValue={
                props.governingBody.email?.length > 0 ? props.governingBody.email : "---"
              }
            >
              <Input
                value={props.governingBody.email?.length > 0 ? props.governingBody.email : "---"}
                disabled
              />
            </Form.Item>
          </Col>
          <Col md={12} xs={24}>
            <Form.Item
              name="region"
              label="Округа"
              labelCol={{ span: 24 }}
              initialValue={
                props.governingBody.region?.length > 0 ? props.governingBody.region : "---"
              }
            >
              <Input
                value={
                  props.governingBody.region?.length > 0 ? props.governingBody.region : "---"
                }
                disabled
              />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="center" gutter={[12, 0]}>
          <Col md={12} xs={24}>
            <Form.Item
              name="street"
              label="Вулиця"
              labelCol={{ span: 24 }}
              initialValue={
                props.governingBody.street?.length > 0 ? props.governingBody.street : "---"
              }
            >
              <Input
                value={
                  props.governingBody.street?.length > 0 ? props.governingBody.street : "---"
                }
                disabled
              />
            </Form.Item>
          </Col>
          <Col md={12} xs={24}>
            <Form.Item
              name="houseNumber"
              label="Номер будинку"
              labelCol={{ span: 24 }}
              initialValue={
                props.governingBody.houseNumber?.length > 0
                  ? props.governingBody.houseNumber
                  : "---"
              }
            >
              <Input
                value={
                  props.governingBody.houseNumber?.length > 0
                    ? props.governingBody.houseNumber
                    : "---"
                }
                disabled
              />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="center" gutter={[12, 0]}>
          <Col md={12} xs={24}>
            <Form.Item
              name="officeNumber"
              label="Номер офісу/квартири"
              labelCol={{ span: 24 }}
              initialValue={
                props.governingBody.officeNumber?.length > 0
                  ? props.governingBody.officeNumber
                  : "---"
              }
            >
              <Input
                value={
                  props.governingBody.officeNumber?.length > 0
                    ? props.governingBody.officeNumber
                    : "---"
                }
                disabled
              />
            </Form.Item>
          </Col>
          <Col md={12} xs={24}>
            <Form.Item
              name="postIndex"
              label="Поштовий індекс"
              labelCol={{ span: 24 }}
              initialValue={
                props.governingBody.postIndex?.length > 0 ? props.governingBody.postIndex : "---"
              }
            >
              <Input
                value={
                  props.governingBody.postIndex?.length > 0
                    ? props.governingBody.postIndex
                    : "---"
                }
                disabled
              />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="center" gutter={[12, 0]}>
          <Col md={24} xs={24}>
            <Form.Item
              name="description"
              label="Опис"
              labelCol={{ span: 24 }}
              initialValue={
                props.governingBody.description?.length > 0
                  ? props.governingBody.description
                  : "---"
              }
            >
              <TextArea
                autoSize =
                {
                  {
                    minRows: 1,
                    maxRows: 9
                  }
                }
                value={
                  props.governingBody.description?.length > 0
                    ? props.governingBody.description
                    : "---"
                }
                disabled
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};

export default GoverningBodyDetailDrawer;
