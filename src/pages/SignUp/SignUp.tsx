import React, { useEffect, useState } from "react";
import { Form, Input, Button, Modal, Select, DatePicker, Tabs, Space, Spin, Switch, Checkbox } from "antd";
import styles from "./SignUp.module.css";
import Switcher from "./Switcher/Switcher";
import { checkAddress, checkEmail, checkFacebookLink, checkInstagramLink, checkNameSurName, checkOblastIsSpecified, checkPassword, checkPhone, checkTwitterLink } from "./verification";
import AuthorizeApi from "../../api/authorizeApi";
import { useHistory } from "react-router-dom";
import {
  emptyInput,
  minLength,
} from "../../components/Notifications/Messages";
import TermsOfUseModel from "../../models/TermsOfUse/TermsOfUseModel";
import termsApi from "../../api/termsApi";
import { Markup } from "interweave";
import { ActiveCityDataResponse, getActiveCitiesByPage } from "../../api/citiesApi";
import { GenderIdEnum, GenderNameEnum, genderRecords } from "../../models/UserTable/Gender";
import moment from "moment";
import ReactInputMask from "react-input-mask";
import { SingUpStore } from "../../stores/SingUpStore";
import { ActiveRegionDataResponse, getActiveRegionsByPage } from "../../api/regionsApi";
import TabList, { TabRenderMode } from "./TabList";
import TabInputList from "./TabInputList";
import Spinner from "../Spinner/Spinner";
import OblastsRecord from "../../models/Oblast/OblastsRecord";
import { SelectValue } from "antd/lib/select";
import UkraineOblasts from "../../models/Oblast/UkraineOblasts";
import CheckboxsItem from "./CheckboxsItem";

let authService = new AuthorizeApi();

