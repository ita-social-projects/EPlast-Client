import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, Typography, Row, Col } from "antd";
import RegionForAdmin from "../../models/Region/RegionForAdmin";
import { getRegions } from "../../api/regionsApi";
import AddRegionAdministratorModal from "./AddRegionAdministratorModal";
import NotificationBoxApi from "../../api/NotificationBoxApi";
const { Option } = Select;

interface Props {
  record: string;
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  onChange: (id: string, userRoles: string) => void;
  roles: string | undefined;
}

const ChangeUserRegionForm = ({
  record,
  showModal,
  setShowModal,
  onChange,
  roles,
}: Props) => {
  const id = record;
  const [form] = Form.useForm();
  const [regions, setRegions] = useState<RegionForAdmin[]>([]);
  const [regionId, setRegionId] = useState<number>(0);
  const [showAdministratorModal, setShowAdministratorModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await getRegions().then((response) => {
        setRegions(response.data);
      });
    };
    fetchData();
    if (showModal) {
      form.resetFields();
    }
  }, []);

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleClick = async (event: any) => {
    const id = regions.filter((c: any) => c.regionName === event)[0].id;
    setRegionId(id);
  };

  const handleFinish = async (value: any) => {
    setShowModal(false);
    setShowAdministratorModal(true);
  };

  const handleChange = (id: string, userRole: string) => {
    onChange(id, userRole);
    const regionName = regions.find((r) => r.id === regionId)?.regionName;
    regionName &&
      NotificationBoxApi.createNotifications(
        [id],
        `Вам була присвоєна нова роль: '${userRole}' в окрузі: `,
        NotificationBoxApi.NotificationTypes.UserNotifications,
        `/regions/${regionId}`,
        regionName
      );
  };

  return (
    <div>
      <Form name="basic" onFinish={handleFinish} form={form}>
        <h4>Оберіть округ для користувача</h4>
        <Form.Item name="userRegion">
          <Select onChange={handleClick}>
            {regions.map((item: RegionForAdmin) => (
              <Option key={item.id} value={item.regionName}>
                {item.regionName}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item className="cancelConfirmButtons">
          <Row justify="end">
            <Col xs={11} sm={5}>
              <Button key="back" onClick={handleCancel}>
                Відмінити
              </Button>
            </Col>
            <Col
              className="publishButton"
              xs={{ span: 11, offset: 2 }}
              sm={{ span: 6, offset: 1 }}
            >
              <Button type="primary" htmlType="submit">
                Призначити
              </Button>
            </Col>
          </Row>
        </Form.Item>

        <AddRegionAdministratorModal
          userId={id}
          showAdministratorModal={showAdministratorModal}
          setShowAdministratorModal={setShowAdministratorModal}
          regionId={regionId}
          roles={roles}
          onChange={handleChange}
        ></AddRegionAdministratorModal>
      </Form>
    </div>
  );
};

export default ChangeUserRegionForm;
