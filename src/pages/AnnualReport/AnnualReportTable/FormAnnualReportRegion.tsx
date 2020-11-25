import React, { useState, useEffect } from 'react';
import classes from './Form.module.css'
import { Form, AutoComplete, Select, Button, Modal, Input } from 'antd';
import regionsApi from '../../../api/regionsApi';
import notificationLogic from "../../../components/Notifications/Notification";
import { useHistory } from 'react-router-dom';
import {successfulCreateAction, tryAgain, emptyInput} from "../../../components/Notifications/Messages"
import { maxLength } from '../../../components/Notifications/Messages';
import TextArea from 'antd/lib/input/TextArea';
import RegionAnnualReportQuestions from '../Interfaces/RegionAnnualReportQuestions';

interface Props {
  visibleModal: boolean,
  handleOk: () => void,
}


 const AddNewRegionReport = (props: Props)=>{
    const { visibleModal, handleOk } = props;
    const history = useHistory();
    const [form] = Form.useForm();
    const [regions, setRegions] = useState<any[]>([{
        id:'',
        regionName:''
      }])

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
          }
          regionsApi.createRegionAnnualReport(JSON.parse(values.region).id,
           values.year, regionQuestions)
          .then(() => {
            notificationLogic("success", successfulCreateAction("Річний звіт"));
            window.location.reload();
          })
          .catch(() => {
            notificationLogic("error", tryAgain);
          });    
          form.resetFields(); 
        }

      useEffect(() => {
        const fetchData = async () => {
            await regionsApi.GetAllRegions().then(response => {
                setRegions(response.data);
            })
        }
        fetchData();
      }, [])

    return (<Modal
    title='Оберіть округ та рік для створення річного звіту'
    onCancel={handleOk}
    visible={visibleModal}
    footer={null} >
    <Form
         name="basic"
         onFinish={handleSubmit}
         form = {form}
     >
       <div>
         <Form.Item
         label="Округ"
             name="region"
             rules={[
                 {
                     required: true,
                     message: emptyInput("округ")
                 },
             ]}
         >
            <Select
        showSearch
        > 
        {regions?.map((o) => ( <Select.Option key={o.id} value={JSON.stringify(o)}>{o.regionName}</Select.Option>))}
        </Select>   
         </Form.Item>
         </div>
        <div>
         <Form.Item
             label="Рік подання"
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
        >
             <AutoComplete
            options={[
              { value: 2019 },
              { value: 2020 },
              { value: 2021 },
              { value: 2022 },
              { value: 2023 },
              { value: 2024 },
              { value: 2025 },
              { value: 2026 }
            ]}   
          placeholder={"Оберіть рік"}
          ></AutoComplete></Select>
         </Form.Item></div>

        <div className={classes.row} >
        <h3>Загальна характеристика діяльності осередків в області </h3>
        < Form.Item name="Characteristic" rules={[{ required: true, message: emptyInput() },{ max: 50, message: maxLength(50) }]} >
        <TextArea className={classes.input}  />
        </Form.Item>
        </div>

        < div className={classes.row} >
        <h3>Стан підготовки/реалізації стратегії округи, осередків округи</h3>
        < Form.Item name="StateOfPreparation" rules={[{ required: true, message: emptyInput() },{ max: 50, message: maxLength(50) }]} >
        <TextArea className={classes.input} autoSize={{ minRows: 3, maxRows: 5 }} />
        </Form.Item>
        </ div>

        < div className={classes.row} >
        <h3>Чи виконується стратегія у Вашій окрузі? Що допоможе її реалізувати?</h3>
        < Form.Item name="StatusOfStrategy" rules={[{ required: true, message: emptyInput() },{ max: 50, message: maxLength(50) }]} >
        <TextArea className={classes.input} autoSize={{ minRows: 3, maxRows: 5 }} />
        </Form.Item>
        </ div>

        < div className={classes.row} >
        <h3>Стан роботи із залученням волонтерів</h3>
        < Form.Item name="InvolvementOfVolunteers" rules={[{ required: true, message: emptyInput() },{ max: 50, message: maxLength(50) }]} >
        <TextArea className={classes.input} autoSize={{ minRows: 3, maxRows: 5 }} />
        </Form.Item>
        </ div>

        < div className={classes.row} >
        <h3>Які вишколи потрібні членам вашої округи? та  Які вишколи із вказаних ви можете провести самостійно?</h3>
        < Form.Item name="TrainedNeeds" rules={[{ required: true, message: emptyInput() },{ max: 50, message: maxLength(50) }]} >
        <TextArea className={classes.input} autoSize={{ minRows: 3, maxRows: 5 }} />
        </Form.Item></ div>

        
        < div className={classes.row} >
        <h3>Чи отримають станиці державне фінансування або іншу підтримку від влади? Якщо так, то яку?</h3>
        < Form.Item name="PublicFunding" rules={[{ required: true, message: emptyInput() },{ max: 50, message: maxLength(50) }]} >
        <TextArea className={classes.input} autoSize={{ minRows: 3, maxRows: 5 }} />
        </Form.Item></ div>

        < div className={classes.row} >
        <h3>Чи співпрацюєте ви із церквою (вкажіть як саме, тип співпраці з церквою)</h3>
        < Form.Item name="ChurchCooperation" rules={[{ required: true, message: emptyInput() },{ max: 50, message: maxLength(50) }]} >
        <TextArea className={classes.input} autoSize={{ minRows: 3, maxRows: 5 }} />
        </Form.Item></ div>

        < div className={classes.row} >
        <h3>Чи займаються станиці фандрейзингом? Якщо так, то хто і в якому форматі?</h3>
        < Form.Item name="Fundraising" rules={[{ required: true, message: emptyInput() },{ max: 50, message: maxLength(50) }]} >
        <TextArea className={classes.input} autoSize={{ minRows: 3, maxRows: 5 }} />
        </Form.Item></ div>

        < div className={classes.row} >
        <h3>Участь (організація) у соціальних проектах</h3>
        < Form.Item name="SocialProjects" rules={[{ required: true, message: emptyInput() },{ max: 50, message: maxLength(50) }]} >
        <TextArea className={classes.input} autoSize={{ minRows: 3, maxRows: 5 }} />
        </Form.Item></ div>

        < div className={classes.row} >
        <h3>Проблемні ситуації, виклики, які мають негативний вплив на організацію на місцевому та національному рівні.</h3>
        < Form.Item name="ProblemSituations" rules={[{ required: true, message: emptyInput() },{ max: 50, message: maxLength(50) }]} >
        <TextArea className={classes.input} autoSize={{ minRows: 3, maxRows: 5 }} />
        </Form.Item></ div>

        < div className={classes.row} >
        <h3>Вкажіть важливі потреби для розвитку округи та осередків</h3>
        < Form.Item name="ImportantNeeds" rules={[{ required: true, message: emptyInput() },{ max: 50, message: maxLength(50) }]} >
        <TextArea className={classes.input} autoSize={{ minRows: 3, maxRows: 5 }} />
        </Form.Item></ div>

        <div className={classes.row} >
        <h3>Розкажіть про ваші історії успіху, за цей період</h3>
        < Form.Item name="SuccessStories" rules={[{ required: true, message: emptyInput() },{ max: 50, message: maxLength(50) }]} >
        <TextArea className={classes.input} autoSize={{ minRows: 3, maxRows: 5 }} />
        </Form.Item></div>

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