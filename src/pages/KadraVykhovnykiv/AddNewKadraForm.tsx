import React, { useState, useEffect } from "react";
import classes from "./Form.module.css";
import ButtonCollapse from "../../components/ButtonCollapse/ButtonCollapse";
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Row,
  Col,
} from "antd";
import kadrasApi from "../../api/KadraVykhovnykivApi";
import adminApi from "../../api/adminApi";
import notificationLogic from '../../components/Notifications/Notification';
import NotificationBoxApi from '../../api/NotificationBoxApi';
import {getOnlyNums } from "../../models/GllobalValidations/DescriptionValidation";
import{
  emptyInput,
  maxNumber,
  minNumber,
} from "../../components/Notifications/Messages"
import KadraVykhovnykivApi from "../../api/KadraVykhovnykivApi";
import moment, { Moment } from "moment";

type FormAddKadraProps = {
    showModal: (visibleModal: boolean) => void;  
    onAdd: () => void;
}


 const AddNewKadraForm: React.FC<FormAddKadraProps> = (props: any)=>{
    const  { showModal, onAdd } = props;
    const [form] = Form.useForm();
    const [users, setUsers] = useState<any[]>([{
        user:{
            id: '',
            firstName: '',
            lastName:'',
            birthday:''
        },
        regionName:'',
        cityName:'',
        clubName:'',
        userPlastDegreeName:'',
        userRoles:''
        
      }])
    const [loadingUserStatus, setLoadingUserStatus] = useState(false);    
    const [types, setTypes] = useState<any[]>([{
        id: '',
        name: '',
      }])
    const [userKadrasMap, setUserKadrasMap] = useState<Map<string, boolean>>(new Map<string, boolean>());
    const dateFormat = "DD.MM.YYYY";

     const createNotifications = async (userId : string, kadraTypeName : string) => {
        await NotificationBoxApi.createNotifications(
            [userId],
            `Ваc було додано в кадру виховників: '${kadraTypeName}'. `,
            NotificationBoxApi.NotificationTypes.UserNotifications,
            `/kadra`,
            `Переглянути`
            );

        await NotificationBoxApi.getCitiesForUserAdmins(userId)
            .then(res => {
                res.cityRegionAdmins.length !== 0 &&
                res.cityRegionAdmins.forEach(async (cra) => {
                    await NotificationBoxApi.createNotifications(
                        [cra.cityAdminId, cra.regionAdminId],
                        `${res.user.firstName} ${res.user.lastName}, який є членом станиці: '${cra.cityName}' був доданий в кадру виховників: '${kadraTypeName}'. `,
                        NotificationBoxApi.NotificationTypes.UserNotifications,
                        `/kadra`,
                        `Переглянути`
                        );
                })                
            });
     }

     const onUserSelect = async (userId: any) => {
        types.map(async (kt) => {
            await KadraVykhovnykivApi.doesUserHaveStaff(JSON.parse(userId).id, kt.id).then(response => {
                setUserKadrasMap(new Map(userKadrasMap.set(kt.name, response.data)));
            });
         });
         form.resetFields(['KadraVykhovnykivType']);
     }

      const handleSubmit = async (values : any)=>{
        const newKadra  : any= {
            id: 0,

            userId: JSON.parse(values.userId).id,

            KadraVykhovnykivTypeId:JSON.parse(values.KadraVykhovnykivType).id,

            dateOfGranting: moment(values.dateOfGranting).format("YYYY-MM-DD HH:mm:ss"),

            numberInRegister: values.numberInRegister,
        }

         kadrasApi.doesRegisterNumberExist(newKadra.numberInRegister).then(responce=>{
            if (responce.data === false){
                 kadrasApi.doesUserHaveStaff(newKadra.userId,newKadra.KadraVykhovnykivTypeId).then(  async response=>{

                    if(response.data === false){
                      await kadrasApi.createKadra(newKadra)
                      form.resetFields();
                      onAdd();
                      notificationLogic('success', "Користувач успішно отримав відзнаку");

                      await createNotifications(newKadra.userId, JSON.parse(values.KadraVykhovnykivType).name);
                     }
                     else{
                      notificationLogic('error', "Користувач вже отримував цю відзнаку");
                      form.resetFields();
                      onAdd();
                     }
          
                 })
            }
                else{
                    notificationLogic('error', "Номер реєстру вже зайнятий");
                    form.resetFields();
                    onAdd();
                }
        });
    }

  const backgroundColor = (user: any) => {
    return user.isInLowerRole ? { backgroundColor : '#D3D3D3' } : { backgroundColor : 'white' };
  }

  const handleClose = () => {
   showModal(false);
  };

  const handleCancel = () => {
    form.resetFields();
    showModal(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      await kadrasApi.getAllKVTypes().then((response) => {
        setTypes(response.data);
      });
      setLoadingUserStatus(true);      
      await adminApi.getUsersForTable().then((response) => {
        setUsers(response.data);
        setLoadingUserStatus(false);
      });
    };
    fetchData();
  }, []);

  return (<>
    <ButtonCollapse handleClose={handleClose}/>
    <Form name="basic" onFinish={handleSubmit} form={form} id='area' style={{position: 'relative'}}>
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item
            className={classes.formField}
            label="Користувач"
            labelCol={{ span: 24 }}
            name="userId"
            rules={[
              {
                required: true,
                message: emptyInput(),
              },
            ]}
          >
            <Select 
              showSearch 
              className={classes.selectField}
              onSelect={onUserSelect}
              loading={loadingUserStatus}        
              getPopupContainer={(triggerNode) => triggerNode.parentNode}      
              >
              {users?.map((o) => (
                <Select.Option 
                    key={o.id}
                    value={JSON.stringify(o)}
                    style={backgroundColor(o)}
                    disabled={o.isInLowerRole}
                    >
                  {o.firstName + " " + o.lastName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item
            className={classes.formField}
            label="Тип кадри"
            labelCol={{ span: 24 }}
            name="KadraVykhovnykivType"
            rules={[
              {
                required: true,
                message: emptyInput(),
              },
            ]}
          >
            <Select 
              filterOption={false} 
              className={classes.inputField}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
            >
              {types?.map((o) => (
                <Select.Option 
                  key={o.id} 
                  value={JSON.stringify(o)}
                  disabled={userKadrasMap.get(o.name)}
                  style={{ backgroundColor: userKadrasMap.get(o.name) ? '#D3D3D3' : 'white' }}
                  >
                  {o.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item
            className={classes.formField}
            label="Дата вручення"
            labelCol={{ span: 24 }}
            name="dateOfGranting"
            rules={[
              {
                required: true,
                message: emptyInput(),
              },
            ]}
          >
            <DatePicker 
                format={dateFormat}
                className={classes.selectField}
                getPopupContainer = {() => document.getElementById('area')! as HTMLElement}
                popupStyle={{position: 'absolute'}}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item
            className={classes.formField}
            label="Номер в реєстрі"
            labelCol={{ span: 24 }}
            name="numberInRegister"
            rules={[
                {
                  required: true,
                  message: emptyInput(),
                },
                {
                  max: 5,
                  message: maxNumber(99999),
                },
                {
                  validator: async (_ : object, value: number) =>
                  value && !isNaN(value) 
                          ? await KadraVykhovnykivApi
                            .doesRegisterNumberExist(value)
                            .then(response => response.data === false)
                              ? Promise.resolve()
                                : Promise.reject('Цей номер уже зайнятий')
                                : Promise.reject()
                }
              ]}>
            <Input
              onChange={(e) => {
                form.setFieldsValue({
                  numberInRegister: getOnlyNums(e.target.value),
                });
              }}
              autoComplete = "off"
              min={1}
              max={99999}
              className={classes.inputField}
              maxLength = {7}
            />
          </Form.Item>
        </Col>
      </Row>      
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item>
            <div className={classes.cardButton}>
              <Button key="back" onClick={handleCancel} className={classes.buttons}>
                Відмінити
              </Button>
              <Button type="primary" htmlType="submit" className={classes.buttons}>
                Опублікувати
              </Button>
            </div>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  </>
  );
};


export default AddNewKadraForm;
