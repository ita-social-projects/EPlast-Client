import React, {useState, useEffect} from 'react';
import { Form, Input,Button } from 'antd';
import decisionsApi, {DecisionPost} from '../../api/decisionsApi';
import formclasses from './FormEditDecision.module.css';

interface Props {
  record: number;
  decision: DecisionPost;
  setShowModal: (showModal: boolean) => void;
  onEdit :(id: number, name: string, description: string) => void;
}

const FormEditDecision = ({ record,  setShowModal, onEdit, decision}: Props) => {
  const [loading, setLoading] = useState(false);
  const  id = record;
  const [form] = Form.useForm();
  useEffect(() => {
    setLoading(true);
    form.setFieldsValue({
      name : decision.name,
      description: decision.description
     });
     setLoading(false);
  },[decision],);
  const handleCancel = () => {
    setShowModal(false);
  }
  const handleFinish = async (dec : any) => {
    const newDecision : DecisionPost = {
    id : decision?.id,
    name : dec.name,
    decisionStatusType : decision?.decisionStatusType,
    organization : decision?.organization,
    decisionTarget : decision?.decisionTarget,
    description : dec.description,
    date : decision?.date,
    fileName : decision?.fileName 
  };
    await decisionsApi.put(id, newDecision);
    onEdit(newDecision.id, newDecision.name, newDecision.description);
    setShowModal(false);
    };

  return (
   <div>
    {!loading && (
      <Form
      name="basic"
     onFinish ={handleFinish}
     form ={form}
    >
      <Form.Item
        label="Назва рішення"
        name="name"
        className={formclasses.inputWidth}
        rules={[
          {
          
            required: true,
            message: 'Це поле має бути заповненим' 
          },
        ]}
      >
        <Input className={formclasses.input}/>
      </Form.Item>

      <Form.Item
       label="Текст рішення"
       name="description"
       rules={[
        {
        
          required: true,
          message: 'Це поле має бути заповненим' 
        },
      ]}
       >
        <Input.TextArea className={formclasses.input} allowClear />
      </Form.Item>
      <Form.Item style = {{ textAlign: "right"}}>
      <Button 
        key="back"
        onClick = {handleCancel}
        className={formclasses.buttons}
        >
          Відмінити
        </Button>
        <Button
         type="primary" htmlType="submit"
         className={formclasses.buttons}
        >
          Змінити
        </Button>

      </Form.Item> 
    </Form>)}
    </div>
  );
};

export default FormEditDecision;
