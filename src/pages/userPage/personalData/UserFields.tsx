import React from 'react';
import {Button} from 'antd';
import styles from './PersonalData.module.css';

export default function () {
  return (
    <div className={styles.userFieldsWrapper}>
      <h2 className={styles.title}>Особистий профіль</h2>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <tbody>
            <tr>
              <td className={styles.td}>Прізвище:</td>
              <td className={styles.td}>Ім`я:</td>
            </tr>
            <tr>
              <td className={styles.td}>
                <span>Хартманє</span>
              </td>
              <td className={styles.td}>
                <span>Василь</span>
              </td>
            </tr>
            <tr>
              <td className={styles.td}>Email:</td>
              <td className={styles.td}>Номер телефону:</td>
            </tr>
            <tr>
              <td className={styles.td}>
                <span>admin@eplast.com</span>
              </td>
              <td className={styles.td}>
                <span>00-00-000-00</span>
              </td>
            </tr>
            <tr>
              <td className={styles.td}>Національність:</td>
              <td className={styles.td}>Віровизнання:</td>
            </tr>
            <tr>
              <td className={styles.td}>
                <span>Національність</span>
              </td>
              <td className={styles.td}>
                <span>Агностик</span>
              </td>
            </tr>
            <tr>
              <td className={styles.td}>Дата народження:</td>
              <td className={styles.td}>Стать:</td>
            </tr>
            <tr>
              <td className={styles.td}>
                <span>06-08-1949</span>
              </td>
              <td className={styles.td}>
                <span>Жінка</span>
              </td>
            </tr>
            <tr>
              <td className={styles.td}>Місце навчання:</td>
              <td className={styles.td}>Спецальність:</td>
            </tr>
            <tr>
              <td className={styles.td}>
                <span>Львів</span>
              </td>
              <td className={styles.td}>
                <span>Ветеренарія</span>
              </td>
            </tr>
            <tr>
              <td className={styles.td}>Ступінь:</td>
              <td className={styles.td}>Місце роботи:</td>
            </tr>
            <tr>
              <td className={styles.td}>
                <span>Бакалавр</span>
              </td>
              <td className={styles.td}>
                <span>Кременчук</span>
              </td>
            </tr>
          </tbody>
        </table>
          <Button className={styles.btn}>Обрати/змінити курінь</Button>
      </div>
    </div>
  );
}