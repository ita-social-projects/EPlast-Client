import React, { useState, useEffect } from 'react';
import classes from './Form.module.css'
import {Col, Form, Select, Button, Avatar, Row, PageHeader } from 'antd';
import { redirectCities, removeRegion } from "../../../api/regionsApi";
import { useParams, useHistory, Link, useRouteMatch } from 'react-router-dom';
import{
    emptyInput,
  } from "../../../components/Notifications/Messages"
import "./CheckActiveMembersForm.less";
import Title from "antd/lib/typography/Title" ;

type CheckActiveCitiesForm = {
    onAdd: () => void;
}

const CheckActiveMembersForm  = (props: any)=>{
    
    const  { onAdd } = props;
    const [form] = Form.useForm();
    const { id } = useParams();
    const { url } = useRouteMatch()

    const handleSubmit = async ()=>{
        onAdd();
        }

    
    return <Form
            name="basic"
            onFinish={handleSubmit}
            form = {form}>
                <Form.Item
                className={classes.formField}
                > 
                <Title level={1}>Курінь не повинен містити:</Title>
                    {props.members.length !== 0 ? (
                            <React.Fragment>
                                <PageHeader
                                    title = "Дійсних членів куреня"
                                    className="site-page-header" 
                                />
                                    <Row className= "cityItems" justify="center">
                                        {props.members.map((member: any) => ( 
                                            <Link to={"/userpage/main/"+member.userId} target="_blank">
                                                <Col
                                                key={member.id}
                                                >
                                                    <Avatar size={64} src={member.user.imagePath} />
                                                    <div className = "name">{member.user.firstName}</div>
                                                </Col>
                                            </Link>
                                        ))}
                                    </Row>
                            </React.Fragment>
                    ) : null }
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
                    ) : null }
                    {props.followers.length !== 0 ? (
                            <React.Fragment>
                            <PageHeader
                                title = "Прихильників куреня: "
                                className="site-page-header"
                            />
                                <Row className= "cityItems" justify="center">
                                    {props.followers.map((follower: any) => (
                                        <Link to={"/userpage/main/"+follower.userId} target="_blank">
                                            <Col  key={follower.id} >
                                                    <Avatar size={64} src={follower.user.imagePath} />
                                                    <div className = "name">{follower.user.firstName}</div>
                                            </Col>
                                        </Link>
                                    ))}            
                                </Row>
                            </React.Fragment>
                    ) : null }
                </Form.Item>
                <Form.Item style = {{ textAlign: "right"}}>
                    <Button
                        type="primary"
                        htmlType="submit"
                    >
                    OK
                    </Button>
                </Form.Item>
            </Form>;
}

export default CheckActiveMembersForm;