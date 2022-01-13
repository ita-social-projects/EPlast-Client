import { Alignment, Margins } from 'pdfmake/interfaces';
import { DecisionPost, statusTypeGetParser } from '../../../api/decisionsApi';
export default function DecisionLayout(decisionInfo: DecisionPost) {
    return {
        info: {
            title: `Рішення про ${decisionInfo.name}`,
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
                text: `${decisionInfo.name} від ${new Date(decisionInfo.date).toLocaleDateString()}`,
                style: 'secondHeader',
                margin: [0, 0, 0, 40] as Margins,
            },
            {
                text: `${decisionInfo.description}`,
                alignment: 'left' as Alignment,
            },
            {
                text: `Поточний статус: ${statusTypeGetParser(decisionInfo.decisionStatusType)}`,
                style: 'secondHeader',
                margin: [0, 40, 0, 0] as Margins,
            },
        ],
        styles: {
            secondHeader: {
                fontSize: 16,
                alignment: 'right' as Alignment,
            },
        },
        defaultStyle: {
            font: 'Times',
            fontSize: 14,
        },
    };
}
