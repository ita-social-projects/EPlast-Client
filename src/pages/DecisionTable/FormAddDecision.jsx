import React,{ useEffect, useState } from 'react';
import { Form, DatePicker, Select, Input, Upload, Button } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import decisionsApi from '../../api/decisionsApi';
//import { Console } from 'console';
const FormAddDecision = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({decisionStatusTypes:[],decisionTargets:[], organization: [] });
  const [decisionStatusTypes, setDecisionStatusTypes] = useState({text :[], value:[]});
  const [decisionTargets, setDecisionTargets] = useState({});
  const [organizations, setOrganizations] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
     // const response = await decisionsApi.getOnCreate();
      await decisionsApi.getOnCreate().then(response =>{
        const d1 = response.data.decisionStatusTypeListItems;
        const d2 = response.data.decisionTargets;
        const d3 = response.data.organizationListItems;
        setData({decisionStatusTypes:d1,decisionTargets:d2, organization: d3 });
      })
      setLoading(false);
    };
    fetchData();
  }, []);
  const normFile = e => {
    // console.log('Upload event:', e);

    if (Array.isArray(e)) {
      return e;
    }

    return e && e.fileList;
  };
  const onFinish = async values => {
   
   console.log(values);
  }
  return (
    <div>
    {!loading && (

      <Form
      onFinish = {onFinish}
      name="basic"
      initialValues={{
        remember: true,
      }}
    >
      <Form.Item
        label="Назва рішення"
        name="name"
        rules={[
          {
            message: 'Це поле має бути заповненим',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Рішення органу"
        name = "organization">
        <Select>
        {data.organization.map(st => ( <Select.Option value={st.value}>{st.text}</Select.Option>))}
        </Select>
      </Form.Item>

      <Form.Item
       label="Тематика рішення"
       name = "target">
        <Select>
        {data.decisionTargets.map(st => ( <Select.Option value={st.id}>{st.targetName}</Select.Option>))}
        </Select>
      </Form.Item>
      <Form.Item name="date-picker" label="Дата рішення" >
        <DatePicker />
      </Form.Item>
      <Form.Item label="Текст рішення">
        <Input.TextArea allowClear />
      </Form.Item>
      <Form.Item label="Статус рішення">
        <Select>
          {console.log("select",data)}
      { data.decisionStatusTypes.map(st => ( <Select.Option value={st.value}>{st.text}</Select.Option>))}
       { data.decisionStatusTypes.map(st => {console.log(st.value)})}
        </Select>
        </Form.Item>
      <Form.Item label="Прикріпити">
        <Form.Item name="dragger" valuePropName="fileList" getValueFromEvent={normFile} noStyle>
          <Upload.Dragger name="files" action="/upload.do">
            <p className="ant-upload-drag-icon">
              <InboxOutlined style={{ color: '#3c5438' }} />
            </p>
            <p className="ant-upload-hint">Клікніть або перетягніть файл для завантаження</p>
          </Upload.Dragger>
        </Form.Item>
      </Form.Item>
        <Button type="primary" htmlType="submit">
          Опублікувати
        </Button>
    </Form>)}
    </div>
  );
};

export default FormAddDecision;
