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
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import styles from "./EditUserPage.module.css";
import { checkNameSurName} from "../../SignUp/verification";
import { Data, Nationality, Religion, Degree, Gender } from "./Interface";
import avatar from "../../../assets/images/default_user_image.png";
import userApi from "../../../api/UserApi";
import ReactInputMask from "react-input-mask";
import moment, { Moment } from "moment";
import jwt from "jwt-decode";
import AuthStore from "../../../stores/AuthStore";
import { useParams } from "react-router-dom";
import notificationLogic from "../../../components/Notifications/Notification";
import Spinner from "../../Spinner/Spinner";
import { useHistory } from "react-router-dom";
import { RcCustomRequestOptions } from "antd/es/upload/interface";

export default function () {
  const history = useHistory();
  const patern = /^[a-zA-Zа-яА-ЯІіЄєЇїҐґ'.`]{0,50}((\s+|-)[a-zA-Zа-яА-ЯІіЄєЇїҐґ'.`]{0,50})*$/;
  const message = "Дане поле повинне містити тільки літери";
  const [form] = Form.useForm();

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
  debugger
  const fetchData = async () => {
    const token = AuthStore.getToken() as string;
    const user: any = jwt(token);
    await userApi
      .edit(user.nameid)
      .then(async (response) => {
        setData(response.data);
        if (response.data.user.imagePath !== undefined) {
          await userApi
            .getImage(response.data.user.imagePath)
            .then((q: { data: any }) => {
              setUserAvatar(q.data);
            })
            .catch(() => {
              notificationLogic("error", "Проблема з завантаженням фото");
            });
        } else {
          notificationLogic("error", "Проблема з завантаженням даних");
        }

        setLoading(true);
        form.setFieldsValue({
          firstName: response.data.user.firstName,
          lastName: response.data.user.lastName,
          fatherName: response.data.user.fatherName,
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
        });
        setNationality(response.data.user.nationality);
        setReligion(response.data.user.religion);
        setDegree(response.data.user.degree);
        setPlaceOfStudyID(response.data.educationView.placeOfStudyID);
        setSpecialityID(response.data.educationView.specialityID);
        setPlaceOfWorkID(response.data.workView.placeOfWorkID);
        setPositionID(response.data.workView.positionID);
        setGender(response.data.user.gender);
        if (response.data.user.birthday === "0001-01-01T00:00:00") {
          setBirthday(undefined);
        } else {
          setBirthday(moment(response.data.user.birthday));
        }
        if (response.data.user.phoneNumber === null) {
          setPhoneNumber("");
        } else {
          setPhoneNumber(response.data.user.phoneNumber);
        }
      })
      .catch(() => {
        notificationLogic("error", "Щось пішло не так");
      });
  };

  useEffect(() => {
    fetchData();
  }, [form]);

  function disabledDate(current: any) {
    let date =  moment().endOf('day');
    return current && (current > date);
  }

  const validationSchema = {
    name: [
      { validator: checkNameSurName },
    ],
    surName: [
      { validator: checkNameSurName },
    ],
    fatherName: [
      { max: 25, message: "Максимальна довжина - 25 символів" },
      { pattern: patern, message: message },
    ],
    degree: [
      { max: 30, message: "Максимальна довжина - 30 символів" },
      { pattern: patern, message: message },
    ],
    placeOfStudy: [
      { max: 50, message: "Максимальна довжина - 50 символів" },
      { pattern: /^[a-zA-Zа-яА-ЯІіЄєЇїҐґ'"().`0-9.-]{0,50}((\s+|-)[a-zA-Zа-яА-ЯІіЄєЇїҐґ()'".`0-9.-]{0,50})*$/ 
        , message: message },
    ],
    speciality: [
      { max: 50, message: "Максимальна довжина - 50 символів" },
      { pattern: patern, message: message },
    ],
    nationality: [
      { max: 25, message: "Максимальна довжина - 25 символів" },
      { pattern: patern, message: message },
    ],
    religion: [
      { max: 25, message: "Максимальна довжина - 25 символів" },
      { pattern: patern, message: message },
    ],
    placeOfWork: [
      { max: 50, message: "Максимальна довжина - 50 символів" },
      { pattern: patern, message: message },
    ],
    position: [
      { max: 50, message: "Максимальна довжина - 50 символів" },
      { pattern: patern, message: message },
    ],
    adress: [
      { max: 50, message: "Максимальна довжина - 50 символів" },
      {
        pattern: /^[a-zA-Zа-яА-ЯІіЄєЇїҐґ'.`0-9.-]{0,30}((\s+|-)[a-zA-Zа-яА-ЯІіЄєЇїҐґ'.`0-9.-]{0,30})*$/,
        message: "Дане поле повинне містити тільки літери та цифри",
      },
    ],
  };

  const getBase64 = (img: Blob, callback: Function) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };
  
  const checkFile = (size: number, fileName: string) => {
    const extension = fileName.split(".").reverse()[0];
    const isCorrectExtension =
      extension.indexOf("jpeg") !== -1 ||
      extension.indexOf("jpg") !== -1 ||
      extension.indexOf("png") !== -1;
    if (!isCorrectExtension) {
      notificationLogic("error", "Можливі розширення фото: png, jpg, jpeg");
    }

    const isSmaller2mb = size <= 3145728;
    if (!isSmaller2mb) {
      notificationLogic("error", "Розмір файлу перевищує 3 Мб");
    }

    return isCorrectExtension && isSmaller2mb;
  };

  const handleUpload = (info: RcCustomRequestOptions) => {
    if (info !== null) {
      if (checkFile(info.file.size, info.file.name)) {
        getBase64(info.file, (imageUrl: any) => {
          setUserAvatar(imageUrl);
        });
        notificationLogic("success", "Фото завантажено");
      }
    } else {
      setUserAvatar(avatar);
      notificationLogic("error", "Проблема з завантаженням фото");
    }
  };

  const handleOnChangeNationality = (value: any, event: any) => {
    if (event.key === undefined) {
      setNationality({
        id: 0,
        name: value,
      });
    } else {
      setNationality({
        id: parseInt(event.key),
        name: event.value,
      });
    }
  };
  const [phoneNumber, setPhoneNumber] = useState("");
  const handleOnChangeReligion = (value: any, event: any) => {
    if (event.key === undefined) {
      setReligion({
        id: 0,
        name: value,
      });
    } else {
      setReligion({
        id: parseInt(event.key),
        name: event.value,
      });
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
  const handleSubmit = async (values: any) => {
    const newUserProfile = {
      user: {
        id: data?.user?.id,
        userProfileID: data?.user.userProfileID,
        firstName: values.firstName,
        lastName: values.lastName,
        fatherName: values.fatherName,
        phoneNumber: phoneNumber,
        birthday: birthday,

        degree: {
          id: degree?.id,
          Name: degree?.name,
        },
        nationality: {
          id: nationality?.id,
          Name: nationality?.name,
        },
        religion: {
          id: religion?.id,
          Name: religion?.name,
        },
        education: {
          placeOfStudy: values.placeOfStudy,
          speciality: values.speciality,
        },
        work: {
          placeOfWork: values.placeOfWork,
          position: values.positionOfWork,
        },
        gender: gender,
        address: values.address,
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
        notificationLogic("success", "Дані успішно змінено");
        history.replace(`/userpage/main/${newUserProfile.user.id}`);
        window.location.reload();
        
      })
      .catch(() => {
        notificationLogic("error", "Щось пішло не так");
      });
    fetchData();
  };
  const { userId } = useParams();

  return loading === false ? (
    <Spinner />
  ) : (
    <div className={styles.mainContainer}>
      <Form
        form={form}
        name="basic"
        className={styles.formContainer}
        onFinish={handleSubmit}
      >
        <div className={styles.avatarWrapper}>
          <Avatar size={300} src={userAvatar} className="avatarElem" />
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
        </div>
        
        <div className={styles.allFields}>
          <div className={styles.rowBlock}>
            <Form.Item
              label="Ім`я"
              name="firstName"
              rules={validationSchema.name}
              className={styles.formItem}
            >
              <Input className={styles.dataInput} />
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
              <Input className={styles.dataInput} />
            </Form.Item>
            <Form.Item
              label="Стать"
              name="genderName"
              className={styles.formItem}
            >
              <Select
                className={styles.dataInput}
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
            <Form.Item label="Дата народження" className={styles.formItem}>
              <DatePicker
                className={styles.dataInput}
                disabledDate={(cur) => disabledDate(cur)}
                value={birthday}
                onChange={handleOnChangeBirthday}
                format="DD.MM.YYYY"
              />
            </Form.Item>
            <Form.Item
              label="Номер телефону"
              name="phoneNumber"
              className={styles.formItem}
              rules={[{min:18,message:"Дане поле не є номером телефону"}]}
            >
              <ReactInputMask
                 value={phoneNumber}
                 onChange={changePhoneNumber}
                 className={styles.dataInput}
                 mask="+38(999)-999-99-99"
              >
              {(inputProps: any) => <Input {...inputProps} />}
              </ReactInputMask>
            </Form.Item>
          </div>
          <div className={styles.rowBlock}>
            <Form.Item
              label="Національність"
              name="nationalityName"
              rules={validationSchema.nationality}
              className={styles.formItem}
            >
              <AutoComplete
                className={styles.dataInput}
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
            <Form.Item
              label="Віровизнання"
              name="religionName"
              className={styles.formItem}
              rules={validationSchema.religion}
            >
              <AutoComplete
                className={styles.dataInput}
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
          </div>

          <div className={styles.rowBlock}>
            <Form.Item
              label="Навчальний заклад"
              name="placeOfStudy"
              rules={validationSchema.placeOfStudy}
              className={styles.formItem}
            >
              <AutoComplete
                className={styles.dataInput}
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
            <Form.Item
              label="Спеціальність"
              name="speciality"
              rules={validationSchema.speciality}
              className={styles.formItem}
            >
              <AutoComplete
                className={styles.dataInput}
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
          </div>
          <div className={styles.rowBlock}>
            <Form.Item
              label="Навчальний ступінь"
              name="degreeName"
              rules={validationSchema.degree}
              className={styles.formItem}
            >
              <AutoComplete
                className={styles.dataInput}
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
            <Form.Item
              label="Місце праці"
              name="placeOfWork"
              rules={validationSchema.placeOfWork}
              className={styles.formItem}
            >
              <AutoComplete
                className={styles.dataInput}
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
          </div>
          <div className={styles.rowBlock}>
            <Form.Item
              label="Посада"
              name="positionOfWork"
              rules={validationSchema.position}
              className={styles.formItem}
            >
              <AutoComplete
                className={styles.dataInput}
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
            Підтвердити
          </Button>
        </div>
      </Form>
    </div>
  );
}
