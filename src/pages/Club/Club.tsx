import React, {useState} from 'react';
import {useParams} from 'react-router-dom';
import {Avatar, Row, Col, Button, Typography} from 'antd';
import {UserOutlined, FileTextOutlined, EditOutlined} from '@ant-design/icons';
import clubImg from '../../assets/images/clubBuryverkhy.png';

const classes = require('./Club.module.css');

const Club = () => {
  const {id} = useParams();
  // let club = clubsList.find((club) => club.id === id);
  const club = {
    id,
    imgSrc: clubImg,
    email: 'lviv@plast.org',
    site: 'https://www.lviv.plast.org/',
    name: 'Буриверхи',
    description: 'Влітку 1947р. відбувся з’їзд старшопластунок на оселі "Гроссе Бірке” в Баварії, а в нашому жаргоні "Велика Береза”. 3’їхалися туди старшопластунки з різних переселенчих Ді-Пі та­борів з німецької і французької зон. Були там самостійні гуртки "Ті, що греблі рвуть”, "Веселі Відьми”, "Сороки”, "Оси”, "Мавки” та багато інших. Після довгої гутірки з подругою Цьопою Палій ми рішили не роздрібнюва­тися на самостійні гуртки, а створити сильні великі курені, яких з’єднува­ла б спеціалізація. А що треба було нам новацьких і юнацьких виховниць – рішено гуртуватися в тих двох напрямах. І так в дусі "Великої Берези”, в дні 29 вересня 1947 р. в Мюнхені в Фюріхшулє відбулися ініціативні сходини створення нашого куреню "Перші Стежі”, який за спеціалізацію вибрав собі виховну працю в юнацтві та ор­ганізування таборів. Про ці події трохи більше сказано у нашій хроніці під заголовком "До Праісторії Перших Стеж”, де Дада Мосора описує почут­тя "Гребельок”, Очка Дереш "Відьомок”, а Люба Лисевич "Сорок”.',
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
  };

  const [expand, setExpand] = useState(false);
  const [counter, setCounter] = useState(0);

  const typoExpand = () => {
    setExpand(true);
    setCounter(!expand? counter : counter + 1);
  };

  const typoClose = () => {
    setExpand(false);
    setCounter( !expand? counter: counter + 1);
  };

  return (
      <div>
        <Row justify="space-around" gutter={[0, 40]} style={{overflow: 'hidden'}}>
          <Col flex="0 1 63%" style={{minHeight: '180px', marginLeft: '1.5%', marginRight: '1.5%'}}>
            <section className={classes.list}>
              <EditOutlined className={classes.listIcon}/>
              <h1>{`Курінь ${club.name}`}</h1>
              <Row gutter={16} justify="space-around" style={{marginTop: '20px'}}>
                <Col flex="1" offset={1}>
                  <div className={classes.mainInfo}>
                    <img src={club.imgSrc} alt="club" style={{width: '30%', height: 'auto', maxWidth: '100%'}}/>
                    <p>
                      <b>Бунчужний</b>: {club.mainPerson}
                    </p>
                    <Button type="primary" className={classes.listButton}>
                      Більше
                    </Button>
                  </div>
                </Col>
                <Col flex="1" offset={1}>
                  <div className={classes.aboutInfo} key={counter}>
                    <Typography.Paragraph
                        ellipsis={{
                          rows: 11,
                          expandable: true,
                          onExpand: typoExpand,
                          symbol: 'Більше'
                        }}>{club.description}</Typography.Paragraph>
                    {expand && <Button type="primary" onClick={typoClose}>Приховати</Button>}
                  </div>
                </Col>
              </Row>
            </section>
          </Col>
          <Col flex="0 1 30%" style={{minHeight: '180px', marginLeft: '1.5%', marginRight: '1.5%'}}>
            <section className={classes.list}>
              <h1>Члени куреня</h1>
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
                {club.members.map((member: any) => (
                    <Col key={member.id} className={classes.listItem} span={7}>
                      <Avatar size={64} icon={<UserOutlined/>} className={classes.profileImg}/>
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

        <Row justify="space-around" gutter={[0, 40]} style={{overflow: 'hidden', marginTop: '20px'}}>
          <Col flex="0 1 30%" style={{minHeight: '180px', marginLeft: '1.5%', marginRight: '1.5%'}}>
            <section className={classes.list}>
              <h1>Провід куреня</h1>
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
                {club.dilovody.map((member: any) => (
                    <Col key={member.id} className={classes.listItem} span={7}>
                      <Avatar size={64} icon={<UserOutlined/>} className={classes.profileImg}/>
                      <p>{member.name}</p>
                    </Col>
                ))}
              </Row>
              <Button type="primary" className={classes.listButton}>
                Деталі
              </Button>
            </section>
          </Col>

          <Col flex="0 1 30%" style={{minHeight: '180px', marginLeft: '1.5%', marginRight: '1.5%'}}>
            <section className={classes.list}>
              <h1>Документообіг куреня</h1>
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
                {club.documents.map((document: any) => (
                    <Col key={document.id} className={classes.listItem} span={7}>
                      <FileTextOutlined style={{fontSize: '60px'}} className={classes.profileImg}/>
                      <p>{document.name}</p>
                    </Col>
                ))}
              </Row>
              <Button type="primary" className={classes.listButton}>
                Деталі
              </Button>
            </section>
          </Col>

          <Col flex="0 1 30%" style={{minHeight: '180px', marginLeft: '1.5%', marginRight: '1.5%'}}>
            <section className={classes.list}>
              <h1>Прихильники куреня</h1>
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
                {club.followers.map((member: any) => (
                    <Col key={member.id} className={classes.listItem} span={7}>
                      <Avatar size={64} icon={<UserOutlined/>} className={classes.profileImg}/>
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

export default Club;
