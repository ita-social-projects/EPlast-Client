import React from "react";
import { Drawer, Button, Col, Row, Form, Input } from "antd";
import "./ClubDetailDrawer.less";
import ClubProfile from "../../../models/Club/ClubProfile";
import TextArea from "antd/lib/input/TextArea";

interface Props {
  visibleDrawer: boolean;
  setVisibleDrawer: (visibleDrawer: boolean) => void;
  Club: ClubProfile;
}

const ClubDetailDrawer = (props: Props) => {
  return (
    <Drawer
      title={`Деталі куреня ${props.Club.name?.length > 0 ? props.Club.name : ""}`}
      onClose={() => props.setVisibleDrawer(false)}
      visible={props.visibleDrawer}
      footer={null}
      forceRender={true}
      width=""
      className="ClubDetail"
    >
      <Form className="detailsForm">
        <Row justify="center" gutter={[12, 0]}>
          <Col md={12} xs={24}>
            <Form.Item
              name="clubURL"
              label="Посилання"
              labelCol={{ span: 24 }}
              initialValue={
                props.Club.clubURL?.length > 0 ? props.Club.clubURL : "---"
              }
            >
              <a href={props.Club.clubURL} target="_blank">
                <Input
                  value={
                    props.Club.clubURL?.length > 0 ? props.Club.clubURL : "---"
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
                props.Club.phoneNumber?.length > 0
                  ? props.Club.phoneNumber
                  : "---"
              }
            >
              <Input
                value={
                  props.Club.phoneNumber?.length > 0
                    ? props.Club.phoneNumber
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
                props.Club.email?.length > 0 ? props.Club.email : "---"
              }
            >
              <Input
                value={props.Club.email?.length > 0 ? props.Club.email : "---"}
                disabled
              />
            </Form.Item>
          </Col>
          <Col md={12} xs={24}>
          <Form.Item
              name="street"
              label="Гасло"
              labelCol={{ span: 24 }}
              initialValue={
                props.Club.street?.length > 0 ? props.Club.street : "---"
              }
            >
              <Input
                value={
                  props.Club.street?.length > 0 ? props.Club.street : "---"
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
                props.Club.description?.length > 0
                  ? props.Club.description
                  : "---"
              }
            >
              <TextArea
                autoSize
                value={
                  props.Club.description?.length > 0
                    ? props.Club.description
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

export default ClubDetailDrawer;
