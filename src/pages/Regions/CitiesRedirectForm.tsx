import React, { useState, useEffect } from "react";
import classes from "./Form.module.css";
import { Form, Input, DatePicker, AutoComplete, Select, Button } from "antd";
import notificationLogic from "../../components/Notifications/Notification";
import {
  GetAllRegions,
  redirectCities,
  removeRegion,
} from "../../api/regionsApi";
import { useParams, useHistory } from "react-router-dom";
import { removeCity } from "../../api/citiesApi";
import { emptyInput } from "../../components/Notifications/Messages";

type CitiesRedirectForm = {
  onAdd: () => void;
};

const CitiesRedirectForm = (props: any) => {
  const { onAdd } = props;
  const [form] = Form.useForm();
  const { id } = useParams();
  const history = useHistory();

  const [regions, setRegions] = useState<any[]>([]);
  const handleSubmit = async (values: any) => {
    const newRegion: any = {
      id: 0,
      regionId: JSON.parse(values.regionId).id,
    };

    await redirectCities(id, JSON.parse(values.regionId).id);

    await removeRegion(id);

    onAdd();

    history.push("/regions/page/1");
  };

  useEffect(() => {
    const fetchData = async () => {
      await GetAllRegions().then((response) => {
        const res = response.data.filter(
          (obj: any) => obj.id !== props.regionId
        );
        setRegions(res);
      });
    };
    fetchData();
  }, []);

  return (
    <Form name="basic" onFinish={handleSubmit} form={form}>
      <Form.Item
        className={classes.formField}
        label="Округа"
        name="regionId"
        rules={[
          {
            required: true,
            message: emptyInput(),
          },
        ]}
      >
        <Select showSearch className={classes.inputField}>
          {regions?.map((o) => (
            <Select.Option key={o.id} value={JSON.stringify(o)}>
              {o.regionName}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item style={{ textAlign: "right" }}>
        <Button type="primary" htmlType="submit">
          OK
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CitiesRedirectForm;
