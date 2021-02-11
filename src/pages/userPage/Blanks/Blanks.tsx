import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Data } from "../Interface/Interface";
import userApi from '../../../api/UserApi';
import notificationLogic from '../../../components/Notifications/Notification';
import { getDocumentByUserId, removeDocument, getFile, getAllAchievementDocumentsByUserId, openBiographyFile, getExtractFromUPUByUserId, removeExtractFromUPUDocument, getExtractFromUPUFile, openExtractFromUPUFile, openGenerationFile } from "../../../api/blankApi";
import { Badge, Button, Col, Popconfirm, Tooltip } from "antd";
import classes from "./Blanks.module.css";
import Title from "antd/lib/typography/Title";
import { DeleteOutlined, DownloadOutlined, EyeOutlined, FilePdfOutlined, FileTextOutlined } from "@ant-design/icons";
import AddBiographyModal from "./UserBiography/AddBiographyModal";
import BlankDocument from "../../../models/Blank/BlankDocument";
import Paragraph from "antd/lib/typography/Paragraph";
import Spinner from "../../Spinner/Spinner";
import AddAchievementsModal from "./UserAchievements/AddAchievementsModal";
import AuthStore from "../../../stores/AuthStore";
import jwt from "jwt-decode";
import ListOfAchievementsModal from "./UserAchievements/ListOfAchievementsModal";
import AddExtractFromUPUModal from "./UserExtractFromUPU/AddExtractFromUPUModal";
import jwt_decode from "jwt-decode";
import{
    successfulDeleteAction,
    tryAgain
  } from "../../../components/Notifications/Messages"
import AvatarAndProgressStatic from "../personalData/AvatarAndProgressStatic";

