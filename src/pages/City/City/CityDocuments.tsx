import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {Avatar, Button, Card, Layout} from 'antd';
import {FileTextOutlined, SettingOutlined, CloseOutlined, RollbackOutlined} from '@ant-design/icons';
import {getAllDocuments} from "../../../api/citiesApi";
import classes from './City.module.css';
import CityDocument from '../../../models/City/CityDocument';

const CityDocuments = () => {
    const {id} = useParams();
    const history = useHistory();

    const [documents, setDocuments] = useState<CityDocument[]>([]);
    const [canEdit, setCanEdit] = useState<Boolean>(false);

    const getDocuments = async () => {
        const response = await getAllDocuments(id);

        setDocuments(response.data.documents);
        setCanEdit(response.data.canEdit)
    };

    useEffect(() => {
        getDocuments();
    }, []);

    return (
      <Layout.Content>
        <h1 className={classes.mainTitle}>Документи станиці</h1>
        <div className={classes.wrapper}>
          {documents.length > 0 ? (
            documents.map((document: CityDocument) => (
              <Card
                key={document.id}
                className={classes.detailsCard}
                actions={[
                  <SettingOutlined key="setting" />,
                  <CloseOutlined key="close" />,
                ]}
              >
                <Avatar
                  size={86}
                  icon={<FileTextOutlined />}
                  className={classes.detailsIcon}
                />
                <Card.Meta
                  className={classes.detailsMeta}
                  title={`${document.cityDocumentType.name}`}
                />
              </Card>
            ))
          ) : (
            <h1>Ще немає документів станиці</h1>
          )}
        </div>
        <div className={classes.wrapper}>
          <Button
            className={classes.backButton}
            icon={<RollbackOutlined />}
            size={"large"}
            onClick={() => history.goBack()}
            type="primary"
          >
            Назад
          </Button>
        </div>
      </Layout.Content>
    );
};
export default CityDocuments;
