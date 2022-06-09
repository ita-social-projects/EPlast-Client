import React, { useEffect, useRef, useState } from "react";
import { Form, Input, Button, Modal, Select, Calendar, DatePicker } from "antd";
import styles from "./SignUp.module.css";
import Switcher from "./Switcher/Switcher";
import { checkAddress, checkEmail, checkFacebookLink, checkInstagramLink, checkNameSurName, checkPassword, checkPhone, checkTwitterLink } from "./verification";
import AuthorizeApi from "../../api/authorizeApi";
import { useHistory } from "react-router-dom";
import {
  incorrectEmail,
  emptyInput,
  incorrectPhone,
  minLength,
} from "../../components/Notifications/Messages";
import TermsOfUseModel from "../../models/TermsOfUse/TermsOfUseModel";
import termsApi from "../../api/termsApi";
import { Markup } from "interweave";
import City, { ActiveCity } from "../AnnualReport/Interfaces/City";
import citiesApi, { ActiveCityDataResponse, getActiveCitiesByPage, getCities } from "../../api/citiesApi";
import { GenderIdEnum, GenderNameEnum, genderRecords } from "../../models/UserTable/Gender";
import moment from "moment";
import ReactInputMask from "react-input-mask";
import { SelectValue } from "antd/lib/select";
import { SingUpStore } from "../../stores/SingUpStore";

let authService = new AuthorizeApi();

