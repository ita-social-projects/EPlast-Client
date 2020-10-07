import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Data } from "../Interface/Interface";
import userApi from '../../../api/UserApi';
import notificationLogic from '../../../components/Notifications/Notification';
import AvatarAndProgress from "../personalData/AvatarAndProgress";
import { getDocumentByUserId, removeDocument, getFile } from "../../../api/blankApi";
import { Button, Col } from "antd";
import classes from "./Blanks.module.css";
import Title from "antd/lib/typography/Title";
import { DeleteOutlined, DownloadOutlined, FileTextOutlined } from "@ant-design/icons";
import AddBiographyModal from "./UserBiography/AddBiographyModal";
import BlankDocument from "../../../models/Blank/BlankDocument";
import Paragraph from "antd/lib/typography/Paragraph";
import Spinner from "../../Spinner/Spinner";


export const Blanks = () => {
    const { userId } = useParams();
    const [data, setData] = useState<Data>();
    const [document, setDocument] = useState<BlankDocument>(new BlankDocument());
    const [visibleModal, setVisibleModal] = useState(false);
    const [documents, setDocuments] = useState<BlankDocument[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        await userApi.getById(userId).then(response => {
            setData(response.data);
        }).catch(() => { notificationLogic('error', "Щось пішло не так") })
        setLoading(true);
    };

    const onAdd = (newDocument: BlankDocument) => {
        if (documents.length < 6) {
            setDocuments([...documents, newDocument]);
        }
    };
    const getDocument = async () => {
        const response = await getDocumentByUserId(userId);
        setDocuments(response.data);
    };
    const removeDocumentById = async (documentId: number) => {
        await removeDocument(documentId);
        notificationLogic('success', "Файл успішно видалено");

        setDocuments(documents.filter((d) => d.id !== documentId));
    };

    const downloadDocument = async (fileBlob: string, fileName: string) => {
        await getFile(fileBlob, fileName);
    }

    useEffect(() => {
        fetchData();
        getDocument();

    }, [userId, visibleModal]);

    return (loading === false ? (
        <Spinner />
    ) : (
            <>
                <p></p>
                <div className={classes.wrapper}>
                    <div className={classes.wrapperImg}>
                        <AvatarAndProgress imageUrl={data?.user.imagePath}
                            time={data?.timeToJoinPlast}
                            firstName={data?.user.firstName}
                            lastName={data?.user.lastName}
                            isUserPlastun={data?.isUserPlastun} />
                    </div>
                    <div className={classes.wrapperCol}>
                        <div className={classes.wrapper}>
                            <div className={classes.wrapper2}>
                                <Title level={2}>Життєпис</Title>
                                <div className={classes.line} />
                                {documents.length !== 0 ? (
                                    documents.map((document) => (
                                        <Col
                                            xs={12}
                                            sm={8}
                                            key={document.id}
                                        >
                                            <div>
                                                <FileTextOutlined className={classes.documentIcon} />
                                                <Paragraph ellipsis={{ rows: 2, suffix: " " }}>
                                                    {document.fileName}
                                                </Paragraph>
                                            </div>

                                            <DownloadOutlined
                                            className={classes.downloadIcon}
                                                key="download"
                                                onClick={() =>
                                                    downloadDocument(
                                                        document.blobName,
                                                        document.fileName
                                                    )
                                                }
                                            />
                                            <DeleteOutlined 
                                            className={classes.deleteIcon}
                                                key="close"
                                                onClick={() => removeDocumentById(document.id)}
                                            />
                                        </Col>
                                    ))
                                ) : (
                                        <Col>
                                        <h2>Ви ще не додали Життєпис</h2>
                                            <div>
                                                <Button type="primary"
                                                    className={classes.addIcon}
                                                    onClick={() => setVisibleModal(true)}>
                                                    Створити Життєпис
                                            </Button>
                                            </div>
                                        </Col>
                                    )}

                            </div>

                            <div className={classes.wrapper3}>
                                <Title level={2}>Генерація</Title>
                                <div className={classes.line} />
                            </div>
                        </div>

                        <div className={classes.wrapper}>
                            <div className={classes.wrapper4}>
                                <Title level={2}>Сертифікати</Title>
                                <div className={classes.line} />
                            </div>

                            <div className={classes.wrapper5}>
                                <Title level={2}>СВУ</Title>
                                <div className={classes.line} />
                            </div>

                        </div>

                        <div className={classes.wrapper}>
                            <div className={classes.wrapper6}>
                                <Title level={2}>Пошук</Title>
                                <div className={classes.line} />
                            </div>



                        </div>

                    </div>
                </div>

                <AddBiographyModal
                    userId={data?.user.id}
                    document={document}
                    setDocument={setDocument}
                    visibleModal={visibleModal}
                    setVisibleModal={setVisibleModal}
                    onAdd={onAdd}
                ></AddBiographyModal>
            </>

        )
    )
}