const SignUp: React.FC = () => {
  const [form] = Form.useForm();
  const [available, setAvailabe] = useState(true);
  const [visible, setVisible] = useState(false);
  const [state, actions] = SingUpStore();
  const [cityLoading, setCityLoading] = useState(false);
  const [regionLoading, setRegionLoading] = useState(false);
  const [cityTimeout, setCityTimeout] = useState(setTimeout(() => { }, 0));
  const [regionTimeout, setRegionTimeout] = useState(setTimeout(() => { }, 0));
  const [hasPlast, setHasntPlast] = useState(false)
  const [areaSelected, setAreaSelected] = useState(false);
  const history = useHistory();

  useEffect(() => {

    (async () => {
      const termsData: TermsOfUseModel = await termsApi.getTerms();
      actions.setTerms(termsData);

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
        const { facebookLink, twitterLink, instagramLink, fatherName }
          = state.formData
        const request = {
          ...state.formData,
          referal: state.formData.referals.join(', '),
          referals: undefined,
          facebookLink: facebookLink === "" ? null : facebookLink,
          twitterLink: twitterLink === "" ? null : twitterLink,
          instagramLink: instagramLink === "" ? null : instagramLink,
          fatherName: fatherName === "" ? null : fatherName,
        };
        await authService.register(request);
        setAvailabe(true);
        history.push("/signin");
      },
      cancel: async () => {
        setVisible(false);
      }
    },
    select: {
      cityScroll: async (event: Event) => {
        const target = event.target as HTMLDivElement;
        const currentPosition = target.scrollTop + target.offsetHeight;
        const fetchPosition = target.scrollHeight - 120;
        if (cityLoading === false
          && currentPosition > fetchPosition
          && Math.ceil(state.cityPage.total! / state.cityPage.size!) !== state.cityPage.number!) {
          setCityLoading(true);
          const data: ActiveCityDataResponse
            = (await getActiveCitiesByPage(state.cityPage.number! + 1, state.cityPage.size!, state.cityPage.text, state.formData.oblast)).data;
          const { total, cities: newCities } = data;
          actions.setCityPageInfo({
            total: total,
            number: state.cityPage.number! + 1,
          });
          actions.addCityRange(newCities);
          setCityLoading(false);
        }
      },
      regionScroll: async (event: Event) => {
        const target = event.target as HTMLDivElement;
        const currentPosition = target.scrollTop + target.offsetHeight;
        const fetchPosition = target.scrollHeight - 120;
        if (regionLoading === false
          && currentPosition > fetchPosition
          && Math.ceil(state.regionPage.total! / state.regionPage.size!) !== state.regionPage.number!) {
          setRegionLoading(true);
          const data: ActiveRegionDataResponse
            = (await getActiveRegionsByPage(state.regionPage.number! + 1, state.regionPage.size!, state.regionPage.text, state.formData.oblast)).data;
          const { total, regions: newRegions } = data;
          actions.setRegionPageInfo({
            total: total,
            number: state.regionPage.number! + 1,
          });
          actions.addRegionsRange(newRegions);
          setRegionLoading(false);
        }
      },
      filter: (input: string, option: any) => {
        return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.value === 0;
      },
    },
    search: {
      city: (value: string) => {
        clearTimeout(cityTimeout);
        setCityLoading(true);
        const timeout = setTimeout(async () => {
          const { cities: newCities, total }: ActiveCityDataResponse = (await getActiveCitiesByPage(1, state.cityPage.size!, value)).data;
          actions.setCityPageInfo({
            total: total,
            number: 1,
            text: value
          });
          actions.setCities(newCities);
          setCityLoading(false);
        }, 750);
        setCityTimeout(timeout);
      },
      region: (value: string) => {
        clearTimeout(regionTimeout);
        setRegionLoading(true);
        const timeout = setTimeout(async () => {
          const { regions: newRegions, total }: ActiveRegionDataResponse = (await getActiveRegionsByPage(1, state.regionPage.size!, value)).data;
          actions.setRegionPageInfo({
            total: total,
            number: 1,
            text: value
          });
          actions.setRegions(newRegions);
          setRegionLoading(false);
        }, 750);
        setRegionTimeout(timeout);
      },
    },
    change: {
      oblast: async (value: SelectValue) => {
        setAreaSelected(value !== UkraineOblasts.NotSpecified);
        setCityLoading(true);
        setRegionLoading(true);

        const { cities, total: cityTotal }: ActiveCityDataResponse
          = (await getActiveCitiesByPage(1, state.cityPage.size!, null, Number(value))).data;

        actions.setCities(cities);
        actions.setCityPageInfo({
          total: cityTotal,
          number: 1
        });

        const { regions, total: regionTotal }: ActiveRegionDataResponse
          = (await getActiveRegionsByPage(1, state.regionPage.size!, null, Number(value))).data

        actions.setRegions(regions);
        actions.setRegionPageInfo({
          total: regionTotal,
          number: 1
        });

        setCityLoading(false);
        setRegionLoading(false);
      },
      hasPlast: async () => {
        setHasntPlast(!hasPlast)
      },
    }
  };

  const validator = {
    Email: [
      { required: true, message: emptyInput() },
      { validator: checkEmail },
    ],
    Password: [
      { required: true, message: emptyInput() },
      { validator: checkPassword },
    ],
    FirstName: [
      { required: true, message: emptyInput() },
      { validator: checkNameSurName },
    ],
    LastName: [
      { required: true, message: emptyInput() },
      { validator: checkNameSurName },
    ],
    FatherName: [
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
    Oblast: [
      { required: true, message: emptyInput() },
      { validator: checkOblastIsSpecified }
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
        initialValues={state.formData}
        name="SignUpForm"
        form={form}
        onFinish={handler.submit}
      >
        <Form.Item name="lastName" rules={validator.LastName}>
          <Input className={styles.MyInput} placeholder="Прізвище" />
        </Form.Item>

        <Form.Item name="firstName" rules={validator.FirstName}>
          <Input className={styles.MyInput} placeholder="Ім'я" />
        </Form.Item>

        <Form.Item name="fatherName" rules={validator.FatherName}>
          <Input className={styles.MyInput} placeholder="По батькові" />
        </Form.Item>

        <Form.Item name="address" rules={validator.Address}>
          <Input className={styles.MyInput} placeholder="Місце проживання" />
        </Form.Item>

        <Form.Item
          rules={validator.Date}
          name="birthday"
        >
          <DatePicker
            placeholder="Дата народження"
            className={styles.MyDatePicker}
            format="DD.MM.YYYY"
            disabledDate={current => {
              return current && current > moment();
            }}
          />
        </Form.Item>

        <Form.Item
          name="genderId"
          initialValue={GenderNameEnum.NotSpecified}
        >
          <Select
            className={styles.MySelect}
            placeholder="Стать">
            <Select.Option value={GenderIdEnum.UnwillingToChoose}>
              {genderRecords[GenderIdEnum.UnwillingToChoose]}
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
          name="oblast"
          rules={validator.Oblast}
        >
          <Select
            showSearch
            className={styles.MySelect}
            placeholder="Оберіть область"
            onChange={handler.change.oblast}
            filterOption={handler.select.filter}
          >
            {Object.entries(OblastsRecord).map(([key, value]) =>
              <Select.Option key={key} value={Number(key)}>
                {value}
              </Select.Option>
            )}
          </Select>
        </Form.Item>
        <Checkbox className={styles.MyCheckbox} disabled={!areaSelected} checked={hasPlast} onChange={handler.change.hasPlast}>
          В моєму осередку немає пласту
        </Checkbox>
        {
          hasPlast
            ? <Form.Item
              name="regionId"
              rules={[{ required: true, message: emptyInput() }]}
            >
              <Select
                onSearch={handler.search.region}
                showSearch
                disabled={!areaSelected}
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
            : <Form.Item
              name="cityId"
              rules={[{ required: true, message: emptyInput() }]}
            >
              <Select
                onSearch={handler.search.city}
                showSearch
                disabled={!areaSelected}
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
        }
        <TabInputList items={
          [{
            tabTitle: "Facebook",
            formItem: {
              name: "facebookLink",
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
              name: "twitterLink",
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
              name: "instagramLink",
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
          name="phoneNumber"
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

        <Form.Item name="email" rules={validator.Email}>
          <Input
            className={styles.MyInput}
            placeholder="Електронна пошта" />
        </Form.Item>

        <Form.Item name="password" rules={validator.Password}>
          <Input.Password
            visibilityToggle={true}
            className={styles.MyInput}
            placeholder="Пароль"
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            {
              required: true,
              message: emptyInput(),
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue("password") === value) {
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

        <CheckboxsItem
          title="Звідки ви дізналися про Пласт?"
          checkboxList={[
            "Друг",
            "Подруга",
            "Соц мережі"
          ]}
          name="referals"
        />

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