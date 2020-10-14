import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Data } from "../Interface/Interface";
import userApi from '../../../api/UserApi';
import notificationLogic from '../../../components/Notifications/Notification';
import AvatarAndProgress from "../personalData/AvatarAndProgress";
import { getDocumentByUserId, removeDocument, getFile, getAllAchievementDocumentsByUserId } from "../../../api/blankApi";
import { Badge, Button, Col, Form, Tooltip } from "antd";
import classes from "./Blanks.module.css";
import Title from "antd/lib/typography/Title";
import { DeleteOutlined, DownloadOutlined, FileTextOutlined } from "@ant-design/icons";
import AddBiographyModal from "./UserBiography/AddBiographyModal";
import BlankDocument from "../../../models/Blank/BlankDocument";
import Paragraph from "antd/lib/typography/Paragraph";
import Spinner from "../../Spinner/Spinner";
import AddAchievementsModal from "./UserAchievements/AddAchievementsModal";
import AuthStore from "../../../stores/AuthStore";
import jwt from "jwt-decode";
import ListOfAchievementsModal from "./UserAchievements/ListOfAchievementsModal";

export const Blanks = () => {
    const history = useHistory();
    const { userId } = useParams();

    const [data, setData] = useState<Data>();
    const [document, setDocument] = useState<BlankDocument>(new BlankDocument());
    const [achievementDoc, setAchievementDoc] = useState<BlankDocument[]>([]);
    const [visibleModal, setVisibleModal] = useState(false);
    const [visibleListAchievementModal, setVisibleListAchievementModal] = useState(false);
    const [visibleAchievementModal, setvisibleAchievementModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [userToken, setUserToken] = useState<any>([
        {
            nameid: "",
        },
    ]);

    const fetchData = async () => {
        const token = AuthStore.getToken() as string;
        setUserToken(jwt(token));
        await userApi.getById(userId).then(response => {
            setData(response.data);
        }).catch(() => { notificationLogic('error', "Щось пішло не так") })
        setLoading(true);
    };

    const getDocument = async () => {
        const response = await getDocumentByUserId(userId);
        setDocument(response.data);
    };
    const getAchievementDocumentsByUserId = async () => {
        const response = await getAllAchievementDocumentsByUserId(userId);
        setAchievementDoc(response.data);
    };
    const removeDocumentById = async (documentId: number) => {
        await removeDocument(documentId);
        notificationLogic('success', "Файл успішно видалено");
        getDocument();
    };

    const downloadDocument = async (fileBlob: string, fileName: string) => {
        await getFile(fileBlob, fileName);
    }

    useEffect(() => {
        fetchData();
        getDocument();
        getAchievementDocumentsByUserId();
    }, [userId, visibleModal, visibleAchievementModal]);

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
                                {document.userId == userId ? (
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
                                        <Tooltip title="Завантажити">
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
                                        </Tooltip>
                                        {userToken.nameid === userId &&
                                            <Tooltip title="Видалити">
                                                <DeleteOutlined
                                                    className={classes.deleteIcon}
                                                    key="close"
                                                    onClick={() => removeDocumentById(document.id)}
                                                />
                                            </Tooltip>
                                        }
                                    </Col>
                                )
                                    : (
                                        <Col>
                                            {userToken.nameid === userId &&
                                                <h2>Ви ще не додали Життєпис</h2>
                                            }
                                            {userToken.nameid !== userId &&
                                                <h2>Користувач ще не додав(ла) Життєпис</h2>
                                            }
                                            {userToken.nameid === userId &&
                                                <div>
                                                    <Button type="primary"
                                                        className={classes.addIcon}
                                                        onClick={() => setVisibleModal(true)}>
                                                        Створити Життєпис
                                            </Button>
                                                </div>
                                            }
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
                                <Title level={2}>Досягнення</Title>
                                <div className={classes.line} />
                                {achievementDoc.length !== 0 ? (
                                    <div>
                                        <Col>
                                            <Badge
                                                count={achievementDoc.length}
                                                style={{ backgroundColor: "#3c5438" }}
                                            />

                                        </Col>
                                        <Col>
                                            <Button type="primary"
                                                className={classes.listButton}
                                                onClick={() => setVisibleListAchievementModal(true)}>
                                                Список
                                        </Button>
                                        </Col>
                                    </div>
                                ) : (
                                        <Col>
                                            {userToken.nameid === userId &&
                                                <h2>Ви ще не додали жодного Досягнення</h2>
                                            }
                                            {userToken.nameid !== userId &&
                                                <h2> Користувач ще не додав(ла) жодного Досягнення</h2>
                                            }
                                        </Col>
                                    )}
                                <Col>

                                    {userToken.nameid === userId &&
                                        <div>
                                            <Button type="primary"
                                                className={classes.addIcon}
                                                onClick={() => setvisibleAchievementModal(true)}>
                                                Додати Досягнення
                                            </Button>
                                        </div>
                                    }
                                </Col>
                            </div>

                            <div className={classes.wrapper5}>
                                <Title level={2}>Виписка з УПЮ</Title>
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
                <ListOfAchievementsModal
                    visibleModal={visibleListAchievementModal}
                    setVisibleModal={setVisibleListAchievementModal}
                    achievementDoc={achievementDoc}
                ></ListOfAchievementsModal>

                <AddAchievementsModal
                    userId={data?.user.id}
                    visibleModal={visibleAchievementModal}
                    setVisibleModal={setvisibleAchievementModal}
                ></AddAchievementsModal>

                <AddBiographyModal
                    userId={data?.user.id}
                    document={document}
                    setDocument={setDocument}
                    visibleModal={visibleModal}
                    setVisibleModal={setVisibleModal}
                ></AddBiographyModal>
            </>

        )
    )
}
