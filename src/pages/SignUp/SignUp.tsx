import React, { useEffect, useRef, useState } from "react";
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
import { ActiveRegionDataResponse, getActiveRegionsByPage, getRegions } from "../../api/regionsApi";
import TabInputList from "./TabInputList";
import { SelectValue } from "antd/lib/select";
import UkraineOblasts from "../../models/Oblast/UkraineOblasts";
import CheckboxsItem from "./CheckboxsItem";
import { OblastsWithoutNotSpecified } from "../../models/Oblast/OblastsRecord";
import RegionForAdministration from "../../models/Region/RegionForAdministration";

let authService = new AuthorizeApi();

const SignUp: React.FC = () => {
  const [form] = Form.useForm();
  const [available, setAvailabe] = useState(true);
  const [visible, setVisible] = useState(false);
  const [state, actions] = SingUpStore();
  const [cityLoading, setCityLoading] = useState(false);
  const [regionLoading, setRegionLoading] = useState(false);
  const [hasPlast, setHasntPlast] = useState(false);
  const [areaSelected, setAreaSelected] = useState(false);
  const regionSelectRef = useRef(null);
  const citySelectRef = useRef(null);
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
            = (await getActiveCitiesByPage(state.cityPage.number! + 1, state.cityPage.size!, undefined, state.formData.oblast)).data;
          const { total, cities: newCities } = data;
          actions.setCityPageInfo({
            total: total,
            number: state.cityPage.number! + 1,
          });
          actions.addCityRange(newCities);
          setCityLoading(false);
        }
      },
      filter: (input: string, option: any) => {
        return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.value === 0;
      },
    },
    change: {
      oblast: async (value: SelectValue) => {
        setAreaSelected(value !== UkraineOblasts.NotSpecified);
        setCityLoading(true);
        setRegionLoading(true);

        form.setFieldsValue({
          regionId: undefined,
          cityId: undefined
        });

        const cityPromise = getActiveCitiesByPage(1, state.cityPage.size!, null, Number(value));
        const regionPromise = getRegions(Number(value));

        const [cityRes, regionRes] = await Promise.all([cityPromise, regionPromise])

        const { cities, total: cityTotal }: ActiveCityDataResponse
          = cityRes.data
        const regions: RegionForAdministration[]
          = regionRes.data

        actions.setCities(cities);
        actions.setCityPageInfo({
          total: cityTotal,
          number: 1
        });

        actions.setRegions(regions);

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
      { required: true, message: emptyInput() }
    ],
    PhoneNumber: [
      { required: true, message: emptyInput() },
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
        layout="vertical"
        initialValues={state.formData}
        name="SignUpForm"
        form={form}
        onFinish={handler.submit}
      >
        <Form.Item label="Прізвище" name="lastName" rules={validator.LastName}>
          <Input placeholder="Введіть прізвище" />
        </Form.Item>

        <Form.Item label="Ім'я" name="firstName" rules={validator.FirstName}>
          <Input placeholder="Введіть ім'я" />
        </Form.Item>

        <Form.Item label="По батькові" name="fatherName" rules={validator.FatherName}>
          <Input placeholder="Введіть по батькові" />
        </Form.Item>

        <Form.Item label="Місце проживання" name="address" rules={validator.Address}>
          <Input placeholder="Введіть місце проживання" />
        </Form.Item>

        <Form.Item
          rules={validator.Date}
          name="birthday"
          label="Дата народження"
        >
          <DatePicker
            placeholder="Оберіть дату народження"
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
          label="Стать"
        >
          <Select>
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
          label="Область"
        >
          <Select
            aria-autocomplete="none"
            placeholder="Оберіть область"
            onChange={handler.change.oblast}
          >
            {OblastsWithoutNotSpecified.map(([key, value]) =>
              <Select.Option key={key} value={key}>
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
              label="Округа"
            >
              <Select
                ref={regionSelectRef}
                aria-autocomplete="none"
                disabled={!areaSelected}
                placeholder="Оберіть округу"
                value={state.formData.regionId}
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
              label="Станиця"
            >
              <Select
                aria-autocomplete="none"
                disabled={!areaSelected}
                onPopupScroll={(e: any) => handler.select.cityScroll(e)}
                placeholder="Оберіть станицю"
                value={state.formData.cityId}
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
              placeholder: "Введіть посилання на facebook сторінку"
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
              placeholder: "Введіть посилання на twitter сторінку"
            }
          },
          {
            tabTitle: "Instagram",
            formItem: {
              name: "instagramLink",
              rules: validator.InstagramLink,
            },
            input: {
              type: "url",
              placeholder: "Введіть посилання на instagram сторінку"
            }
          }]
        } />

        <Form.Item
          name="phoneNumber"
          rules={validator.PhoneNumber}
          label="Телефон"
        >
          <div className={"ant-form-item-control-input-content"}>
            <ReactInputMask
              className={`ant-input`}
              mask="+380(99)-999-99-99"
              placeholder="Введіть номер телефону"
            />
          </div>
        </Form.Item>

        <Form.Item label="Пошта" name="email" rules={validator.Email}>
          <Input
            placeholder="Введіть електронну пошту" />
        </Form.Item>

        <Form.Item name="password" label="Пароль" rules={validator.Password}>
          <Input.Password
            visibilityToggle={true}
            placeholder="Введіть пароль"
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          dependencies={["password"]}
          label="Підтверження пароля"
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
            placeholder="Введіть пароль ще раз"
          />
        </Form.Item>

        <CheckboxsItem
          title="Звідки ви дізналися про Пласт?"
          checkboxList={[
            "Від друзів, рідних",
            "Facebook",
            "Інші соцмережі",
            "Телебачення",
            "Інтернет ЗМІ",
            "Захід у моєму місті",
            "У навчальному закладі",
            "Пройшов онлайн курс ВУМ",
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