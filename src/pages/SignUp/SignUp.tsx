import React, { FormEventHandler } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import styles from './SignUp.module.css';
import Switcher from './Switcher/Switcher';
import authorizeApi from '../../api/authorizeApi';
import * as Yup from 'yup';
import {Spin, Space} from 'antd';
 
const RegExp = /^[a-zA-Zа-яА-ЯІіЄєЇїҐґ']{1,20}((\s+|-)[a-zA-Zа-яА-ЯІіЄєЇїҐґ']{1,20})*$/;

const validationSchema = Yup.object().shape({
  Email: Yup.string()
    .email('Введене поле не є правильним для електронної пошти')
    .required('Поле електронна пошта є обовязковим'),

  Password: Yup.string()
    .required('Поле пароль є обовязковим'),

  ConfirmPassword: Yup.string()
    .required('Поле повторення пароля є обовязковим'),

  Name: Yup.string()
    .required('Поле імя є обовязковим')
    .matches(RegExp, 'Імя має містити тільки літери'),

  SurName: Yup.string()
    .required('Поле прізвище є обовязковим')
    .matches(RegExp, 'Прізвище має містити тільки літери'),

});


const initialValues = { Email: '', Password: '', Name: '', SurName: '', ConfirmPassword: '' }

export default function () {

  const onSubmit = async (values: any) => {
    await authorizeApi.register(values);
  };

  return (
    <div className={styles.mainContainer}>
      <Switcher page="SignUp" />
      <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
        {({ values, handleSubmit, handleChange, isSubmitting, isValid, errors, touched }) => (
          <Form>
            <Field name="Email" type="email" value={values.Email} onChange={handleChange} component={MyInput} className={styles.MyInput}
              placeholder="Електронна пошта" />
            <ErrorMessage  name="Email">{(msg) => <div>{msg}</div>}</ErrorMessage>
            <Field name="Password" type="password" value={values.Password} onChange={handleChange} component={MyInput} className={styles.MyInput}
              placeholder="Пароль" />
              {errors.Password && touched.Password ? (
              <div>{errors.Password}</div>
            ) : null}
            <Field name="ConfirmPassword" type="password" value={values.ConfirmPassword} onChange={handleChange} component={MyInput} className={styles.MyInput}
              placeholder="Повторіть пароль" />
              {errors.ConfirmPassword && touched.ConfirmPassword? (
              <div>{errors.ConfirmPassword}</div>
            ) : null}
            <Field name="Name" type="text" value={values.Name} onChange={handleChange} component={MyInput} className={styles.MyInput}
              placeholder="Ім'я" />
              {errors.Name && touched.Name ? (
              <div>{errors.Name}</div>
            ) : null}
            <Field name="SurName" type="text" value={values.SurName} onChange={handleChange} component={MyInput} className={styles.MyInput}
              placeholder="Прізвище" />
              {errors.SurName && touched.SurName ? (
              <div>{errors.SurName}</div>
            ) : null}
            <button type="submit" id={styles.confirmButton}>Зареєструватись</button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

const MyInput = ({ field, form, ...props }: any) => {
  return <input {...field} {...props} />;
};
