import React, { useState, useEffect } from 'react';
import classes from './Form.module.css'
import {Col, Form, Select, Button, Avatar, Row } from 'antd';
import { redirectCities, removeRegion } from "../../api/regionsApi";
import { useParams, useHistory, Link, useRouteMatch } from 'react-router-dom';
import{
    emptyInput,
  } from "../../components/Notifications/Messages"
import "./CheckActiveCitiesForm.less";

type CheckActiveCitiesForm = {
    onAdd: () => void;
}

const CheckActiveCitiesForm  = (props: any)=>{
    const  { onAdd } = props;
    const [form] = Form.useForm();
    const { id } = useParams();
    const { url } = useRouteMatch()
    const history = useHistory();

    const [activeCities, setActiveCities] = useState<any[]>([]);
    const handleSubmit = async ()=>{
        onAdd();
        }
    const GetActiveCities = async () => {
        for (let i = 0; i < props.cities.length; i++) {
           if (props.cities[i].cityMembers.length != 0) {
                setActiveCities(activeCities => [...activeCities,  props.cities[i]])
           }
        } 
    }   

    useEffect(() => {
        GetActiveCities();
    }, [])

    return <Form
         name="basic"
         onFinish={handleSubmit}
         form = {form}
     >
         <Form.Item
             className={classes.formField}
         >
             <div>Спочатку відкріпіть станиці з активними членами: </div>
             <Row className= "cityItems" justify="space-between">
                {activeCities?.map((o) => ( 
                    <Link to={"/cities/"+o.id} target="_blank">
                        <Col
                         key={o.id}
                        >
                            <Avatar size={64} src={o.logo} />
                            <div className="cityName">{o.name}</div>
 
                        </Col>
                    </Link>
                ))}
            </Row> 
         </Form.Item>
        <Form.Item style = {{ textAlign: "center"}}>
            <Button
            type="primary" 
            htmlType="submit" 
            >
            OK
            </Button>
        </Form.Item> 
        
     </Form>;


}

export default CheckActiveCitiesForm;