import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Avatar,
  Upload,
  Button,
  Select,
  AutoComplete,
  DatePicker,
  Popconfirm,
  Tooltip,
  Skeleton,
} from "antd";
import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import styles from "./EditUserPage.module.css";
import { Data, Nationality, Religion, Degree, Gender } from "./Interface";
import avatar from "../../../assets/images/default_user_image.png";
import userApi from "../../../api/UserApi";
import ReactInputMask from "react-input-mask";
import moment, { Moment } from "moment";
import jwt from "jwt-decode";
import AuthStore from "../../../stores/AuthStore";
import { useParams } from "react-router-dom";
import notificationLogic from "../../../components/Notifications/Notification";
import { useHistory } from "react-router-dom";
import { RcCustomRequestOptions } from "antd/es/upload/interface";
import { descriptionValidation } from "../../../models/GllobalValidations/DescriptionValidation";
import{
  fileIsUpload,
  fileIsNotUpload, 
  possibleFileExtensions, 
  fileIsTooBig, 
  maxLength,
  successfulEditAction,
  tryAgain,
  shouldContain,
  emptyInput,
  minLength
} from "../../../components/Notifications/Messages"
import "../EditUserPage/EditUserPage.less"
import { UpuDegree } from "../Interface/Interface";
import jwt_decode from "jwt-decode";
import { Roles } from "../../../models/Roles/Roles";

