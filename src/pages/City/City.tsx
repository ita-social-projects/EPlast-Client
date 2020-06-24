import React from 'react';
import { useParams } from 'react-router-dom';
import { Avatar, Row, Col, Button } from 'antd';
import { UserOutlined, FileTextOutlined, EditOutlined } from '@ant-design/icons';
import CityImg from '../../assets/images/city.jpg';

const classes = require('./City.module.css');

const City = () => {
  const { id } = useParams();
  // let city = citiesList.find((city) => city.id === id);
  const city = {
    id,
    imgSrc: CityImg,
    email: 'lviv@plast.org',
    site: 'https://www.lviv.plast.org/',
    name: 'Львів',
    mainPerson: 'Орися Пампушок',
    members: [
      {
        id: '5',
        name: 'Антон Гандарка',
      },
      {
        id: '6',
        name: 'Орися Пампушок',
      },
      {
        id: '7',
        name: 'Микола Сиклань',
      },
      {
        id: '8',
        name: 'Антоніна Вокер',
      },
    ],
    dilovody: [
      {
        id: '9',
        name: 'Микола Сиклань',
      },
      {
        id: '10',
        name: 'Антоніна Вокер',
      },
    ],
    documents: [
      {
        id: '1',
        name: 'Протокол',
      },
      {
        id: '2',
        name: 'Протокол',
      },
    ],
    followers: [
      {
        id: '11',
        name: 'Микола Сиклань',
      },
      {
        id: '12',
        name: 'Антоніна Вокер',
      },
    ],
    iframe:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2572.880255866894!2d24.008694931223562!3d49.844707443568716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x473add9e79c65cfb%3A0x658abf5bae8c670a!2z0LLRg9C70LjRhtGPINCo0LXQstGH0LXQvdC60LAsIDE3LCDQm9GM0LLRltCyLCDQm9GM0LLRltCy0YHRjNC60LAg0L7QsdC70LDRgdGC0YwsIDc5MDAw!5e0!3m2!1suk!2sua!4v1592233169754!5m2!1suk!2sua',
  };
  return (
    <div>
      <Row justify="space-around" gutter={[0, 40]} style={{ overflow: 'hidden' }}>
        <Col flex="0 1 63%" style={{ minHeight: '180px', marginLeft: '1.5%', marginRight: '1.5%' }}>
          <section className={classes.list}>
            <EditOutlined className={classes.listIcon} />
            <h1>{`Станиця ${city.name}`}</h1>
            <Row gutter={16} justify="space-around" style={{ marginTop: '20px' }}>
              <Col flex="1" offset={1}>
                <div className={classes.mainInfo}>
                  <img src={city.imgSrc} alt="City" style={{ width: '100%', height: 'auto', maxWidth: '100%' }} />
                  <p>
                    <b>Станичний</b>: {city.mainPerson}
                  </p>
                  <p>
                    <b>2019 - </b>
                  </p>
                </div>
              </Col>
              <Col flex="1" offset={1}>
                <iframe src={city.iframe} title="map" aria-hidden="false" className={classes.mainMap} />
                <div className={classes.contactsInfo}>
                  <p>
                    <b>Контакти</b>: {city.email}
                  </p>
                </div>
              </Col>
            </Row>
          </section>
        </Col>
        <Col flex="0 1 30%" style={{ minHeight: '180px', marginLeft: '1.5%', marginRight: '1.5%' }}>
          <section className={classes.list}>
            <h1>Члени станиці</h1>
            <Row
              justify="space-around"
              gutter={[0, 16]}
              style={{
                paddingRight: '5px',
                paddingLeft: '5px',
                overflow: 'hidden',
                maxHeight: '70%',
                marginTop: '20px',
              }}
            >
              {city.members.map((member: any) => (
                <Col key={member.id} className={classes.listItem} span={7}>
                  <Avatar size={64} icon={<UserOutlined />} className={classes.profileImg} />
                  <p>{member.name}</p>
                </Col>
              ))}
            </Row>
            <Button type="primary" className={classes.listButton}>
              Більше
            </Button>
          </section>
        </Col>
      </Row>

      <Row justify="space-around" gutter={[0, 40]} style={{ overflow: 'hidden', marginTop: '20px' }}>
        <Col flex="0 1 30%" style={{ minHeight: '180px', marginLeft: '1.5%', marginRight: '1.5%' }}>
          <section className={classes.list}>
            <h1>Діловоди станиці</h1>
            <Row
              justify="space-around"
              gutter={[0, 16]}
              style={{
                paddingRight: '5px',
                paddingLeft: '5px',
                paddingTop: '20px',
                paddingBottom: '20px',
                overflow: 'hidden',
                maxHeight: '70%',
              }}
            >
              {city.dilovody.map((member: any) => (
                <Col key={member.id} className={classes.listItem} span={7}>
                  <Avatar size={64} icon={<UserOutlined />} className={classes.profileImg} />
                  <p>{member.name}</p>
                </Col>
              ))}
            </Row>
            <Button type="primary" className={classes.listButton}>
              Деталі
            </Button>
          </section>
        </Col>

        <Col flex="0 1 30%" style={{ minHeight: '180px', marginLeft: '1.5%', marginRight: '1.5%' }}>
          <section className={classes.list}>
            <h1>Документообіг станиці</h1>
            <Row
              justify="space-around"
              gutter={[0, 16]}
              style={{
                paddingRight: '5px',
                paddingLeft: '5px',
                paddingTop: '20px',
                paddingBottom: '20px',
                overflow: 'hidden',
                maxHeight: '70%',
              }}
            >
              {city.documents.map((document: any) => (
                <Col key={document.id} className={classes.listItem} span={7}>
                  <FileTextOutlined style={{ fontSize: '60px' }} className={classes.profileImg} />
                  <p>{document.name}</p>
                </Col>
              ))}
            </Row>
            <Button type="primary" className={classes.listButton}>
              Деталі
            </Button>
          </section>
        </Col>

        <Col flex="0 1 30%" style={{ minHeight: '180px', marginLeft: '1.5%', marginRight: '1.5%' }}>
          <section className={classes.list}>
            <h1>Прихильники станиці</h1>
            <Row
              justify="space-around"
              gutter={[0, 16]}
              style={{
                paddingRight: '5px',
                paddingLeft: '5px',
                paddingTop: '20px',
                paddingBottom: '20px',
                overflow: 'hidden',
                maxHeight: '70%',
              }}
            >
              {city.followers.map((member: any) => (
                <Col key={member.id} className={classes.listItem} span={7}>
                  <Avatar size={64} icon={<UserOutlined />} className={classes.profileImg} />
                  <p>{member.name}</p>
                </Col>
              ))}
            </Row>
            <Button type="primary" className={classes.listButton}>
              Більше
            </Button>
          </section>
        </Col>
      </Row>
    </div>
  );
};

export default City;