export const Blanks = () => {
    const { userId } = useParams();

    const [data, setData] = useState<Data>();
    const [document, setDocument] = useState<BlankDocument>(new BlankDocument());
    const [achievementDoc, setAchievementDoc] = useState<BlankDocument[]>([]);
    const [extractUPU, setExtractUPU] = useState<BlankDocument>(new BlankDocument);
    const [visibleModal, setVisibleModal] = useState(false);
    const [visibleListAchievementModal, setVisibleListAchievementModal] = useState(false);
    const [visibleExtractFromUPUModal, setVisibleExtractFromUPUModal] = useState(false);
    const [visibleAchievementModal, setvisibleAchievementModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [canEdit, setCanEdit] = useState(false);
    const [userToken, setUserToken] = useState<any>([
        {
            nameid: "",
        },
    ]);

    const [documentFormat, setDocumentFormat] = useState<string | undefined>();
    const [extractUPUFormat, setExtractUPUFormat] = useState<string | undefined>();

    const fetchData = async () => {
        const token = AuthStore.getToken() as string;
        setUserToken(jwt(token));
        let decodedJwt = jwt_decode(token) as any;
        let roles = decodedJwt['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] as string[];
        setCanEdit(roles.includes("Admin"));
        await userApi.getById(userId).then(response => {
            setData(response.data);
        }).catch(() => { notificationLogic('error', tryAgain) })
        setLoading(true);
    };

    const getDocument = async () => {
        const response = await getDocumentByUserId(userId);
        setDocument(response.data);
        setDocumentFormat(getFormat(response.data.fileName));
    };
    const getAchievementDocumentsByUserId = async () => {
        const response = await getAllAchievementDocumentsByUserId(userId);
        setAchievementDoc(response.data);
    };
    const getExtractFromUPU = async () => {
        const response = await getExtractFromUPUByUserId(userId);
        setExtractUPU(response.data);
        setExtractUPUFormat(getFormat(response.data.fileName));
    }

    const getPdf = async () => {
        const pdfLink = await openGenerationFile(userId);
        window.open(pdfLink);
    }

    const removeDocumentById = async (documentId: number) => {
        await removeDocument(documentId);
        notificationLogic('success', successfulDeleteAction("Файл"));
        getDocument();
    };
    const removeExtractDocument = async (documentId: number) => {
        await removeExtractFromUPUDocument(documentId);
        notificationLogic('success', successfulDeleteAction("Файл"));
        getExtractFromUPU();
    }

    const downloadExtractDocument = async (fileBlob: string, fileName: string) => {
        await getExtractFromUPUFile(fileBlob, fileName);
    }

    const downloadDocument = async (fileBlob: string, fileName: string) => {
        await getFile(fileBlob, fileName);
    }

    const openDocument = async (fileBlob: string, fileName: string) => {
        await openBiographyFile(fileBlob, fileName);
    }
    const openExtractFromUPUDocument = async (fileBlob: string, fileName: string) => {
        await openExtractFromUPUFile(fileBlob, fileName);
    }
    const getFormat = (fileName:string)=>{
        if(fileName != undefined)
        return fileName.split(".")[1];
    }
    useEffect(() => {
        fetchData();
        getDocument();
        getAchievementDocumentsByUserId();
        getExtractFromUPU();
    }, [userId, visibleModal, visibleAchievementModal, visibleExtractFromUPUModal]);

    return (loading === false ? (
        <Spinner />
    ) : (
            <>
                <p></p>
                <div className={classes.wrapper}>
                    <div className={classes.wrapperImg}>
                            <AvatarAndProgressStatic imageUrl={data?.user.imagePath}
                                time={data?.timeToJoinPlast}
                                firstName={data?.user.firstName}
                                lastName={data?.user.lastName}
                                isUserPlastun={true}
                                pseudo={data?.user.pseudo} 
                                city={data?.user.city} 
                                club={data?.user.club}/>
                    </div>
                    <div className={classes.wrapperCol}>
                        <div className={classes.wrapper}>
                            <div className={classes.wrapper2}>
                                <Title level={2}>Життєпис</Title>
                                {document.userId == userId ? (
                                    <Col
                                        xs={18}
                                        sm={18}
                                        key={document.id}
                                    >
                                        <div>
                                            <FilePdfOutlined className={classes.documentIcon}
                                            />
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
                                        {(documentFormat !== "doc" && documentFormat !== "docx")?
                                        <Tooltip title="Переглянути">
                                            <EyeOutlined
                                                className={classes.reviewIcon}
                                                key="review"
                                                onClick={() => openDocument(document.blobName, document.fileName)} />
                                        </Tooltip>
                                        :null}
                                        {userToken.nameid === userId &&
                                            <Tooltip title="Видалити">
                                                <Popconfirm
                                                    title="Видалити цей документ?"
                                                    placement="bottom"
                                                    icon={false}
                                                    onConfirm={() => removeDocumentById(document.id)}
                                                    okText="Так"
                                                    cancelText="Ні">

                                                    <DeleteOutlined
                                                        className={classes.deleteIcon}
                                                        key="close"
                                                    />
                                                </Popconfirm>
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
                                                <h2>{data?.user.firstName} ще не додав(ла) Життєпис</h2>
                                            }
                                            {userToken.nameid === userId &&
                                                <div>
                                                    <Button type="primary"
                                                        className={classes.addIcon}
                                                        onClick={() => setVisibleModal(true)}>
                                                        Додати Життєпис
                                            </Button>
                                                </div>
                                            }
                                        </Col>
                                    )}

                            </div>

                            <div className={classes.wrapper3}>
                                <Title level={2}>Виписка з УПЮ</Title>
                                {extractUPU.userId == userId ? (
                                    <Col
                                        xs={18}
                                        sm={18}
                                        key={document.id}
                                    >
                                        <div>
                                            <FilePdfOutlined className={classes.documentIcon}
                                            />
                                            <Paragraph ellipsis={{ rows: 2, suffix: " " }}>
                                                {extractUPU.fileName}
                                            </Paragraph>
                                        </div>
                                        <Tooltip title="Завантажити">
                                            <DownloadOutlined
                                                className={classes.downloadIcon}
                                                key="download"
                                                onClick={() =>
                                                    downloadExtractDocument(
                                                        extractUPU.blobName,
                                                        extractUPU.fileName
                                                    )
                                                }
                                            />
                                        </Tooltip>
                                        {(extractUPUFormat !== "doc" && extractUPUFormat !== "docx")?
                                        <Tooltip title="Переглянути">
                                            <EyeOutlined
                                                className={classes.reviewIcon}
                                                key="review"
                                                onClick={() => openExtractFromUPUDocument(extractUPU.blobName, extractUPU.fileName)} />
                                        </Tooltip>
                                        :null}
                                        {userToken.nameid === userId &&
                                            <Tooltip title="Видалити">
                                                <Popconfirm
                                                    title="Видалити цей документ?"
                                                    placement="bottom"
                                                    icon={false}
                                                    onConfirm={() => removeExtractDocument(extractUPU.id)}
                                                    okText="Так"
                                                    cancelText="Ні">
                                                    <DeleteOutlined
                                                        className={classes.deleteIcon}
                                                        key="close"
                                                    />
                                                </Popconfirm>
                                            </Tooltip>
                                        }
                                    </Col>
                                ) : (
                                        <Col>
                                            {userToken.nameid === userId &&
                                                <h2>Ви ще не додали виписку</h2>
                                            }
                                            {userToken.nameid !== userId &&
                                                <h2>{data?.user.firstName} ще не додав(ла) виписку</h2>
                                            }
                                            {userToken.nameid === userId &&
                                                <div>
                                                    <Button type="primary"
                                                        className={classes.addIcon}
                                                        onClick={() => setVisibleExtractFromUPUModal(true)}>
                                                        Додати Виписку
                                            </Button>
                                                </div>
                                            }
                                        </Col>
                                    )}
                            </div>
                        </div>

                        <div className={classes.wrapper}>
                            <div className={classes.wrapper4}>
                                <Title level={2}>Досягнення</Title>
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
                                                <h2>{data?.user.firstName} ще не додав(ла) жодного Досягнення</h2>
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
                                <Title level={2}>Заява для вступу</Title>
                                <FileTextOutlined
                                    className={classes.documentIcon} />
                                {canEdit == true || userToken.nameid === userId ? (
                                    <Button
                                        className={classes.addIcon}
                                        type="primary"
                                        onClick={() => getPdf()}>
                                        Згенерувати файл
                                    </Button>
                                ) : (
                                        null
                                    )
                                }
                            </div>

                        </div>

                    </div>
                </div>
                <ListOfAchievementsModal
                    userToken={userToken}
                    visibleModal={visibleListAchievementModal}
                    setVisibleModal={setVisibleListAchievementModal}
                    achievementDoc={achievementDoc}
                    setAchievementDoc={setAchievementDoc}
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

                <AddExtractFromUPUModal
                    userId={data?.user.id}
                    document={extractUPU}
                    setDocument={setExtractUPU}
                    visibleModal={visibleExtractFromUPUModal}
                    setVisibleModal={setVisibleExtractFromUPUModal}
                ></AddExtractFromUPUModal>
            </>

        )
    )
}