const SignUp: React.FC = () => {
  const [form] = Form.useForm();
  const history = useHistory();
  const [available, setAvailabe] = useState(true);
  const [visible, setVisible] = useState(false);
  const [state, actions] = SingUpStore();
  // const [terms, setTerms] = useState<TermsOfUseModel>({
  //   termsId: 0,
  //   termsTitle: "",
  //   termsText: "Немає даних",
  //   datePublication: new Date(),
  // });
  // const [cities, setCities] = useState<ActiveCity[]>([]);
  //const [cityPage, setCityPage] = useState<number>(1);
  //const pageSize = 30;
  //const [total, setTotal] = useState(0);
  //const [selectedCity, setSelectedCity] = useState<string | null>(null);
  //const [model, setModel] = useState();
  const [loading, setLoading] = useState(false);

  const fetchTermsData = async () => {
    const termsData: TermsOfUseModel = await termsApi.getTerms();
    const { cities, total }: ActiveCityDataResponse = (await getActiveCitiesByPage(1, state.page.size!)).data;
    actions.setTerms(termsData);
    console.log(termsData);
    actions.setCities(cities);
    actions.setPageInfo({
      total: total,
      number: 1
    })
  };

  const setNamedCities = async (value: string) => {
    const { cities: newCities, total }: ActiveCityDataResponse = (await getActiveCitiesByPage(1, state.page.size!, value)).data;
    actions.setPageInfo({
      total: total,
      number: 1,
      selectedCity: value
    });
    actions.setCities(newCities);
  }

  useEffect(() => {
    fetchTermsData();
  }, []);

  const handler = {
    submit: async (values: any) => {
      actions.setFormData(values);
      setVisible(true);
    },
    terms: {
      confirm: async () => {

        setVisible(false);
        setAvailabe(false);
        console.log(state.formData);
        console.log(state.terms);
        //await authService.register(state.formData);
        setAvailabe(true);
        // history.push("/signin");
      },
      cancel: async () => {
        setVisible(false);
      }
    },
    select: {
      scroll: async (event: Event) => {
        const target = event.target as HTMLDivElement;
        const currentPosition = target.scrollTop + target.offsetHeight;
        const fetchPosition = target.scrollHeight - 200;
        if (loading === false
          && currentPosition > fetchPosition
          && Math.ceil(state.page.total! / state.page.size!) !== state.page.number!) {
          setLoading(true);
          const data: ActiveCityDataResponse
            = (await getActiveCitiesByPage(state.page.number! + 1, state.page.size!, state.page.selectedCity)).data;
          const { total, cities: newCities } = data;
          actions.setPageInfo({
            total: total,
            number: state.page.number! + 1,
          });
          actions.addCityRange(newCities);
          setLoading(false);
        }
      },
      filter: (input: string, option: any) => {
        return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
      }
    }
  }

  const validationSchema = {
    Email: [
      { required: true, message: emptyInput() },
      { validator: checkEmail },
    ],
    Password: [
      { required: true, message: emptyInput() },
      { validator: checkPassword },
    ],
    Name: [
      { required: true, message: emptyInput() },
      { validator: checkNameSurName },
    ],
    SurName: [
      { required: true, message: emptyInput() },
      { validator: checkNameSurName },
    ],
    MiddleName: [
      { validator: checkNameSurName },
    ],
    ConfirmPassword: [
      { required: true, message: emptyInput() },
      { min: 8, message: minLength(8) },
    ],
    CityId: [
      { required: true, message: emptyInput() }
    ],
    Date: [
      { required: true, message: emptyInput() }
    ],
    Address: [
      { validator: checkAddress },
    ],
    PhoneNumber: [
      { validator: checkPhone },
    ],
    FacebookLink: [
      { required: true, message: emptyInput() },
      { validator: checkFacebookLink },
    ],
    TwitterLink: [
      { required: true, message: emptyInput() },
      { validator: checkTwitterLink },
    ],
    InstagramLink: [
      { required: true, message: emptyInput() },
      { validator: checkInstagramLink },
    ],
  };

  return (
    <div className={styles.mainContainerSignUp} >
      <Switcher page="SignUp" />
      <Form
        name="SignUpForm"
        form={form}
        onFinish={handler.submit}
      >
        <Form.Item name="SurName" rules={validationSchema.SurName}>
          <Input className={styles.MyInput} placeholder="Прізвище" />
        </Form.Item>

        <Form.Item name="Name" rules={validationSchema.Name}>
          <Input className={styles.MyInput} placeholder="Ім'я" />
        </Form.Item>

        <Form.Item name="MiddleName" rules={validationSchema.MiddleName}>
          <Input className={styles.MyInput} placeholder="По батькові" />
        </Form.Item>

        <Form.Item name="Address" rules={validationSchema.Address}>
          <Input className={styles.MyInput} placeholder="Місце проживання" />
        </Form.Item>

        <Form.Item
          rules={validationSchema.Date}
        >
          <DatePicker
            name="Date"
            className={styles.MyDatePicker}
            format="DD.MM.YYYY"
            disabledDate={current => {
              return current && current > moment();
            }}
          />
        </Form.Item>

        <Form.Item
          name="GenderId"
          initialValue={GenderNameEnum.NotSpecified}
        >
          <Select
            className={styles.MySelect}
            placeholder="Стать">
            <Select.Option value={GenderIdEnum.NotSpecified}>
              {genderRecords[GenderIdEnum.NotSpecified]}
            </Select.Option>
            <Select.Option value={GenderIdEnum.Male}>
              {genderRecords[GenderIdEnum.Male]}
            </Select.Option>
            <Select.Option value={GenderIdEnum.Female}>
              {genderRecords[GenderIdEnum.Female]}
            </Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="CityId"
          rules={[{ required: true, message: emptyInput() }]}
        >
          <Select
            onSearch={async (value: string) => {

              await setNamedCities(value);
            }}
            showSearch
            onPopupScroll={(e: any) => handler.select.scroll(e)}
            className={styles.MySelect}
            placeholder="Оберіть станицю"
            filterOption={handler.select.filter}
          >
            {state.cities.map((apd) => {
              return (
                <Select.Option key={apd.id} value={apd.id}>
                  {apd.name}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item
          name="Phone"
          rules={validationSchema.PhoneNumber}
        >
          <div className={"ant-form-item-control-input-content"}>
            <ReactInputMask
              className={`ant-input ${styles.MyInput}`}
              mask="+380(99)-999-99-99"
              placeholder="Номер телефону"
            />
          </div>
        </Form.Item>

        <Form.Item name="FacebookLink" rules={validationSchema.FacebookLink}>
          <Input type="url"
            className={styles.MyInput}
            placeholder="Facebook сторінка" />
        </Form.Item>
        <Form.Item name="TwitterLink" rules={validationSchema.TwitterLink}>
          <Input type="url"
            className={styles.MyInput}
            placeholder="Twitter сторінка" />
        </Form.Item>
        <Form.Item name="InstagramLink" rules={validationSchema.InstagramLink}>
          <Input type="url"
            className={styles.MyInput}
            placeholder="Instagram сторінка" />
        </Form.Item>

        <Form.Item name="Email" rules={validationSchema.Email}>
          <Input
            className={styles.MyInput}
            placeholder="Електронна пошта" />
        </Form.Item>

        <Form.Item name="Password" rules={validationSchema.Password}>
          <Input.Password
            visibilityToggle={true}
            className={styles.MyInput}
            placeholder="Пароль"
          />
        </Form.Item>

        <Form.Item
          name="ConfirmPassword"
          dependencies={["Password"]}
          rules={[
            {
              required: true,
              message: emptyInput(),
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue("Password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Паролі не співпадають"));
              },
            }),
          ]}
        >
          <Input.Password
            visibilityToggle={true}
            className={styles.MyInput}
            placeholder="Підтвердити пароль"
          />
        </Form.Item>
        <Form.Item>
          <Button
            htmlType="submit"
            id={styles.confirmButton}
            disabled={!available}
            loading={!available}
          >
            Зареєструватись
          </Button>
        </Form.Item>
        <Modal
          className="modalTerms"
          centered
          okText="Погоджуюсь"
          visible={visible}
          onOk={handler.terms.confirm}
          onCancel={handler.terms.cancel}
          width={1000}
        >
          <h1>{state.terms.termsTitle}</h1>
          <Markup className="markupText" content={state.terms.termsText} />
        </Modal>
      </Form>
    </div >
  );
}

export default SignUp;