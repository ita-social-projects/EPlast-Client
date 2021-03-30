import React, { useState, useEffect } from 'react';
import classes from './Form.module.css'
import { Form, Select, Button, Modal, Col } from 'antd';
import regionsApi from '../../../api/regionsApi';
import notificationLogic from "../../../components/Notifications/Notification";
import { useHistory } from 'react-router-dom';
import {successfulCreateAction, tryAgain, emptyInput, ReportAlreayExists} from "../../../components/Notifications/Messages"
import { maxLength } from '../../../components/Notifications/Messages';
import TextArea from 'antd/lib/input/TextArea';

interface Props {
  visibleModal: boolean,
  handleOk: () => void,
}


 const AddNewRegionReport = (props: Props)=>{
    const { visibleModal, handleOk } = props;
    const history = useHistory();
    const [form] = Form.useForm();
    const [years, setYears] = useState<any>();
    const [regions, setRegions] = useState<any[]>([{
        id:'',
        regionName:''
      }]);
      const [loading, setLoading] = useState(false);

      const fechYears = async () => {
        try {
          const arrayOfYears = [];
          for (let i = 2000; i <= 2040; i++) {
            arrayOfYears.push({ lable: i.toString(), value: i });
          }
          setYears(arrayOfYears);
        }
        catch (error) {
          showError(error.message);
        }
      }
      const showError = (message: string) => {
        Modal.error({
          title: "Помилка!",
          content: message,
        });
      };

      const handleSubmit = async (values : any)=>{
        const regionQuestions = {
            stateOfPreparation: values.StateOfPreparation,
            characteristic: values.Characteristic,
            statusOfStrategy: values.StatusOfStrategy,
            involvementOfVolunteers: values.InvolvementOfVolunteers,
            trainedNeeds:values.TrainedNeeds,
            publicFunding:values.PublicFunding,
            churchCooperation:values.ChurchCooperation,
            socialProjects:values.SocialProjects,
            problemSituations:values.ProblemSituations,
            importantNeeds:values.ImportantNeeds,
            successStories:values.SuccessStories,
            fundraising:values.Fundraising
          };
         await regionsApi.createRegionAnnualReport(JSON.parse(values.region).id,
           values.year, regionQuestions)
          .then(() => {
            notificationLogic("success", successfulCreateAction("Річний звіт"));
            window.location.reload();
          })
          .catch((error) => {
            error.response.status===400? notificationLogic("error", ReportAlreayExists) : notificationLogic("error", tryAgain);
          });    
          form.resetFields(); 
          setLoading(false);
        }

        const fetchData = async () => {
          await regionsApi.GetAllRegions().then(response => {
              setRegions(response.data);
          });
          setLoading(true);
      }

      useEffect(() => {
        fetchData();
        fechYears();
      }, [])

    return (<Modal
    title='Оберіть округу та рік для створення річного звіту'
    onCancel={handleOk}
    visible={visibleModal}
    footer={null} >
    <Form
         name="basic"
         onFinish={handleSubmit}
         form = {form}
     >
       <div className="rowBlock">
       <Col md={24} xs={24}>
       <Form.Item
        label="Округа"
             name="region"
             className="formItem"
             labelCol={{ span: 24 }}
             rules={[
                 {
                     required: true,
                     message: emptyInput("округа")
                 },
             ]}
         >
            <Select
        showSearch
        placeholder="Обрати округу"
        > 
        {regions?.map((o) => ( <Select.Option key={o.id} value={JSON.stringify(o)}>{o.regionName}</Select.Option>))}
        </Select>   
         </Form.Item>
         </Col>
         </div>
         <div className="rowBlock">
         <Col md={24} xs={24}>
       <Form.Item
             label="Рік подання"
             labelCol={{ span: 24 }}
             className="formItem"
             name="year"
             rules={[
                {
                    required: true,
                    message: emptyInput("року подання")
                },
            ]}
         >
           <Select
                showSearch
                options={years}
                placeholder="Обрати рік"
              />
         </Form.Item></Col></div>

        <div className={classes.row} >
        <Col md={24} xs={24}>
        <Form.Item label="Загальна характеристика діяльності осередків в області"  labelCol={{ span: 24 }} name="Characteristic" rules={[{ required: true, message: emptyInput() },{ max: 500, message: maxLength(500) }]} >       
        <TextArea className={classes.input} autoSize={{ minRows: 3, maxRows: 5 }} />
        </Form.Item></Col>
        </div>

        < div className={classes.row} >
        <Col md={24} xs={24}>
        < Form.Item label="Стан підготовки/реалізації стратегії округи, осередків округи"  labelCol={{ span: 24 }} name="StateOfPreparation" rules={[{ required: true, message: emptyInput() },{ max: 500, message: maxLength(500) }]} >
        <TextArea className={classes.input} autoSize={{ minRows: 3, maxRows: 5 }} />
        </Form.Item></Col>
        </ div>

        < div className={classes.row} >
        <Col md={24} xs={24}>
        < Form.Item label="Чи виконується стратегія у Вашій окрузі? Що допоможе її реалізувати?"  labelCol={{ span: 24 }} name="StatusOfStrategy" rules={[{ required: true, message: emptyInput() },{ max: 500, message: maxLength(500) }]} >
        <TextArea className={classes.input} autoSize={{ minRows: 3, maxRows: 5 }} />
        </Form.Item></Col>
        </ div>

        < div className={classes.row} >
        <Col md={24} xs={24}>
        < Form.Item label="Стан роботи із залученням волонтерів"  labelCol={{ span: 24 }} name="InvolvementOfVolunteers" rules={[{ required: true, message: emptyInput() },{ max: 500, message: maxLength(500) }]} >
        <TextArea className={classes.input} autoSize={{ minRows: 3, maxRows: 5 }} />
        </Form.Item></Col>
        </ div>

        < div className={classes.row} >
        <Col md={24} xs={24}>
        < Form.Item label="Які вишколи потрібні членам вашої округи? та  Які вишколи із вказаних ви можете провести самостійно?"  labelCol={{ span: 24 }}  name="TrainedNeeds" rules={[{ required: true, message: emptyInput() },{ max: 500, message: maxLength(500) }]} >
        <TextArea className={classes.input} autoSize={{ minRows: 3, maxRows: 5 }} />
        </Form.Item></Col></ div>

        
        < div className={classes.row} >
        <Col md={24} xs={24}>
        < Form.Item label="Чи отримають станиці державне фінансування або іншу підтримку від влади? Якщо так, то яку?"  labelCol={{ span: 24 }} name="PublicFunding" rules={[{ required: true, message: emptyInput() },{ max: 500, message: maxLength(500) }]} >
        <TextArea className={classes.input} autoSize={{ minRows: 3, maxRows: 5 }} />
        </Form.Item></Col></ div>

        < div className={classes.row} >
        <Col md={24} xs={24}>
        < Form.Item label="Чи співпрацюєте ви із церквою (вкажіть як саме, тип співпраці з церквою)"  labelCol={{ span: 24 }} name="ChurchCooperation" rules={[{ required: true, message: emptyInput() },{ max: 500, message: maxLength(500) }]} >
        <TextArea className={classes.input} autoSize={{ minRows: 3, maxRows: 5 }} />
        </Form.Item></Col></ div>

        < div className={classes.row} >
        <Col md={24} xs={24}>
        < Form.Item label="Чи займаються станиці фандрейзингом? Якщо так, то хто і в якому форматі?"  labelCol={{ span: 24 }} name="Fundraising" rules={[{ required: true, message: emptyInput() },{ max: 500, message: maxLength(500) }]} >
        <TextArea className={classes.input} autoSize={{ minRows: 3, maxRows: 5 }} />
        </Form.Item></Col></ div>

        < div className={classes.row} >
        <Col md={24} xs={24}>
        < Form.Item label="Участь (організація) у соціальних проектах"  labelCol={{ span: 24 }} name="SocialProjects" rules={[{ required: true, message: emptyInput() },{ max: 500, message: maxLength(500) }]} >
        <TextArea className={classes.input} autoSize={{ minRows: 3, maxRows: 5 }} />
        </Form.Item></Col></ div>

        < div className={classes.row} >
        <Col md={24} xs={24}>
        < Form.Item label="Проблемні ситуації, виклики, які мають негативний вплив на організацію на місцевому та національному рівні"  labelCol={{ span: 24 }} name="ProblemSituations" rules={[{ required: true, message: emptyInput() },{ max: 500, message: maxLength(500) }]} >
        <TextArea className={classes.input} autoSize={{ minRows: 3, maxRows: 5 }} />
        </Form.Item></Col></ div>

        < div className={classes.row} >
        <Col md={24} xs={24}>
        < Form.Item label="Вкажіть важливі потреби для розвитку округи та осередків"  labelCol={{ span: 24 }} name="ImportantNeeds" rules={[{ required: true, message: emptyInput() },{ max: 500, message: maxLength(500) }]} >
        <TextArea className={classes.input} autoSize={{ minRows: 3, maxRows: 5 }} />
        </Form.Item></Col></ div>

        <div className={classes.row} >
        <Col md={24} xs={24}>
        < Form.Item label="Розкажіть про ваші історії успіху, за цей період"  labelCol={{ span: 24 }} name="SuccessStories" rules={[{ required: true, message: emptyInput() },{ max: 500, message: maxLength(500) }]} >
        <TextArea className={classes.input} autoSize={{ minRows: 3, maxRows: 5 }} />
        </Form.Item></Col></div>

         <Form.Item style = {{ textAlign: "right"}}>
         <Button
          type="primary" className={classes.clearButton}  onClick={()=> {form.resetFields()}}
        >
         Відмінити
        </Button>

        <Button
         type="primary" htmlType="submit" 
        >
         Опублікувати
        </Button>

      </Form.Item> 
     </Form>
     </Modal>)
}

export default AddNewRegionReport;