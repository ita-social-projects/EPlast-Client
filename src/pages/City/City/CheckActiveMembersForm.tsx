import React, { useState, useEffect } from 'react';
import classes from './Form.module.css'
import {Col, Form, Select, Button, Avatar, Row, PageHeader } from 'antd';
import { redirectCities, removeRegion } from "../../../api/regionsApi";
import { useParams, useHistory, Link, useRouteMatch } from 'react-router-dom';
import "./CheckActiveMembersForm.less";
import Title from 'antd/lib/skeleton/Title';
type CheckActiveCitiesForm = {
    onAdd: () => void;
}

const CheckActiveMembersForm  = (props: any)=>{
    
    const  { onAdd } = props;
    const [form] = Form.useForm();
    const { id } = useParams();
    const { url } = useRouteMatch()
    const history = useHistory();

    const [activeCities, setActiveCities] = useState<any[]>([]);
    const handleSubmit = async ()=>{
        onAdd();
    }
       
    return <Form
            name="basic"
            onFinish={handleSubmit}
            form = {form}
            >
            <Form.Item
            className={classes.formField}
            > 
                {props.members.length !== 0 ? (
                    <React.Fragment>
                        <PageHeader 
                            title = "Необхідно відкріпити членів: "
                            className="site-page-header" 
                        />
                            <Row className= "cityItems" justify="center">
                                {props.members.map((member: any) => ( 
                                    <Link to={"/userpage/main/"+member.userId} target="_blank">
                                        <Col
                                        key={member.id}>
                                            <Avatar size={64} src={member.user.imagePath} />
                                            <div className = "name">{member.user.firstName}</div>
                                        </Col>
                                    </Link>
                                ))}
                            </Row> 
                    </React.Fragment>
                ) : null}
                {props.admins.length !== 0 ? (
                    <React.Fragment>
                        <PageHeader 
                            title = "Необхідно відкріпити членів проводу: "
                            className="site-page-header" 
                        />
                            <Row className= "cityItems" justify="center">
                                {props.admins.map((admin: any) => ( 
                                    <Link to={"/userpage/main/"+admin.userId} target="_blank">
                                        <Col  key={admin.id}>
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
                            title = "Необхідно відкріпити прихильників:"
                            className="site-page-header" 
                        />
                            <Row className= "cityItems" justify="center">
                                {props.followers.map((follower: any) => ( 
                                    <Link to={"/userpage/main/"+follower.userId} target="_blank">
                                        <Col
                                        key={follower.id}>
                                            <Avatar size={64} src={follower.user.imagePath} />
                                            <div className = "name">{follower.user.firstName}</div>
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

export default CheckActiveMembersForm;