export default function () {
  const { userId } = useParams<{ userId:string }>();
  const history = useHistory();
  const onlyLettersPattern = /^[a-zA-Zа-яА-ЯІіЄєЇїҐґ'`()]{1,50}((\s|-)[a-zA-Zа-яА-ЯІіЄєЇїҐґ'`()]{0,50})*$/;
  const allVariantsPattern = /^[a-zA-Zа-яА-ЯІіЄєЇїҐґ'`()!@#$%:"{}:\"\'&*_+=%;₴~№",.0-9]{1,50}((\s|-)[a-zA-Zа-яА-ЯІіЄєЇїҐґ'`()!@#$%:"{}:\"\'&*_+=%;₴~№",.0-9]{0,50})*$/;
  const wrongOnlyLettersMessage = shouldContain("тільки літери");
  const wrongAllVariantsMessage = shouldContain("літери, символи та цифри");
  const [form] = Form.useForm();
  const MAX_AGE = 100;

  const [nationality, setNationality] = useState<Nationality>();
  const [religion, setReligion] = useState<Religion>();
  const [degree, setDegree] = useState<Degree>();
  const [gender, setGender] = useState<Gender>();
  const [placeOfStudyID, setPlaceOfStudyID] = useState<any>();
  const [specialityID, setSpecialityID] = useState<any>();
  const [placeOfWorkID, setPlaceOfWorkID] = useState<any>();
  const [positionID, setPositionID] = useState<any>();
  const [birthday, setBirthday] = useState<Moment>();
  const [userAvatar, setUserAvatar] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Data>();
  const [photoName, setPhotoName] = useState<any>(null);
  const [defaultPhotoName, setDefaultPhotoName] = useState<string>("default_user_image.png");
  const [upuDegree, setUpuDegree] = useState<UpuDegree>();
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  const fetchData = async () => {
    const token = AuthStore.getToken() as string;
    const user: any = jwt(token);
    let decodedJwt = jwt_decode(token) as any;
    let id=user.nameid;
    if(user.nameid!=userId || (decodedJwt['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] as string[]).includes(Roles.Admin))
      id=userId
    await userApi
      .edit(id)
      .then(async (response) => {
        setData(response.data);
        if (response.data.user.imagePath !== undefined) {
          await userApi
            .getImage(response.data.user.imagePath)
            .then((q: { data: any }) => {
              setUserAvatar(q.data);
            })
            .catch(() => {
              notificationLogic("error", fileIsNotUpload("фото"));
            });
            setPhotoName(response.data.user.imagePath);
        } else {
          notificationLogic("error", fileIsNotUpload("даних"));
        }

        setLoading(true);
        form.setFieldsValue({
          firstName: response.data.user.firstName,
          lastName: response.data.user.lastName,
          fatherName: response.data.user.fatherName,
          birthday: moment(response.data.user.birthday),
          phoneNumber: response.data.user.phoneNumber,
          nationalityName: response.data.user.nationality.name,
          genderName: response.data.user.gender.name,
          placeOfStudy: response.data.user.education.placeOfStudy,
          speciality: response.data.user.education.speciality,
          degreeName: response.data.user.degree.name,
          placeOfWork: response.data.user.work.placeOfwork,
          religionName: response.data.user.religion.name,
          positionOfWork: response.data.user.work.position,
          address: response.data.user.address,
          pseudo: response.data.user.pseudo,
          publicPoliticalActivity: response.data.user.publicPoliticalActivity,
          upuDegreeName: response.data.user.upuDegree.name,
          facebookLink: response.data.user.facebookLink,
          twitterLink: response.data.user.twitterLink,
          instagramLink: response.data.user.instagramLink,
        });
        setNationality(response.data.user.nationality);
        setReligion(response.data.user.religion);
        setDegree(response.data.user.degree);
        setPlaceOfStudyID(response.data.educationView.placeOfStudyID);
        setSpecialityID(response.data.educationView.specialityID);
        setPlaceOfWorkID(response.data.workView.placeOfWorkID);
        setPositionID(response.data.workView.positionID);
        setGender(response.data.user.gender);
        setUpuDegree(response.data.user.upuDegree); 
        if (response.data.user.birthday === "0001-01-01T00:00:00") {
          form.setFieldsValue({'birthday': undefined});
        } else {
          form.setFieldsValue({'birthday': moment(response.data.user.birthday)});
        }
        if (response.data.user.phoneNumber === null) {
          setPhoneNumber("");
        } else {
          setPhoneNumber(response.data.user.phoneNumber);
        }
      })
      .catch(() => {
        notificationLogic("error", tryAgain);
      });
  };

  useEffect(() => {
    fetchData();
  }, [form]);

  function disabledDate(current: moment.Moment) {
    let date =  moment().endOf('day');
    return current && (current > date) || current.isBefore(moment().subtract(MAX_AGE, 'year'));
  }

  const validationSchema = {
    name: [
      { max: 25, message: maxLength(25) },
      { min: 2, message: minLength(2) },
      { required: true, message: emptyInput() },
      { pattern: onlyLettersPattern, message: wrongOnlyLettersMessage },
    ],
    surName: [
      { max: 25, message: maxLength(25) },
      { min: 2, message: minLength(2) },
      { required: true, message: emptyInput() },
      { pattern: onlyLettersPattern, message: wrongOnlyLettersMessage },
    ],
    fatherName: [
      { max: 25, message: maxLength(25) },
      { min: 2, message: minLength(2) },
      { pattern: onlyLettersPattern, message: wrongOnlyLettersMessage },
    ],
    gender: [
      { required: true, message: emptyInput() },
    ],
    birthday: [
      { required: true, message: emptyInput() },
    ],
    degree: [
      { max: 50, message: maxLength(50) },
      { pattern: allVariantsPattern, message: wrongAllVariantsMessage },
    ],
    placeOfStudy: [
      { max: 50, message: maxLength(50) },
      { pattern: allVariantsPattern, message: wrongAllVariantsMessage },
    ],
    speciality: [
      { max: 50, message: maxLength(50) },
      { pattern: allVariantsPattern, message: wrongAllVariantsMessage },
    ],
    nationality: [
      { max: 25, message: maxLength(25) },
      { pattern: onlyLettersPattern, message: wrongOnlyLettersMessage },
    ],
    religion: [
      { max: 25, message: maxLength(25) },
      { pattern: onlyLettersPattern, message: wrongOnlyLettersMessage },
    ],
    placeOfWork: [
      { max: 50, message: maxLength(50) },
      { pattern: allVariantsPattern, message: wrongAllVariantsMessage },
    ],
    position: [
      { max: 50, message: maxLength(50) },
      { pattern: allVariantsPattern, message: wrongAllVariantsMessage }
    ],
    address: [
      { max: 50, message: maxLength(50) },
      { required: true, message: emptyInput() },
      { pattern: allVariantsPattern, message: wrongAllVariantsMessage },
    ],
    pseudo: [
      { max: 25, message: maxLength(25) },
      { min: 2, message: minLength(2) },
      { pattern: onlyLettersPattern, message: wrongOnlyLettersMessage },
    ],
    publicPoliticalActivity: [
      { max: 25, message: maxLength(25) },
      { pattern: onlyLettersPattern, message: wrongOnlyLettersMessage },
    ],
    upuDegree: [
      { required: true, message: emptyInput() },
    ],
  };

  const changeApostropheInWord = (word: string) => {
    return word.replace(/`/g, '\'');
  };

  const setFirstLettersUpperCased = (word: string) => {
    if(word.length == 0) {
      return word;
    }

    let parts = word.split(/[- ]+/);

    parts = parts.map( (part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase());
    
    if(word.includes('-')) {
      return parts.join('-');
    } else if(word.includes(' ')) {
      return parts.join(' ');
    } else {
      return parts.join('');
    }
  };

  const getBase64 = (img: Blob, callback: Function) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };
  
  const checkFile = (size: number, fileName: string) => {
    const extension = fileName.split(".").reverse()[0].toLowerCase();
    const isCorrectExtension =
      extension.indexOf("jpeg") !== -1 ||
      extension.indexOf("jpg") !== -1 ||
      extension.indexOf("png") !== -1;
    if (!isCorrectExtension) {
      notificationLogic("error", possibleFileExtensions("png, jpg, jpeg"));
    }

    const isSmaller2mb = size <= 3145728;
    if (!isSmaller2mb) {
      notificationLogic("error", fileIsTooBig(3));
    }

    return isCorrectExtension && isSmaller2mb;
  };

  const handleUpload = (info: RcCustomRequestOptions) => {
    if (info !== null) {
      if (checkFile(info.file.size, info.file.name)) {
        getBase64(info.file, (imageUrl: any) => {
          setUserAvatar(imageUrl);
        });
        setPhotoName(null);
        notificationLogic("success", fileIsUpload("Фото"));
      }
    } else {
      setUserAvatar(avatar);
      notificationLogic("error", fileIsNotUpload("фото"));
    }
  };

  const handleOnChangeNationality = (value: any, event: any) => {
    if (event.key === undefined) {
      setNationality({
        id: 0,
        name: value,
      });
      form.setFieldsValue({ nationalityName: setFirstLettersUpperCased(changeApostropheInWord(value)) });
    } else {
      setNationality({
        id: parseInt(event.key),
        name: event.value,
      });
      form.setFieldsValue({ nationalityName: setFirstLettersUpperCased(changeApostropheInWord(event.value)) });
    }
  };

  const handleOnChangeFirstName = (event: React.ChangeEvent<HTMLInputElement>) => {
    form.setFieldsValue( {firstName: setFirstLettersUpperCased(changeApostropheInWord(event.target.value)) });
  }

  const handleOnChangeLastName = (event: React.ChangeEvent<HTMLInputElement>) => {
    form.setFieldsValue({ lastName: setFirstLettersUpperCased(changeApostropheInWord(event.target.value))});
  }

  const handleOnChangeFathersName = (event: React.ChangeEvent<HTMLInputElement>) => {
    form.setFieldsValue({ fatherName: setFirstLettersUpperCased(changeApostropheInWord(event.target.value)) });
  }

  const handleOnChangePseudo = (event: React.ChangeEvent<HTMLInputElement>) => {
    form.setFieldsValue({ pseudo: setFirstLettersUpperCased(changeApostropheInWord(event.target.value)) });
  }

  const handleOnChangePublicPoliticalActivity = (event: React.ChangeEvent<HTMLInputElement>) => {
    form.setFieldsValue({ publicPoliticalActivity: setFirstLettersUpperCased(changeApostropheInWord(event.target.value)) });
  }

  const handleOnChangeAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
    form.setFieldsValue( { address: changeApostropheInWord(event.target.value) });
  }
  
  const handleOnChangeReligion = (value: any, event: any) => {
    if (event.key === undefined) {
      setReligion({
        id: 0,
        name: value,
      });
      form.setFieldsValue({ religionName: setFirstLettersUpperCased(changeApostropheInWord(value)) });
    } else {
      setReligion({
        id: parseInt(event.key),
        name: event.value,
      });
      form.setFieldsValue({ religionName: setFirstLettersUpperCased(changeApostropheInWord(event.value)) });
    }
  };
  const handleOnChangeDegree = (value: any, event: any) => {
    if (event.key === undefined) {
      setDegree({
        id: 0,
        name: value,
      });
    } else {
      setDegree({
        id: parseInt(event.key),
        name: event.value,
      });
    }
  };

  const handleOnChangePlaceOfStudy = (value: any, event: any) => {
    if (event.key === undefined) {
      setPlaceOfStudyID(null);
    } else {
      setPlaceOfStudyID(parseInt(event.key));
    }
  };

  const handleOnChangeSpeciality = (value: any, event: any) => {
    if (event.key === undefined) {
      setSpecialityID(null);
    } else {
      setSpecialityID(parseInt(event.key));
    }
  };

  const handleOnChangePlaceOWork = (value: any, event: any) => {
    if (event.key === undefined) {
      setPlaceOfWorkID(null);
    } else {
      setPlaceOfWorkID(parseInt(event.key));
    }
  };

  const handleOnChangePosition = (value: any, event: any) => {
    if (event.key === undefined) {
      setPositionID(null);
    } else {
      setPositionID(parseInt(event.key));
    }
  };

  const handleOnChangeGender = (value: any) => {
    setGender(JSON.parse(value));
  };

  const changePhoneNumber = (event: any) => {
    setPhoneNumber(event.target.value);
  };

  const handleOnChangeBirthday = (event: any, value: any) => {
    if (value === "") {
      setBirthday(undefined);
    } else {
      setBirthday(moment(event?._d));
    }
  };

  const handleOnChangeUpuDegree = (value: any) => {
    setUpuDegree(JSON.parse(value));
  };

  const handleDeletePhoto = async () => {
    await userApi
            .getImage(defaultPhotoName)
            .then((q: { data: any }) => {
              setUserAvatar(q.data);
            })
            .catch(() => {
              notificationLogic("error", fileIsNotUpload("фото"));
            });
            setPhotoName(defaultPhotoName);
  };

  const handleSubmit = async (values: any) => {
    const newUserProfile = {
      user: {
        id: data?.user?.id,
        userProfileID: data?.user.userProfileID,
        firstName: values.firstName?.trim(),
        lastName: values.lastName?.trim(),
        fatherName: values.fatherName?.trim(),
        phoneNumber: phoneNumber?.trim(),
        birthday: form?.getFieldValue('birthday'),
        imagePath: photoName,
        pseudo: values.pseudo?.trim(),
        publicPoliticalActivity: values.publicPoliticalActivity?.trim(),
        facebookLink: values.facebookLink,
        twitterLink: values.twitterLink,
        instagramLink: values.instagramLink,

        degree: {
          id: degree?.id,
          Name: degree?.name,
        },
        nationality: {
          id: nationality?.id,
          Name: nationality?.name?.trim(),
        },
        religion: {
          id: religion?.id,
          Name: religion?.name?.trim(),
        },
        education: {
          placeOfStudy: values.placeOfStudy?.trim(),
          speciality: values.speciality?.trim(),
        },
        work: {
          placeOfWork: values.placeOfWork?.trim(),
          position: values.positionOfWork?.trim(),
        },
        gender: gender,
        address: values.address?.trim(),
        upuDegree: upuDegree,
      },
      imageBase64: userAvatar,
      educationView: {
        placeOfStudyID: placeOfStudyID,
        specialityID: specialityID,
      },
      workView: {
        placeOfWorkID: placeOfWorkID,
        positionID: positionID,
      },
    };
    await userApi
      .put(newUserProfile)
      .then(() => {
        notificationLogic("success", successfulEditAction("Дані"));
        history.push(`/userpage/main/${userId}`);       
      })
      .catch(() => {
        notificationLogic("error", tryAgain);
      });
    fetchData();
  };

  return loading === false ? (
    <div className="kadraWrapper">
        <Skeleton.Avatar
            size={220}
            active={true}
            shape="circle"
            className="img"
        />
    </div>
    ) : ( 
    <div className={styles.mainContainer}>
      <Form
        form={form}
        name="basic"
        className={styles.formContainer}
        onFinish={handleSubmit}
      >
        <div className={styles.avatarWrapper}>
          <div className={styles.kadraWrapper}>
            <Avatar size={300} src={userAvatar} className="avatarElem" />
            <div className={styles.buttonsImage}>
            <Upload
              name="avatar"
              className={styles.changeAvatar}
              showUploadList={false}
              accept=".jpeg,.jpg,.png"
              customRequest={handleUpload}
            >
              <Button className={styles.changeAvatarBtn}>
                <UploadOutlined /> Вибрати
              </Button>
            </Upload>
            {photoName!==defaultPhotoName?
            <Tooltip title="Видалити">
              <Popconfirm
                title="Видалити фото?"
                placement="bottom"
                icon={false}
                onConfirm={()=>handleDeletePhoto()}
                okText="Так"
                cancelText="Ні">
                <DeleteOutlined
                  className={styles.deleteIcon}
                  key="close"
                />
              </Popconfirm>
            </Tooltip>:null}
            </div>
          </div>
        </div>
        
        <div className={styles.allFields}>
          <div className={styles.rowBlock}>
            <Form.Item
              label="Ім'я"
              name="firstName"
              rules={validationSchema.name}
              className={styles.formItem}
            >
              <Input className={styles.dataInput} onChange={handleOnChangeFirstName} maxLength={26}/>
            </Form.Item>
            <Form.Item
              label="Прізвище"
              name="lastName"
              rules={validationSchema.surName}
              className={styles.formItem}
            >
              <Input className={styles.dataInput} onChange={e=>handleOnChangeLastName(e)} maxLength={26}/>
            </Form.Item>
          </div>
          <div className={styles.rowBlock}>
            <Form.Item
              label="По батькові"
              name="fatherName"
              rules={validationSchema.fatherName}
              className={styles.formItem}
            >
              <Input className={styles.dataInput} onChange={e=>handleOnChangeFathersName(e)} maxLength={26}/>
            </Form.Item>
            <Form.Item
              label="Стать"
              name="genderName"
              className={styles.formItem}
              rules={validationSchema.gender}
            >
              <Select
                className={styles.dataInputSelect}
                onChange={handleOnChangeGender}
              >
                {data?.genders.map((p) => (
                  <Select.Option key={p.id} value={JSON.stringify(p)}>
                    {p.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          <div className={styles.rowBlock}>
            <Form.Item
              label="Псевдо"
              name="pseudo"
              rules={validationSchema.pseudo}
              className={styles.formItem}
            >            
              <Input className={styles.dataInput} onChange={handleOnChangePseudo} maxLength={26}/>
            </Form.Item>
            <Form.Item 
              label="Дата народження"
              name="birthday"
              className={styles.formItem}
              rules={validationSchema.birthday}
            >
              <DatePicker
                className={styles.dataInput}
                disabledDate={(cur) => disabledDate(cur)}
                value={birthday}
                onChange={handleOnChangeBirthday}
                format="DD.MM.YYYY"
              />
            </Form.Item>
          </div>
          <div className={styles.rowBlock}>
            <Form.Item
              label="Номер телефону"
              name="phoneNumber"
              className={styles.formItem}
              rules={[descriptionValidation.Phone, descriptionValidation.Required]}
            >
              <ReactInputMask
                  mask="+380(99)-999-99-99"
                  maskChar={null}
                  value={phoneNumber}
                  onChange={changePhoneNumber}
                  className={styles.dataInput}
                >
                  {(inputProps: any) => <Input {...inputProps} />}
              </ReactInputMask>
            </Form.Item>
            <Form.Item
              label="Національність"
              name="nationalityName"
              rules={validationSchema.nationality}
              className={styles.formItem}
            >
              <AutoComplete
                className={styles.dataInputSelect}
                filterOption={true}
                onChange={handleOnChangeNationality}
              >
                {data?.nationalities.map((p) => (
                  <Select.Option key={p.id} value={p.name}>
                    {p.name}
                  </Select.Option>
                ))}
              </AutoComplete>
            </Form.Item>
          </div>
          <div className={styles.rowBlock}>
            <Form.Item
              label="Віровизнання"
              name="religionName"
              className={styles.formItem}
              rules={validationSchema.religion}
            >
              <AutoComplete
                className={styles.dataInputSelect}
                filterOption={true}
                onChange={handleOnChangeReligion}
                
              >
                {data?.religions.map((p) => (
                  <Select.Option key={p.id} value={p.name}>
                    {p.name}
                  </Select.Option>
                ))}
              </AutoComplete>
            </Form.Item>
            <Form.Item
              label="Навчальний заклад"
              name="placeOfStudy"
              rules={validationSchema.placeOfStudy}
              className={styles.formItem}
            >
              <AutoComplete
                className={styles.dataInputSelect}
                filterOption={true}
                onChange={handleOnChangePlaceOfStudy}
              >
                {data?.educationView.placeOfStudyList.map((p) => (
                  <Select.Option key={p.id} value={p.placeOfStudy}>
                    {p.placeOfStudy}
                  </Select.Option>
                ))}
              </AutoComplete>
            </Form.Item>
          </div>
          <div className={styles.rowBlock}>
            <Form.Item
              label="Спеціальність"
              name="speciality"
              rules={validationSchema.speciality}
              className={styles.formItem}
            >
              <AutoComplete
                className={styles.dataInputSelect}
                filterOption={true}
                onChange={handleOnChangeSpeciality}
              >
                {data?.educationView.specialityList.map((p) => (
                  <Select.Option key={p.id} value={p.speciality}>
                    {p.speciality}
                  </Select.Option>
                ))}
              </AutoComplete>
            </Form.Item>
            <Form.Item
              label="Навчальний ступінь"
              name="degreeName"
              rules={validationSchema.degree}
              className={styles.formItem}
            >
              <AutoComplete
                className={styles.dataInputSelect}
                filterOption={true}
                onChange={handleOnChangeDegree}
              >
                {data?.degrees.map((p) => (
                  <Select.Option key={p.id} value={p.name}>
                    {p.name}
                  </Select.Option>
                ))}
              </AutoComplete>
            </Form.Item>
          </div>
          <div className={styles.rowBlock}>
            <Form.Item
              label="Місце праці"
              name="placeOfWork"
              rules={validationSchema.placeOfWork}
              className={styles.formItem}
            >
              <AutoComplete
                className={styles.dataInputSelect}
                filterOption={true}
                onChange={handleOnChangePlaceOWork}
              >
                {data?.workView.placeOfWorkList.map((p) => (
                  <Select.Option key={p.id} value={p.placeOfwork}>
                    {p.placeOfwork}
                  </Select.Option>
                ))}
              </AutoComplete>
            </Form.Item>
            <Form.Item
              label="Посада"
              name="positionOfWork"
              rules={validationSchema.position}
              className={styles.formItem}
            >
              <AutoComplete
                className={styles.dataInputSelect}
                filterOption={true}
                onChange={handleOnChangePosition}
              >
                {data?.workView.positionList.map((p) => (
                  <Select.Option key={p.id} value={p.position}>
                    {p.position}
                  </Select.Option>
                ))}
              </AutoComplete>
            </Form.Item>
          </div>
          <div className={styles.rowBlock}>
            <Form.Item
              label="Адреса проживання"
              name="address"
              rules={validationSchema.address}
              className={styles.formItem}
            >
              <Input className={styles.dataInput} onChange={handleOnChangeAddress} maxLength={51}/>
            </Form.Item>
            <Form.Item
              label="Громадська, політична діяльність"
              name="publicPoliticalActivity"
              rules={validationSchema.publicPoliticalActivity}
              className={styles.formItem}
            >            
              <Input className={styles.dataInput} onChange={handleOnChangePublicPoliticalActivity} maxLength={26}/>
            </Form.Item>
          </div>
          <div className={styles.rowBlock}>
            <Form.Item
              label="Ступінь в УПЮ"
              name="upuDegreeName"
              className={styles.formItem}
              rules={validationSchema.upuDegree}
            >
              <Select
                className={styles.dataInputSelect}
                onChange={handleOnChangeUpuDegree}
              >
                {data?.upuDegrees.map((p) => (
                  <Select.Option key={p.id} value={JSON.stringify(p)}>
                    {p.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item 
              label="Посилання на Facebook"
              name="facebookLink"
              className={styles.formItem}
            >
              <Input className={styles.dataInput}/>               
            </Form.Item>
          </div>
          <div className={styles.rowBlock}>
            <Form.Item 
              label="Посилання на Twitter"
              name="twitterLink"
              className={styles.formItem}
            >
              <Input className={styles.dataInput}/>               
            </Form.Item>
            <Form.Item 
              label="Посилання на Instagram"
              name="instagramLink"
              className={styles.formItem}
            >
              <Input className={styles.dataInput}/>            
            </Form.Item>
          </div>
          <div className="buttons">
            <Button className={styles.confirmBtn} htmlType="submit" >
              Підтвердити
            </Button>
            <Button className={styles.confirmBtn} htmlType="submit" onClick={() => history.push(`/userpage/main/${userId}`)}>
              Відмінити
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}
