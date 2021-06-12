import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Data } from "../Interface/Interface";
import userApi from '../../../api/UserApi';
import notificationLogic from '../../../components/Notifications/Notification';
import { getDocumentByUserId, removeDocument, getFile, getAllAchievementDocumentsByUserId, openBiographyFile, getExtractFromUPUByUserId, removeExtractFromUPUDocument, getExtractFromUPUFile, openExtractFromUPUFile, openGenerationFile } from "../../../api/blankApi";
import { Badge, Button, Col, Popconfirm, Tooltip } from "antd";
import classes from "./Blanks.module.css";
import Title from "antd/lib/typography/Title";
import { DeleteOutlined, DownloadOutlined, EyeOutlined, FileImageOutlined, FilePdfOutlined, FileTextOutlined } from "@ant-design/icons";
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
import {
    successfulDeleteAction,
    tryAgain
} from "../../../components/Notifications/Messages"
import AvatarAndProgressStatic from "../personalData/AvatarAndProgressStatic";

const userAdminTypeRoles = [
    "Admin",
    "Голова Куреня",
    "Голова Округи",
    "Голова Станиці",
];
const userGenders = ["Чоловік", "Жінка", "Інша"];

export const Blanks = () => {
    const { userId } = useParams();

    const [data, setData] = useState<Data>();
    const [currentUser, setCurrentUser] = useState<Data>();
    const [document, setDocument] = useState<BlankDocument>(new BlankDocument());
    const [achievementDoc, setAchievementDoc] = useState<BlankDocument[]>([]);
    const [extractUPU, setExtractUPU] = useState<BlankDocument>(new BlankDocument);
    const [visibleModal, setVisibleModal] = useState(false);
    const [visibleListAchievementModal, setVisibleListAchievementModal] = useState(false);
    const [visibleExtractFromUPUModal, setVisibleExtractFromUPUModal] = useState(false);
    const [visibleAchievementModal, setvisibleAchievementModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [canEdit, setCanEdit] = useState(false);
    const [roles, setRoles] = useState<string[]>([]);
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
        const currentUserId = (jwt(token) as { nameid: "" }).nameid;
        let decodedJwt = jwt_decode(token) as any;
        setRoles(decodedJwt['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] as string[]);
        setCanEdit(roles.includes("Admin"));
        await userApi.getById(userId).then(response => {
            setData(response.data);
        }).catch(() => { notificationLogic('error', tryAgain) })

        await userApi.getById(currentUserId).then(response => {
            setCurrentUser(response.data);
        }).catch(() => { notificationLogic('error', tryAgain) })
        setLoading(true);
    };

    const getAppropriateToGenderVerb = () => {
        if (userGenders[0] === data?.user.gender?.name)
            return "додав";
        if (userGenders[1] === data?.user.gender?.name) 
          return "додала";
        return "додав(ла)";
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
        await getDocument();
    };
    const removeExtractDocument = async (documentId: number) => {
        await removeExtractFromUPUDocument(documentId);
        notificationLogic('success', successfulDeleteAction("Файл"));
        await getExtractFromUPU();
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
    const getFormat = (fileName: string) => {
        if (fileName != undefined)
            return fileName.split(".")[1];
    }
    useEffect(() => {
        fetchData();
        getDocument();
        getAchievementDocumentsByUserId();
        getExtractFromUPU();
    }, [userId, visibleModal, visibleAchievementModal, visibleExtractFromUPUModal]);

    const IsUserHasAccessToManageBlanks = (userRoles: Array<string>): boolean => {

        return (userRoles?.includes("Голова Куреня") && currentUser?.user?.clubId == data?.user?.clubId) ||
            (userRoles?.includes("Голова Станиці") && currentUser?.user?.cityId == data?.user?.cityId) ||
            (userRoles?.includes("Голова Округи") && currentUser?.user?.regionId == data?.user?.regionId) ||
            userRoles?.includes("Admin");
    };

    return (!loading ? (
        <Spinner />
    ) : (
        <>
            <div className={classes.wrapper}>
                <div className={classes.wrapperImg}>
                    <AvatarAndProgressStatic imageUrl={data?.user.imagePath}
                        time={data?.timeToJoinPlast}
                        firstName={data?.user.firstName}
                        lastName={data?.user.lastName}
                        isUserPlastun={true}
                        pseudo={data?.user.pseudo}
                        city={data?.user.city}
                        club={data?.user.club}
                        cityId={data?.user.cityId}
                        clubId={data?.user.clubId} />
                </div>
                <div className={classes.wrapperCol}>
                    <div className={classes.wrapper}>
                        <div className={classes.wrapper2}>
                            <Title level={2}>Життєпис</Title>
                            {(document.userId === userId) ? (
                                <Col
                                    xs={18}
                                    sm={18}
                                    key={document.id}
                                >
                                    <div>
                                        {document.blobName.split(".")[1] === "pdf" &&
                                            <FilePdfOutlined
                                                className={classes.documentIcon} />}
                                        {"jpg, jpeg, png".includes(document.blobName.split(".")[1]) &&
                                            <FileImageOutlined
                                                className={classes.documentIcon}
                                            />}
                                        {"docx, doc".includes(document.blobName.split(".")[1]) &&
                                            <FileTextOutlined
                                                className={classes.documentIcon}
                                            />}
                                        <Paragraph ellipsis={{ rows: 2, suffix: " " }}>
                                            {document.fileName}
                                        </Paragraph>
                                    </div>
                                    {(userToken.nameid === userId || IsUserHasAccessToManageBlanks(roles)) &&
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
                                            /></Tooltip>}

                                    {((userToken.nameid === userId || IsUserHasAccessToManageBlanks(roles)) && documentFormat !== "doc" && documentFormat !== "docx") ?
                                        <Tooltip title="Переглянути">
                                            <EyeOutlined
                                                className={classes.reviewIcon}
                                                key="review"
                                                onClick={() => openDocument(document.blobName, document.fileName)} />
                                        </Tooltip>
                                        : null}
                                    {(userToken.nameid === userId || roles.includes("Admin")) &&
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
                                            <h2>{data?.user.firstName} ще не {getAppropriateToGenderVerb()} Життєпис</h2>
                                        }
                                        {(userToken.nameid === userId || roles.includes("Admin")) &&
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
                            {(extractUPU.userId == userId) ? (
                                <Col
                                    xs={18}
                                    sm={18}
                                    key={document.id}
                                >
                                    <div>
                                        {extractUPU.blobName.split(".")[1] === "pdf" &&
                                            <FilePdfOutlined
                                                className={classes.documentIcon} />}
                                        {"jpg, jpeg, png".includes(extractUPU.blobName.split(".")[1]) &&
                                            <FileImageOutlined
                                                className={classes.documentIcon}
                                            />}
                                        {"docx, doc".includes(extractUPU.blobName.split(".")[1]) &&
                                            <FileTextOutlined
                                                className={classes.documentIcon}
                                            />}

                                        <Paragraph ellipsis={{ rows: 2, suffix: " " }}>
                                            {extractUPU.fileName}
                                        </Paragraph>
                                    </div>
                                    <Tooltip title="Завантажити">
                                        <DownloadOutlined
                                            hidden={!(userToken.nameid === userId || IsUserHasAccessToManageBlanks(roles))}
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
                                    <Tooltip title="Переглянути">
                                        <EyeOutlined
                                            hidden={!(userToken.nameid === userId || IsUserHasAccessToManageBlanks(roles) || extractUPUFormat === "doc" || extractUPUFormat === "docx")}
                                            className={classes.reviewIcon}
                                            key="review"
                                            onClick={() => openExtractFromUPUDocument(extractUPU.blobName, extractUPU.fileName)} />
                                    </Tooltip>
                                    <Tooltip title="Видалити">
                                        <Popconfirm
                                            title="Видалити цей документ?"
                                            placement="bottom"
                                            icon={false}
                                            onConfirm={() => removeExtractDocument(extractUPU.id)}
                                            okText="Так"
                                            cancelText="Ні">
                                            <DeleteOutlined
                                                hidden={!(userToken.nameid === userId || IsUserHasAccessToManageBlanks(roles))}
                                                className={classes.deleteIcon}

                                                key="close"
                                            />
                                        </Popconfirm>
                                    </Tooltip>
                                </Col>
                            ) : (
                                <Col>
                                    {userToken.nameid === userId &&
                                        <h2>Ви ще не додали Виписку</h2>
                                    }
                                    {userToken.nameid !== userId &&
                                        <h2>{data?.user.firstName} ще не {getAppropriateToGenderVerb()} Виписку</h2>
                                    }
                                    <div>
                                        <Button type="primary"
                                            hidden={!(userToken.nameid === userId || IsUserHasAccessToManageBlanks(roles))}
                                            className={classes.addIcon}
                                            onClick={() => setVisibleExtractFromUPUModal(true)}>
                                            Додати Виписку
                                                </Button>
                                    </div>
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
                                        <h2>{data?.user.firstName} ще не {getAppropriateToGenderVerb()} жодного Досягнення</h2>
                                    }
                                </Col>
                            )}
                            <Col>
                                <div>
                                    <Button type="primary"
                                        hidden={!(IsUserHasAccessToManageBlanks(roles) || userToken.nameid === userId)}
                                        className={classes.addIcon}
                                        onClick={() => setvisibleAchievementModal(true)}>
                                        Додати Досягнення
                                        </Button>
                                </div>
                            </Col>
                        </div>

                        <div className={classes.wrapper5}>
                            <Title level={2}>Заява для вступу</Title>
                            <FileTextOutlined
                                className={classes.documentIcon} />
                            <Button
                                hidden={!(IsUserHasAccessToManageBlanks(roles) || userToken.nameid === userId)}
                                className={classes.addIcon}
                                type="primary"
                                onClick={() => getPdf()}>
                                Згенерувати файл
                                    </Button>
                        </div>

                    </div>

                </div>
            </div>
            <ListOfAchievementsModal
                userToken={userToken}
                visibleModal={visibleListAchievementModal}
                setVisibleModal={setVisibleListAchievementModal}
                achievementDoc={achievementDoc}
                hasAccess={IsUserHasAccessToManageBlanks(roles) || userToken.nameid === userId}
                setAchievementDoc={setAchievementDoc} />

            <AddAchievementsModal
                userId={data?.user.id}
                visibleModal={visibleAchievementModal}
                setVisibleModal={setvisibleAchievementModal} />

            <AddBiographyModal
                userId={data?.user.id}
                document={document}
                setDocument={setDocument}
                visibleModal={visibleModal}
                setVisibleModal={setVisibleModal} />

            <AddExtractFromUPUModal
                userId={data?.user.id}
                document={extractUPU}
                setDocument={setExtractUPU}
                visibleModal={visibleExtractFromUPUModal}
                setVisibleModal={setVisibleExtractFromUPUModal} />
        </>

    )
    )
}
