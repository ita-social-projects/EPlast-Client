import React, { useEffect, useState } from 'react';
import { Form, Input, Avatar, Upload, Button, Select, AutoComplete,Space,Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import styles from './EditUserPage.module.css';
import { checkNameSurName, checkPhone } from '../../SignUp/verification';
import {checkField, checkAdress} from '../EditUserPage/VerificationUserProfile';
import { getBase64 } from './Services';
import {Data,Nationality,Religion,Degree,Gender} from './Interface';
import avatar from '../../../assets/images/default_user_image.png';
import userApi from '../../../api/UserApi';


export default function () {
    const [form] = Form.useForm();

    const [nationality,setNationality]=useState<Nationality>();
    const [religion,setReligion]=useState<Religion>();
    const [degree,setDegree]=useState<Degree>();
    const [gender,setGender]=useState<Gender>();
    const [placeOfStudyID,setPlaceOfStudyID]=useState<any>();
    const [specialityID,setSpecialityID]=useState<any>();
    const [placeOfWorkID,setPlaceOfWorkID]=useState<any>();
    const [positionID,setPositionID]=useState<any>();

    const [userAvatar, setUserAvatar] = useState<any>();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<Data>()
    useEffect(()=>{
      const fetchData = async () => {
        await userApi.edit('4906ff3f-c236-4b53-9924-3aa9aec63b4a').then(async response =>{
          setData(response.data);
          if(response.data.user.imagePath!==undefined)
          {
            await userApi.getImage(response.data.user.imagePath).then((q: { data: any; }) =>{
              setUserAvatar(q.data);
            })
          }
          setLoading(true);
          form.setFieldsValue({
            firstName:response.data.user.firstName,
            lastName:response.data.user.lastName,
            fatherName:response.data.user.fatherName, 
            phoneNumber: response.data.user.phoneNumber,
            nationalityName: response.data.user.nationality.name,
            birthday: response.data.user.birthday,
            genderName: response.data.user.gender.name,
            placeOfStudy: response.data.user.education.placeOfStudy,
            speciality: response.data.user.education.speciality,
            degreeName: response.data.user.degree.name,
            placeOfWork: response.data.user.work.placeOfWork,
            religionName: response.data.user.religion.name,
            positionOfWork: response.data.user.work.positionOfWork,
            address:response.data.user.address
          });
          setNationality(response.data.user.nationality);
          setReligion(response.data.user.religion);
          setDegree(response.data.user.degree);
          setPlaceOfStudyID(response.data.educationView.placeOfStudyID);
          setSpecialityID(response.data.educationView.specialityID);
          setPlaceOfWorkID(response.data.workView.placeOfWorkID);
          setPositionID(response.data.workView.positionID);
          setGender(response.data.user.gender);
        })
      };
      fetchData();
    },[form]);

  const validationSchema = {
    name: [
      { required: true, message: "Ім'я є обов'язковим" },
      {max:25, message:'Максимальна довжина - 25 символів'},
      { validator: checkNameSurName },
    ],
    surName: [
      { required: true, message: "Прізвище є обов'язковим" },
      { max:25, message:'Максимальна довжина - 25 символів'},
      { validator: checkNameSurName },
    ],
    fatherName: [
      {max:25, message:'Максимальна довжина - 25 символів'},
      { validator: checkField },
    ],
    degree: [
      {max:30, message:'Максимальна довжина - 30 символів'},
      { validator: checkField },
    ],
    placeOfStudy: [
      {max:50, message:'Максимальна довжина - 50 символів'},
      { validator: checkField },
    ],
    speciality: [
      {max:50, message:'Максимальна довжина - 50 символів'},
      { validator: checkField },
    ],
    nationality: [
      {max:25, message:'Максимальна довжина - 25 символів'},
      { validator: checkField },
    ],
    religion: [
      {max:25, message:'Максимальна довжина - 25 символів'},
      { validator: checkField },
    ],
    placeOfWork: [
      {max:30, message:'Максимальна довжина - 30 символів'},
      { validator: checkField },
    ],
    position: [
      {max:30, message:'Максимальна довжина - 30 символів'},
      { validator: checkField },
    ],
    adress: [
      {max:30, message:'Максимальна довжина - 30 символів'},
      { validator: checkAdress },
    ],
    
    phone: [{ validator: checkPhone }],
  };
  // const  onChangeBirthday=(date:any, dateString:any)=> {
  //   console.log(date, dateString);
  // };

  const uploadPhotoConfig = {
    name: 'file',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info: any) {
      if (info.file.status === 'done') {
        getBase64(info.file.originFileObj, (imageUrl: any) => {
          setUserAvatar(imageUrl);
        });
      } else if (info.file.status === 'removed') {
        setUserAvatar(avatar);
      }
    },
  };

  const { name, headers, onChange } = uploadPhotoConfig;
  
  const handleOnChangeNationality =(value:any,event:any)=>{
    if(event.key===undefined)
    {
      setNationality({
        "id":0,
        "name":value
      })
    }
    else
    {
      setNationality({
        "id":parseInt(event.key) ,
        "name":event.value
      })
    }
  };
  const handleOnChangeReligion =(value:any,event:any)=>{
    
    if(event.key===undefined)
    {
      setReligion({
        "id":0,
        "name":value
      })
    }
    else
    {
      setReligion({
        "id":parseInt(event.key),
        "name":event.value
      })
    }
  };
  const handleOnChangeDegree =(value:any,event:any)=>{
    if(event.key===undefined)
    {
      setDegree({
        "id":0,
        "name":value
      })
    }
    else
    {
      setDegree({
        "id":parseInt(event.key),
        "name":event.value
      })
    }
  };
  const handleOnChangePlaceOfStudy =(value:any,event:any)=>{
    
    if(event.key===undefined)
    {
      setPlaceOfStudyID(null);
    }
    else
    {
      setPlaceOfStudyID(parseInt(event.key))
    }
  };
  const handleOnChangeSpeciality =(value:any,event:any)=>{
    
    if(event.key===undefined)
    {
      setSpecialityID(null);
    }
    else
    {
      setSpecialityID(parseInt(event.key))
    }
  };
  const handleOnChangePlaceOWork =(value:any,event:any)=>{
    if(event.key===undefined)
    {
      setPlaceOfWorkID(null);
    }
    else
    {
      setPlaceOfWorkID(parseInt(event.key))
    }
  };
  const handleOnChangePosition =(value:any,event:any)=>{
    console.log(value,event);
    if(event.key===undefined)
    {
      setPositionID(null);
    }
    else
    {
      setPositionID(parseInt(event.key))
    }
  };

  const handleOnChangeGender=(value:any)=>{
    setGender(JSON.parse(value))
  };


  const handleSubmit = async (values : any)=>{
    const newUserProfile={
      user:{
        "id":data?.user?.id,
        "userProfileID":data?.user.userProfileID,
        "firstName":values.firstName,
        "lastName": values.lastName,
        "fatherName": values.fatherName,
        "phoneNumber": values.phoneNumber,
        "birthday": values.birthday,
        
        "degree": {
          "id":degree?.id,
          "Name":degree?.name,       
        },
        "nationality":{
           "id":nationality?.id,
           "Name":nationality?.name,       
        },
        "religion": {
          "id":religion?.id,
          "Name":religion?.name,    
        },
        "education":{
          "placeOfStudy": values.placeOfStudy,
          "speciality": values.speciality,
        },
        "work":{
          "placeOfWork": values.placeOfWork,
          "position": values.positionOfWork,
        },
        "gender": gender,
        "address": values.address,
      },
      "imageBase64":userAvatar,
      "educationView":{
        "placeOfStudyID":placeOfStudyID,
        "specialityID":specialityID,
      },
      "workView":{
        "placeOfWorkID":placeOfWorkID,
        "positionID":positionID,
      },
   }
    await userApi.put(newUserProfile).then(res => console.log(res)).catch(error => console.log(error));
    window.location.reload(false);
  }
  return loading === false ? (
    <div className={styles.spaceWrapper}>
      <Space className={styles.loader} size="large">
        <Spin size="large" />
      </Space>
    </div>
    
  ) : ( 
    <div className={styles.mainContainer}>
       <Form  form={form} name="basic" className={styles.formContainer} onFinish={handleSubmit}	>
        <div className={styles.avatarWrapper}>
          <Avatar size={256} src={userAvatar} className="avatarElem" />
          <Upload name={name} headers={headers} onChange={onChange} className={styles.changeAvatar}>
            <Button className={styles.changeAvatarBtn}>
              <UploadOutlined /> Вибрати
            </Button>
          </Upload>
        </div>
        <div className={styles.allFields}>
          <h2 className={styles.title}>Редагування профілю</h2>
          <div className={styles.rowBlock}>
            <Form.Item
              label="Ім`я"
              name="firstName"
              rules={validationSchema.name}
              className={styles.formItem}
            >
              <Input  className={styles.dataInput}/>
            </Form.Item>
            <Form.Item
              label="Прізвище"
              name="lastName"
              rules={validationSchema.surName}
              className={styles.formItem}
            >
              <Input className={styles.dataInput} />
            </Form.Item>
          </div>
          <div className={styles.rowBlock}>
            <Form.Item
              label="По-батькові"
              name="fatherName"
              rules={validationSchema.fatherName}
              className={styles.formItem}
            >
              <Input  className={styles.dataInput}/>
            </Form.Item>
            <Form.Item 
              label="Стать" 
              name="genderName"  
              className={styles.formItem}
              >
              <Select className={styles.dataInput} onChange={handleOnChangeGender}>
                {data?.genders.map(p => ( <Select.Option  key={p.id} value={JSON.stringify(p)}>{p.name}</Select.Option>))}
              </Select>
            </Form.Item>
          </div>
         
          <div className={styles.rowBlock}>
            <Form.Item
              label="Дата народження"
              name="birthday"
            //  initialValue={initialValues.birth}
              className={styles.formItem}
            >
              {/* <DatePicker format = "YYYY-MM-DD"/> */}
              <Input className={styles.dataInput}/>
            </Form.Item>
           
            <Form.Item
              label="Номер телефону"
              name="phoneNumber"
              className={styles.formItem}
             // rules={validationSchema.phone}
            >
              {/* <MaskedInput mask="00 00 000 00 00" className={styles.dataInput}/> */}
               <Input className={styles.dataInput} />
            </Form.Item>
          </div>
          <div className={styles.rowBlock}>
            <Form.Item
              label="Національність"
              name="nationalityName"
              rules={validationSchema.nationality}
              className={styles.formItem}
            >
              <AutoComplete className={styles.dataInput} filterOption={true} onChange={handleOnChangeNationality}  >
                {data?.nationalities.map(p => ( <Select.Option  key={p.id} value={p.name}>{p.name}</Select.Option>))}
              </AutoComplete>
            </Form.Item>
            <Form.Item
              label="Віровизнання"
              name="religionName"
              className={styles.formItem}
              rules={validationSchema.religion}
            >
             <AutoComplete className={styles.dataInput} filterOption={true} onChange={handleOnChangeReligion}  >
                {data?.religions.map(p => ( <Select.Option  key={p.id} value={p.name}>{p.name}</Select.Option>))}
              </AutoComplete>
            </Form.Item>
           
          </div>
          
          <div className={styles.rowBlock}>
            <Form.Item
              label="Навчальний заклад"
              name="placeOfStudy"
              rules={validationSchema.placeOfStudy}
              className={styles.formItem}
            >
             <AutoComplete className={styles.dataInput} filterOption={true} onChange={handleOnChangePlaceOfStudy}  >
                {data?.educationView.placeOfStudyList.map(p => ( <Select.Option  key={p.id} value={p.placeOfStudy}>{p.placeOfStudy}</Select.Option>))}
              </AutoComplete>
            </Form.Item>
            <Form.Item
              label="Спеціальність"
              name="speciality"
              rules={validationSchema.speciality}
              className={styles.formItem}
            >
              <AutoComplete className={styles.dataInput} filterOption={true}  onChange={handleOnChangeSpeciality}  >
                {data?.educationView.specialityList.map(p => ( <Select.Option  key={p.id} value={p.speciality}>{p.speciality}</Select.Option>))}
              </AutoComplete>
            </Form.Item>
          </div>
          <div className={styles.rowBlock}>
            <Form.Item
              label="Навчальний ступінь"
              name="degreeName"
              rules={validationSchema.degree}
              className={styles.formItem}
            >
              <AutoComplete className={styles.dataInput} filterOption={true} onChange={handleOnChangeDegree}  >
                {data?.degrees.map(p => ( <Select.Option  key={p.id} value={p.name}>{p.name}</Select.Option>))}
              </AutoComplete>
            </Form.Item>
            <Form.Item
              label="Місце праці"
              name="placeOfWork"
              rules={validationSchema.placeOfWork}
              className={styles.formItem}
            >
             <AutoComplete className={styles.dataInput} filterOption={true}  onChange={handleOnChangePlaceOWork}  >
                {data?.workView.placeOfWorkList.map(p => ( <Select.Option  key={p.id} value={p.placeOfwork}>{p.placeOfwork}</Select.Option>))}
              </AutoComplete>
            </Form.Item>
          </div>
          <div className={styles.rowBlock}>
            <Form.Item
              label="Посада"
              name="positionOfWork"
              rules={validationSchema.position}
              className={styles.formItem}
            >
               <AutoComplete className={styles.dataInput} filterOption={true} onChange={handleOnChangePosition}  >
                {data?.workView.positionList.map(p => ( <Select.Option  key={p.id} value={p.position}>{p.position}</Select.Option>))}
              </AutoComplete>
            </Form.Item>
            <Form.Item
              label="Адреса проживання"
              name="address"
              rules={validationSchema.adress}
              className={styles.formItem}
            >
              <Input className={styles.dataInput} />
            </Form.Item>
          </div>
          <Button className={styles.confirmBtn} htmlType="submit">
            Підтердити
          </Button>
        </div>
      </Form>
    </div>
  );
}
