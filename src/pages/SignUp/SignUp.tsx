import React, { useEffect, useRef, useState } from "react";
import { Form, Input, Button, Modal, Select, Calendar, DatePicker, Tabs } from "antd";
import styles from "./SignUp.module.css";
import Switcher from "./Switcher/Switcher";
import { checkAddress, checkEmail, checkFacebookLink, checkInstagramLink, checkNameSurName, checkPassword, checkPhone, checkTwitterLink } from "./verification";
import AuthorizeApi from "../../api/authorizeApi";
import { useHistory, useLocation, useParams } from "react-router-dom";
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
import { ActiveRegionDataResponse, getActiveRegionsByPage } from "../../api/regionsApi";
import TabList, { TabRenderMode } from "./TabList";
import TabInputList from "./TabInputList";
const { TabPane } = Tabs;
let authService = new AuthorizeApi();

const SignUp: React.FC = () => {
  const [form] = Form.useForm();
  const [available, setAvailabe] = useState(true);
  const [visible, setVisible] = useState(false);
  const [state, actions] = SingUpStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    ;
    (async () => {
      const termsData: TermsOfUseModel = await termsApi.getTerms();

      const { cities, total: cityTotal }: ActiveCityDataResponse
        = (await getActiveCitiesByPage(1, state.cityPage.size!)).data;
      const { regions, total: regionTotal }: ActiveRegionDataResponse
        = (await getActiveRegionsByPage(1, state.regionPage.size!)).data

      actions.setTerms(termsData);

      actions.setCities(cities);
      actions.setCityPageInfo({
        total: cityTotal,
        number: 1
      });

      actions.setRegions(regions);
      actions.setRegionPageInfo({
        total: regionTotal,
        number: 1
      });
    })();
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
        //await authService.register(state.formData);
        setAvailabe(true);
        // history.push("/signin");
      },
      cancel: async () => {
        setVisible(false);
      }
    },
    select: {
      cityScroll: async (event: Event) => {
        const target = event.target as HTMLDivElement;
        const currentPosition = target.scrollTop + target.offsetHeight;
        const fetchPosition = target.scrollHeight - 150;
        if (loading === false
          && currentPosition > fetchPosition
          && Math.ceil(state.cityPage.total! / state.cityPage.size!) !== state.cityPage.number!) {
          setLoading(true);
          const data: ActiveCityDataResponse
            = (await getActiveCitiesByPage(state.cityPage.number! + 1, state.cityPage.size!, state.cityPage.text)).data;
          const { total, cities: newCities } = data;
          actions.setCityPageInfo({
            total: total,
            number: state.cityPage.number! + 1,
          });
          actions.addCityRange(newCities);
          setLoading(false);
        }
      },
      regionScroll: async (event: Event) => {
        const target = event.target as HTMLDivElement;
        const currentPosition = target.scrollTop + target.offsetHeight;
        const fetchPosition = target.scrollHeight - 150;
        if (loading === false
          && currentPosition > fetchPosition
          && Math.ceil(state.regionPage.total! / state.regionPage.size!) !== state.regionPage.number!) {
          setLoading(true);
          const data: ActiveRegionDataResponse
            = (await getActiveRegionsByPage(state.regionPage.number! + 1, state.regionPage.size!, state.regionPage.text)).data;
          const { total, regions: newRegions } = data;
          actions.setRegionPageInfo({
            total: total,
            number: state.regionPage.number! + 1,
          });
          actions.addRegionsRange(newRegions);
          setLoading(false);
        }
      },
      filter: (input: string, option: any) => {
        return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
      },
    },
    search: {
      city: async (value: string) => {
        const { cities: newCities, total }: ActiveCityDataResponse = (await getActiveCitiesByPage(1, state.cityPage.size!, value)).data;
        actions.setCityPageInfo({
          total: total,
          number: 1,
          text: value
        });
        actions.setCities(newCities);
      },
      region: async (value: string) => {
        const { regions: newRegions, total }: ActiveRegionDataResponse = (await getActiveRegionsByPage(1, state.regionPage.size!, value)).data;
        actions.setRegionPageInfo({
          total: total,
          number: 1,
          text: value
        });
        actions.setRegions(newRegions);
      },
    }
  }

  const validator = {
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
      { validator: checkFacebookLink },
    ],
    TwitterLink: [
      { validator: checkTwitterLink },
    ],
    InstagramLink: [
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
        <Form.Item name="SurName" rules={validator.SurName}>
          <Input className={styles.MyInput} placeholder="Прізвище" />
        </Form.Item>

        <Form.Item name="Name" rules={validator.Name}>
          <Input className={styles.MyInput} placeholder="Ім'я" />
        </Form.Item>

        <Form.Item name="MiddleName" rules={validator.MiddleName}>
          <Input className={styles.MyInput} placeholder="По батькові" />
        </Form.Item>

        <Form.Item name="Address" rules={validator.Address}>
          <Input className={styles.MyInput} placeholder="Місце проживання" />
        </Form.Item>

        <Form.Item
          rules={validator.Date}
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

        <TabList
          renderMode={TabRenderMode.UnmountOther}
          pairs={[{
            title: "Станиця",
            content: (
              <Form.Item
                name="CityId"
                rules={[{ required: true, message: emptyInput() }]}
              >
                <Select
                  onSearch={handler.search.city}
                  showSearch
                  onPopupScroll={(e: any) => handler.select.cityScroll(e)}
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
            )
          },
          {
            disabled: true,
            title: "АБO",
            content: (
              <></>
            )
          },
          {
            title: "В моєму осередку немає Пласту",
            content: (
              <Form.Item
                name="RegionId"
                rules={[{ required: true, message: emptyInput() }]}
              >
                <Select
                  onSearch={handler.search.region}
                  showSearch
                  onPopupScroll={(e: any) => handler.select.regionScroll(e)}
                  className={styles.MySelect}
                  placeholder="Оберіть округу"
                  filterOption={handler.select.filter}
                >
                  {state.regions.map((apd) => {
                    return (
                      <Select.Option key={apd.id} value={apd.id}>
                        {apd.regionName}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            )
          }
          ]}
        />

        <TabInputList items={
          [{
            tabTitle: "Facebook",
            formItem: {
              name: "FacebookLink",
              rules: validator.FacebookLink
            },
            input: {
              type: "url",
              className: styles.MyInput,
              placeholder: "Facebook сторінка"
            }
          },
          {
            tabTitle: "Twitter",
            formItem: {
              name: "TwitterLink",
              rules: validator.TwitterLink
            },
            input: {
              type: "url",
              className: styles.MyInput,
              placeholder: "Twitter сторінка"
            }
          },
          {
            tabTitle: "Instagram",
            formItem: {
              name: "InstagramLink",
              rules: validator.InstagramLink
            },
            input: {
              type: "url",
              className: styles.MyInput,
              placeholder: "Instagram сторінка"
            }
          }]
        } />

        <Form.Item
          name="Phone"
          rules={validator.PhoneNumber}
        >
          <div className={"ant-form-item-control-input-content"}>
            <ReactInputMask
              className={`ant-input ${styles.MyInput}`}
              mask="+380(99)-999-99-99"
              placeholder="Номер телефону"
            />
          </div>
        </Form.Item>

        <Form.Item name="Email" rules={validator.Email}>
          <Input
            className={styles.MyInput}
            placeholder="Електронна пошта" />
        </Form.Item>

        <Form.Item name="Password" rules={validator.Password}>
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