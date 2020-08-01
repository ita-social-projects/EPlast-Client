import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {Avatar, Card, Layout} from 'antd';
import {FileTextOutlined, SettingOutlined, CloseOutlined} from '@ant-design/icons';
import {getAllDocuments} from "../../api/citiesApi";
import classes from './City.module.css';
import CityDocument from './../../models/City/CityDocument';

const CityDocuments = () => {
    const {id} = useParams();

    const [documents, setDocuments] = useState<CityDocument[]>([]);

    const getDocuments = async () => {
        const response = await getAllDocuments(id);
        setDocuments(response.data);
    };

    useEffect(() => {
        getDocuments();
    }, []);

    return (
        <Layout.Content>
            <h1 className={classes.mainTitle}>Документи станиці</h1>
            <div className={classes.wrapper}>
                {documents.map((document: CityDocument) => (
                    <Card
                        key={document.id}
                        className={classes.detailsCard}
                        actions={[
                            <SettingOutlined key="setting"/>,
                            <CloseOutlined key="close"/>,
                        ]}
                    >
                        <Avatar size={86} icon={<FileTextOutlined/>} className={classes.detailsIcon}/>
                        <Card.Meta className={classes.detailsMeta}
                                   title={`${document.cityDocumentType.name}`}/>
                    </Card>
                ))}
            </div>
        </Layout.Content>
    );
};
export default CityDocuments;
