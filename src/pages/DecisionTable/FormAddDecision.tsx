import React, {useEffect, useState} from 'react';
import { Form, DatePicker, Select, Input, Upload, Button } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import decisionsApi, {DecisionOnCreateData, decisionStatusType} from '../../api/decisionsApi'

type FormAddDecisionProps ={
   setVisibleModal: (visibleModal: boolean) => void;
}
const FormAddDecision : React.FC<FormAddDecisionProps> = (props: any) => {
 const  { setVisibleModal } = props;
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
  console.log("------",  values.dragger)
  const newDecision ={
    decision: {
      "id": 0,
      "name": values.name,
      "decisionStatusType": statusTypeParser(JSON.parse(values.decisionStatusType)),
      "organization":JSON.parse(values.organization),
      "decisionTarget":JSON.parse(values.decisionTarget),
      "description": values.description,
      "date":/* eslint no-underscore-dangle: ["error", { "allow": ["_d"] }] */ values.datepicker._d,
      "haveFile": false,
    },
    "decisionTargets": null,
    "file": null,
    "filename": null,
  }
  console.log("--------",newDecision);
 await decisionsApi.post(newDecision).then(res => console.log(res)).catch(error => console.log(error));
 setVisibleModal(false);
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
         
            required: true,
            message: 'Це поле має бути заповненим' 
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
       label="Рішення органу"
       name = "organization"
       rules={[ { required: true,  message: 'Це поле має бути заповненим'}]}>
        <Select>
      {data?.organizations.map(o => ( <Select.Option key={o.id} value={JSON.stringify(o)}>{o.organizationName}</Select.Option>))}
        </Select>
      </Form.Item>

      <Form.Item
       label="Тематика рішення"
       name ="decisionTarget"
       rules={[ { required: true,  message: 'Це поле має бути заповненим'}]}>
        <Select>
        {data?.decisionTargets.map(dt => ( <Select.Option key ={dt.id }value={JSON.stringify(dt)}>{dt.targetName}</Select.Option>))}
        </Select>
      </Form.Item>
      <Form.Item 
       name="datepicker"
       label="Дата рішення"
       rules={[ { required: true,  message: 'Це поле має бути заповненим'}]}>
        <DatePicker format = "YYYY-MM-DD"/>
      </Form.Item>
      <Form.Item 
       label="Текст рішення"
       name = "description"
       rules={[ { required: true,  message: 'Це поле має бути заповненим'}]}>
        <Input.TextArea allowClear />
      </Form.Item>
      <Form.Item label="Прикріпити">
        <Form.Item
          name="dragger"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          noStyle
        >
          <Upload.Dragger name="files">
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
       name ="decisionStatusType"
       rules={[ { required: true,  message: 'Це поле має бути заповненим'}]}>
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
