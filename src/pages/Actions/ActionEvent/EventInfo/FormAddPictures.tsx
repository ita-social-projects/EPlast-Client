import React from "react";
import {
    Form,
    Button,
    Upload, notification,
} from 'antd';
import {UploadOutlined, InboxOutlined} from '@ant-design/icons';
import eventsApi from "../../../../api/eventsApi";
import {EventGallery} from "./EventInfo";
import {
    updateNotification,
    failUpdatingNotification,
    loadingNotification,
    emptyPhotoListNotification,
    limitNotification
} from "./GalleryNotifications";

interface Props {
    eventId: number;
    updateGallery: (uploadedPictures: EventGallery[]) => void;
    picturesCount: number;
}

const formItemLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 14},
};

const normFile = (e: any) => {
    // console.log('Upload event:', e);
    if (Array.isArray(e)) {
        return e;
    }
    return e && e.fileList;
};

const handleUpload = async (info: any) => {
    // await eventsApi.uploadPictures(4, data);
}


const Demo = ({eventId, updateGallery, picturesCount}: Props) => {
    const [form] = Form.useForm();
    const MaxPicturesCount: number = 15;
    const addPictures = async (eventId: number, data: FormData) => {
        return await eventsApi.uploadPictures(eventId, data);
    };

    const handleSubmit = async (values: any) => {
        if (values.upload !== undefined) {
            if (picturesCount >= MaxPicturesCount) {
                notification.destroy();
                limitNotification("Досягнуто ліміту фотографій у галереї подій!",
                    `Максимальна кількість фотографій у галереї повинна не перевищувати ${MaxPicturesCount} штук.`);
            } else {
                if (values.upload.length > MaxPicturesCount || values.upload.length>(MaxPicturesCount-picturesCount)) {
                    limitNotification("Перевищено ліміт фотографій для завантаження!",
                        "Зменшіть кількість вибраних фотографій для завантаження.");
                } else {
                    loadingNotification();
                    const data = new FormData();
                    values.upload.forEach((element: any) => {
                        data.append('files', element.originFileObj);
                    });
                    addPictures(eventId, data)
                        .then(async (response) => {
                            updateGallery(response.data);
                            notification.destroy();
                            updateNotification();
                            form.resetFields();
                        })
                        .catch(() => {
                            notification.destroy();
                            failUpdatingNotification();
                        })
                }
            }
        } else {
            notification.destroy();
            emptyPhotoListNotification();
        }
    };

    return (
        <Form
            name="validate_other"
            {...formItemLayout}
            initialValues={{
                ['input-number']: 3,
                ['checkbox-group']: ['A', 'B'],
                rate: 3.5,
            }}
            form={form}
            onFinish={handleSubmit}
        >

            <Form.Item
                name="upload"
                label="Завантажити"
                valuePropName="fileList"
                getValueFromEvent={normFile}
            >
                <Upload name="gallery" listType="picture" multiple={true} accept=".jpg,.jpeg,.png">
                    <Button>
                        <UploadOutlined/> Додати фотографії
                    </Button>
                </Upload>
            </Form.Item>

            <Form.Item wrapperCol={{span: 12, offset: 6}}>
                <Button type="primary" htmlType="submit">
                    Надіслати
                </Button>
            </Form.Item>
        </Form>
    );
};

export default Demo;
