import { Alignment, Margins } from 'pdfmake/interfaces';
import ClubAnnualReport from '../../../pages/AnnualReport/Interfaces/ClubAnnualReport';

export default function ClubAnnualReportLayout(annualReport: ClubAnnualReport) {
    var adminFirstLastName = `${annualReport.head?.user?.firstName ?? ''} ${annualReport.head?.user?.lastName ?? ''}`;
    var adminContacts = `${annualReport.head?.user?.email ?? ''}\n${annualReport.head?.user?.phoneNumber ?? ''}`;
    var clubCenters = annualReport.clubCenters;
    var kbUSPWishes = annualReport.kbUSPWishes;

    //validation logic
    adminContacts =
        adminFirstLastName.replace(/ /g, '').length > 0 ? adminContacts : '';
    adminFirstLastName =
        adminFirstLastName.replace(/ /g, '').length > 0
            ? adminFirstLastName
            : 'Інформацію не знайдено';

    clubCenters =
        clubCenters.replace(/ /g, '').length > 0
            ? clubCenters
            : 'Інформацію не знайдено';
    kbUSPWishes =
        kbUSPWishes.replace(/ /g, '').length > 0
            ? kbUSPWishes
            : 'Інформацію не знайдено';

    //fix for map in object declaration
    annualReport.admins = annualReport.admins ?? [];
    annualReport.members = annualReport.members ?? [];
    annualReport.followers = annualReport.followers ?? [];

    return {
        info: {
            title: `Річний звіт куреня ${annualReport.clubName}`,
            author: 'EPlast',
            subject: 'Звіт куреня',
            creator: 'EPlast',
            producer: 'EPlast',
        },
        content: [
            {
                image: 'PDFHeader.png',
                width: 595.28,
                margin: [-40, -40, 0, 0] as Margins,
            },
            {
                text: `Звіт куреня ${annualReport.clubName} за ${new Date(annualReport.date).getUTCFullYear()} рік`,
                style: 'header',
            },
            {
                layout: {
                    defaultBorder: false,
                },
                table: {
                    heights: 33,
                    widths: [100, 'auto', '*'],
                    body: [
                        [
                            {
                                text: 'Голова куреня:',
                            },
                            {
                                text: `${adminFirstLastName}`,
                            },
                            {
                                text: `${adminContacts}`,
                                alignment: 'right' as Alignment,
                            },
                        ],
                    ],
                },
            },
            {
                layout: {
                    defaultBorder: false,
                },
                table: {
                    heights: 33,
                    widths: ['auto', '*'],
                    body: [
                        //Дані про членів куреня
                        [
                            {
                                colSpan: 2,
                                text: 'Дані про членів куреня:',
                                style: 'secondHeader',
                                border: [false, false, false, true],
                            },
                            '',
                        ],
                        [
                            {
                                text: 'Дійсних членів куреня:',
                            },
                            {
                                text: `${annualReport.currentClubMembers}`,
                                style: 'numbers',
                            },
                        ],
                        [
                            {
                                text: 'Прихильників куреня:',
                            },
                            {
                                text: `${annualReport.currentClubFollowers}`,
                                style: 'numbers',
                            },
                        ],
                        [
                            {
                                text: 'До куреня приєдналось за звітній період:',
                            },
                            {
                                text: `${annualReport.clubEnteredMembersCount}`,
                                style: 'numbers',
                            },
                        ],
                        [
                            {
                                text: 'Вибули з куреня за звітній період:',
                            },
                            {
                                text: `${annualReport.clubLeftMembersCount}`,
                                style: 'numbers',
                            },
                        ],
                        //Географія куреня. Осередки в Україні
                        [
                            {
                                colSpan: 2,
                                text: `Вкажіть, що вам допоможе ефективніше залучати волонтерів та створювати виховні частини (гнізда, курені):`,
                                border: [false, true, false, false],
                            },
                            '',
                        ],
                        [
                            {
                                colSpan: 2,
                                text: `${clubCenters}`,
                            },
                            '',
                        ],
                        //Побажання до КБ УСП
                        [
                            {
                                colSpan: 2,
                                text: `Побажання до КБ УСП:`,
                                border: [false, true, false, false],
                            },
                            '',
                        ],
                        [
                            {
                                colSpan: 2,
                                text: `${kbUSPWishes}`,
                                border: [false, false, false, true],
                            },
                            '',
                        ],
                    ],
                },
            },
            //spacing from previous
            {
                text: ' ',
            },
            //Провід куреня
            annualReport.admins.length > 0
                ? {
                    table: {
                        widths: ['auto', 'auto', 'auto', 'auto', 'auto'],
                        body: [
                            [
                                {
                                    colSpan: 5,
                                    text: 'Провід куреня',
                                    style: 'secondHeader',
                                    border: [false, false, false, false, false],
                                },
                                '',
                                '',
                                '',
                                '',
                            ],
                            [
                                {
                                    text: 'Ім\'я, Прізвище',
                                },
                                {
                                    text: 'Посада',
                                },
                                {
                                    text: 'Станиця',
                                },
                                {
                                    text: 'Електронна пошта',
                                },
                                {
                                    text: 'Телефон',
                                },
                            ],
                            ...annualReport.admins?.map((element) => [
                                {
                                    text: `${`${element.user.firstName} ${element.user.lastName}`.replace(/ /g, '').length > 0
                                        ? `${element.user.firstName} ${element.user.lastName}`
                                        : '-'}`,
                                },
                                {
                                    text: `${element.adminType?.adminTypeName ?? '-'}`,
                                },
                                {
                                    text: `${element.user.clubReportCities?.city?.name ?? '-'}`,
                                },
                                {
                                    text: `${element.user?.email ?? '-'}`,
                                },
                                {
                                    text: `${element.user?.phoneNumber ?? '-'}`,
                                },
                            ]),
                        ],
                    },
                }
                : '',
            //spacing from previous
            {
                text: ' ',
            },
            //Члени куреня
            annualReport.members.length > 0
                ? {
                    table: {
                        widths: ['auto', 'auto', '*', 'auto'],
                        body: [
                            [
                                {
                                    colSpan: 4,
                                    text: 'Члени куреня',
                                    style: 'secondHeader',
                                    border: [false, false, false, false],
                                },
                                '',
                                '',
                                '',
                            ],
                            [
                                {
                                    text: 'Ім\'я, Прізвище',
                                },
                                {
                                    text: 'Станиця',
                                },
                                {
                                    text: 'Електронна пошта',
                                },
                                {
                                    text: 'Телефон',
                                },
                            ],
                            ...annualReport.members?.map((element) => [
                                {
                                    text: `${`${element.user.firstName} ${element.user.lastName}`.replace(/ /g, '').length > 0
                                        ? `${element.user.firstName} ${element.user.lastName}`
                                        : '-'}`,
                                },
                                {
                                    text: `${element.user.clubReportCities?.city?.name ?? '-'}`,
                                },
                                {
                                    text: `${element.user?.email ?? '-'}`,
                                },
                                {
                                    text: `${element.user?.phoneNumber ?? '-'}`,
                                },
                            ]),
                        ],
                    },
                }
                : '',
            //spacing from previous
            {
                text: ' ',
            },
            //Прихильники куреня
            annualReport.followers.length > 0
                ? {
                    table: {
                        widths: ['auto', 'auto', '*', 'auto'],
                        body: [
                            [
                                {
                                    colSpan: 4,
                                    text: 'Прихильники куреня',
                                    style: 'secondHeader',
                                    border: [false, false, false, false],
                                },
                                '',
                                '',
                                '',
                            ],
                            [
                                {
                                    text: 'Ім\'я, Прізвище',
                                },
                                {
                                    text: 'Станиця',
                                },
                                {
                                    text: 'Електронна пошта',
                                },
                                {
                                    text: 'Телефон',
                                },
                            ],
                            ...annualReport.followers?.map((element) => [
                                {
                                    text: `${`${element.user.firstName} ${element.user.lastName}`.replace(/ /g, '').length > 0
                                        ? `${element.user.firstName} ${element.user.lastName}`
                                        : '-'}`,
                                },
                                {
                                    text: `${element.user.clubReportCities?.city?.name ?? '-'}`,
                                },
                                {
                                    text: `${element.user?.email ?? '-'}`,
                                },
                                {
                                    text: `${element.user?.phoneNumber ?? '-'}`,
                                },
                            ]),
                        ],
                    },
                }
                : '',
        ],

        styles: {
            numbers: {
                alignment: 'right' as Alignment,
            },
            header: {
                fontSize: 18,
                alignment: 'center' as Alignment,
            },
            secondHeader: {
                fontSize: 16,
                alignment: 'center' as Alignment,
            },
        },
        defaultStyle: {
            font: 'Times',
            fontSize: 14,
        },
    };
}
