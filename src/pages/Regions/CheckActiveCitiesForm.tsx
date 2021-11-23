import React, { useState, useEffect } from 'react';
import classes from './Form.module.css'
import {Col, Form, Select, Button, Avatar, Row, PageHeader } from 'antd';
import { redirectCities, removeRegion } from "../../api/regionsApi";
import { useParams, useHistory, Link, useRouteMatch } from 'react-router-dom';
import{
    emptyInput,
  } from "../../components/Notifications/Messages"
import "./CheckActiveCitiesForm.less";
import Title from "antd/lib/typography/Title";

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
                <Title level={1}>Округа не повинна містити:</Title>
                <Form.Item
                className={classes.formField}> 
                    {props.cities.length !== 0 ? (
                    <React.Fragment>
                        
                        <PageHeader 
                        title = "Дійсних членів округи"
                        className="site-page-header" 
                        />
                                <Row className= "cityItems" justify="center">
                                {props.cities.map((city: any) => ( 
                                    <Link to={"/userpage/main/"+city.id} target="_blank">
                                        <Col
                                        key={city.id}
                                        >
                                            <Avatar size={64} src={city.logo} />
                                            <div className = "name">{city.name}</div>
                                        </Col>
                                    </Link>
                                ))}
                                </Row> 
                        </React.Fragment>
                ) : null}
                    {props.admins.length !== 0 ? (
                        <React.Fragment>
                            <PageHeader 
                            title = "Членів проводу"
                            className="site-page-header" 
                            />
                                <Row className= "cityItems" justify="center">
                                    {props.admins.map((admin: any) => ( 
                                        <Link to={"/userpage/main/"+admin.userId} target="_blank">
                                            <Col  key={admin.id} >
                                                <Avatar size={64} src={admin.user.imagePath} />
                                                <div className = "name">{admin.user.firstName}</div>
                                            </Col>
                                        </Link>
                                    ))}
                                </Row> 
                        </React.Fragment>
                    ) : null}
                    {props.followers.length !== 0 ? (
                        <React.Fragment>
                            <PageHeader 
                            title = "Прихильників округи"
                            className="site-page-header" 
                            />
                                <Row className= "cityItems" justify="center">
                                {props.followers.map((follower: any) => ( 
                                    <Link to={"/cities"+follower.id} target="_blank">
                                        <Col
                                        key={follower.id}
                                        >
                                                <Avatar size={64} src={follower.logo} />
                                                <div className = "name">{follower.name}</div>
                                        </Col>
                                    </Link>
                                ))}
                                </Row> 
                            </React.Fragment>
                    ) : null}
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