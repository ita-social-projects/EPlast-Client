import React, {useEffect, useState} from 'react';
import { Form, DatePicker, Select, Input, Upload, Button } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import decisionsApi, {DecisionOnCreateData, DecisionWrapper, decisionStatusType} from '../../api/decisionsApi'

type FormAddDecisionProps ={
   onSubmit:(data :DecisionWrapper) => void
}
const FormAddDecision : React.FC<FormAddDecisionProps> = () => {
  const normFile = (e: { fileList: any }) => {
    if (Array.isArray(e)) {
      return e;
    }

    return e && e.fileList;
  };
const statusTypeParser = (statusType: decisionStatusType): number =>{
if(statusType.value === "InReview") return 0;
if (statusType.value === "Confirmed") return 1;
return 2;
};
 const handleSubmit = async (values : any)=>{
    console.log("--------",values);
    const newDecision ={
      decision: {
        "id": 0,
        "name": values.name,
        "decisionStatusType": statusTypeParser(JSON.parse(values.decisionStatusType)),
        "organization":JSON.parse(values.organization),
        "decisionTarget":JSON.parse(values.decisionTarget),
        "description": values.description,
        "date": "2020-04-15T00:00:00",
        "haveFile": false,
      },
      "decisionTargets": null,
      "file": null,
      "filename": null,
    }
    console.log("--------",newDecision);
   await decisionsApi.post(newDecision).then(res => console.log(res)).catch(error => console.log(error));
    
  }
  const[data, setData] = useState<DecisionOnCreateData>();
  useEffect(() => {
    const fetchData = async () => {
      await decisionsApi.getOnCreate()
      .then((d: DecisionOnCreateData) =>
        setData(d));
    };
    fetchData();
  },[]);
  return (
    <Form
      name="basic"
      onFinish ={handleSubmit}
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
      {data?.organizations.map(o => ( <Select.Option key={o.id} value={JSON.stringify(o)}>{o.organizationName}</Select.Option>))}
        </Select>
      </Form.Item>

      <Form.Item
       label="Тематика рішення"
       name ="decisionTarget">
        <Select>
        {data?.decisionTargets.map(dt => ( <Select.Option key ={dt.id }value={JSON.stringify(dt)}>{dt.targetName}</Select.Option>))}
        </Select>
      </Form.Item>
      <Form.Item name="date-picker" label="Дата рішення">
        <DatePicker />
      </Form.Item>
      <Form.Item 
       label="Текст рішення"
       name = "description">
        <Input.TextArea allowClear />
      </Form.Item>
      <Form.Item label="Прикріпити">
        <Form.Item
          name="dragger"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          noStyle
        >
          <Upload.Dragger name="files" action="/upload.do">
            <p className="ant-upload-drag-icon">
              <InboxOutlined style={{ color: '#3c5438' }} />
            </p>
            <p className="ant-upload-hint">
              Клікніть або перетягніть файл для завантаження
            </p>
          </Upload.Dragger>
        </Form.Item>
      </Form.Item>
      <Form.Item
       label="Статус рішення"
       name ="decisionStatusType">
        <Select>
        {data?.decisionStatusTypeListItems.map(dst => ( <Select.Option key= {dst.value} value={JSON.stringify(dst)}>{dst.text}</Select.Option>))}
        </Select>
      </Form.Item>

       <Form.Item>
        <Button type="primary" htmlType="submit">
          Опублікувати
        </Button>
      </Form.Item> 
    </Form>
  );
};

export default FormAddDecision;
