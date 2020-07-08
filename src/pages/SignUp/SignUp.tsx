import React, { FormEventHandler } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import styles from './SignUp.module.css';
import Switcher from './Switcher/Switcher';
import authorizeApi from '../../api/authorizeApi';

const initialValues = { Email: '', Password: '', Name: '', SurName: '', ConfirmPassword: '' }

export default function () {

  const onSubmit = async (values: any) => {
    await authorizeApi.register(values);
  };

  return (
    <div className={styles.mainContainer}>
      <Switcher page="SignUp" />
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ values, handleSubmit, handleChange, isSubmitting, isValid, errors, touched }) => (
          <Form>
            <Field name="Email" type="email" value={values.Email} onChange={handleChange} component={MyInput} className={styles.MyInput}
              placeholder="Електронна пошта" />
            <Field name="Password" type="password" value={values.Password} onChange={handleChange} component={MyInput} className={styles.MyInput}
              placeholder="Пароль" />
            <Field name="ConfirmPassword" type="password" value={values.ConfirmPassword} onChange={handleChange} component={MyInput} className={styles.MyInput}
              placeholder="Повторіть пароль" />
            <Field name="Name" type="text" value={values.Name} onChange={handleChange} component={MyInput} className={styles.MyInput}
              placeholder="Ім'я" />
            <Field name="SurName" type="text" value={values.SurName} onChange={handleChange} component={MyInput} className={styles.MyInput}
              placeholder="Прізвище" />
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
