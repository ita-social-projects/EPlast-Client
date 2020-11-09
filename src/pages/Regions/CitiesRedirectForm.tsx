import React, { useState, useEffect } from 'react';
import classes from './Form.module.css'
import { Form, Input, DatePicker, AutoComplete, Select, Button } from 'antd';
import notificationLogic from '../../components/Notifications/Notification';
import {GetAllRegions, redirectCities, removeRegion } from "../../api/regionsApi";
import { useParams, useHistory } from 'react-router-dom';
import { removeCity } from '../../api/citiesApi';


type CitiesRedirectForm = {
    onAdd: () => void;
}



const CitiesRedirectForm  = (props: any)=>{
    const  { onAdd } = props;
    const [form] = Form.useForm();
    const { id } = useParams();
    const history = useHistory();

    const [regions, setRegions] = useState<any[]>([{
        id:'',
        regionName:''
    }])
     

      const handleSubmit = async (values : any)=>{
        const newRegion  : any= {
            id: 0,
            regionId: JSON.parse(values.regionId).id,
        }

        await redirectCities(id,JSON.parse(values.regionId).id);

        await removeRegion(id);

        onAdd();

        history.push('/regions');
        
        }

      useEffect(() => {
        const fetchData = async () => {
            await GetAllRegions().then(response => {
                setRegions(response.data);
            })
        }
        fetchData();
      }, [])



    return <Form
         name="basic"
         onFinish={handleSubmit}
         form = {form}
     >
         <Form.Item
             className={classes.formField}
             label="Округ"
             name="regionId"

             rules={[
                 {
                     required: true,
                     message: 'Це поле має бути заповненим'
                 },
             ]}
         >
            <Select
        showSearch
        className={classes.inputField}
        >
           
        {regions?.map((o) => ( <Select.Option key={o.id} value={JSON.stringify(o)}>{o.regionName}</Select.Option>))}
        </Select>
             
         </Form.Item>

        
         <Form.Item style = {{ textAlign: "right"}}>
      
        <Button
         type="primary" htmlType="submit" 
        >
         OK
        </Button>

      </Form.Item> 
        
     </Form>;


}

export default CitiesRedirectForm;