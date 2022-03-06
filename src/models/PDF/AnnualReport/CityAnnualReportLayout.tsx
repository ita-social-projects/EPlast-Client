import { Alignment, Margins, TableLayout } from "pdfmake/interfaces";
import AnnualReport from "../../../pages/AnnualReport/Interfaces/AnnualReport";

export default function CityAnnualReportLayout(
  annualReport: AnnualReport,
  cityLegalStatuses: string[]
) {
  var adminFirstLastName = `${annualReport.newCityAdmin?.firstName ?? ""} ${
    annualReport.newCityAdmin?.lastName ?? ""
  }`;
  adminFirstLastName =
    adminFirstLastName.replace(/ /g, "").length > 0
      ? adminFirstLastName
      : "Інформацію не знайдено";

  var adminContacts = `${annualReport.newCityAdmin?.email ?? ""}\n${
    annualReport.newCityAdmin?.phoneNumber ?? ""
  }`;

  return {
    info: {
      title: `Річний звіт станиці ${annualReport.city?.name}`,
      author: "EPlast",
      subject: "Звіт станиці",
      creator: "EPlast",
      producer: "EPlast",
    },
    content: [
      {
        image: "PDFHeader.png",
        width: 595.28,
        margin: [-40, -40, 0, 0] as Margins,
      },
      {
        text: `Звіт станиці ${annualReport.city?.name} за ${new Date(
          annualReport.date
        ).getUTCFullYear()} рік`,
        style: "header",
      },
      {
        layout: {
          defaultBorder: false,
        },
        table: {
          heights: 33,
          widths: [200, "auto", "*"],
          body: [
            [
              {
                text: "Голова новообраної старшини:",
              },
              {
                text: `${adminFirstLastName}`,
              },
              {
                text: `${adminContacts}`,
                alignment: "right" as Alignment,
              },
            ],
            [
              "Правовий статус осередку:",
              {
                text: `${
                  cityLegalStatuses[annualReport.newCityLegalStatusType]
                }`,
                colSpan: 2,
              },
              "",
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
          widths: [200, 200, "*"],
          body: [
            //УПП
            [
              {
                rowSpan: 2,
                text: "УПП",
                border: [false, true, false, false],
              },
              {
                text: "Кількість гніздечок пташат:",
                border: [false, true, false, false],
              },
              {
                text: `${annualReport.numberOfSeatsPtashat}`,
                style: "numbers",
                border: [false, true, false, false],
              },
            ],
            [
              "",
              "Кількість пташат:",
              {
                text: `${annualReport.membersStatistic?.numberOfPtashata}`,
                style: "numbers",
              },
            ],
            //УПН
            [
              {
                rowSpan: 2,
                text: "УПН",
                border: [false, true, false, false],
              },
              {
                text: "Кількість самостійних роїв:",
                border: [false, true, false, false],
              },
              {
                text: `${annualReport.numberOfIndependentRiy}`,
                style: "numbers",
                border: [false, true, false, false],
              },
            ],
            [
              "",
              "Кількість новацтва:",
              {
                text: `${annualReport.membersStatistic?.numberOfNovatstva}`,
                style: "numbers",
              },
            ],
            //УПЮ
            [
              {
                rowSpan: 7,
                text: "УПЮ",
                border: [false, true, false, false],
              },
              {
                text: "Кількість куренів у станиці/паланці (окрузі/регіоні):",
                border: [false, true, false, false],
              },
              {
                text: `${annualReport.numberOfClubs}`,
                style: "numbers",
                border: [false, true, false, false],
              },
            ],
            [
              "",
              "Кількість самостійних гуртків:",
              {
                text: `${annualReport.numberOfIndependentGroups}`,
                style: "numbers",
              },
            ],
            [
              "",
              "Кількість неіменованих разом:",
              {
                text: `${annualReport.membersStatistic?.numberOfUnatstvaNoname}`,
                style: "numbers",
              },
            ],
            [
              "",
              "Кількість прихильників/ць:",
              {
                text: `${annualReport.membersStatistic?.numberOfUnatstvaSupporters}`,
                style: "numbers",
              },
            ],
            [
              "",
              "Кількість учасників/ць:",
              {
                text: `${annualReport.membersStatistic?.numberOfUnatstvaMembers}`,
                style: "numbers",
              },
            ],
            [
              "",
              "Кількість розвідувачів:",
              {
                text: `${annualReport.membersStatistic?.numberOfUnatstvaProspectors}`,
                style: "numbers",
              },
            ],
            [
              "",
              "Кількість скобів/вірлиць:",
              {
                text: `${annualReport.membersStatistic?.numberOfUnatstvaSkobVirlyts}`,
                style: "numbers",
              },
            ],
            //УСП
            [
              {
                rowSpan: 2,
                text: "УСП",
                border: [false, true, false, false],
              },
              {
                text: "Кількість старших пластунів прихильників:",
                border: [false, true, false, false],
              },
              {
                text: `${annualReport.membersStatistic?.numberOfSeniorPlastynSupporters}`,
                style: "numbers",
                border: [false, true, false, false],
              },
            ],
            [
              "",
              "Кількість старших пластунів:",
              {
                text: `${annualReport.membersStatistic?.numberOfSeniorPlastynMembers}`,
                style: "numbers",
              },
            ],
            //УПС
            [
              {
                rowSpan: 2,
                text: "УПС",
              },
              "Кількість сеньйорів пластунів прихильників:",
              {
                text: `${annualReport.membersStatistic?.numberOfSeigneurSupporters}`,
                style: "numbers",
              },
            ],
            [
              "",
              "Кількість сеньйорів пластунів:",
              {
                text: `${annualReport.membersStatistic?.numberOfSeigneurMembers}`,
                style: "numbers",
              },
            ],
            //Адміністрування та виховництво
            [
              {
                rowSpan: 3,
                text: "Адміністрування та виховництво",
                border: [false, true, false, false],
              },
              {
                text: "Кількість діючих виховників (з усіх членів УСП, УПС):",
                border: [false, true, false, false],
              },
              {
                text: `${annualReport.numberOfTeachers}`,
                style: "numbers",
                border: [false, true, false, false],
              },
            ],
            [
              "",
              "Кількість адміністраторів (в проводах будь якого рівня):",
              {
                text: `${annualReport.numberOfAdministrators}`,
                style: "numbers",
              },
            ],
            [
              "",
              "Кількість тих, хто поєднує виховництво та адміністрування:",
              {
                text: `${annualReport.numberOfTeacherAdministrators}`,
                style: "numbers",
              },
            ],
            //Пластприят
            [
              {
                rowSpan: 3,
                text: "Пластприят",
                border: [false, true, false, false],
              },
              {
                text: "Кількість пільговиків:",
                border: [false, true, false, false],
              },
              {
                text: `${annualReport.numberOfBeneficiaries}`,
                style: "numbers",
                border: [false, true, false, false],
              },
            ],
            [
              "",
              "Кількість членів Пластприяту:",
              {
                text: `${annualReport.numberOfPlastpryiatMembers}`,
                style: "numbers",
              },
            ],
            [
              "",
              "Кількість почесних членів:",
              {
                text: `${annualReport.numberOfHonoraryMembers}`,
                style: "numbers",
              },
            ],
            //Залучені кошти
            [
              {
                rowSpan: 4,
                text: "Залучені кошти",
                border: [false, true, false, false],
              },
              {
                text: "Державні кошти:",
                border: [false, true, false, false],
              },
              {
                text: `${annualReport.publicFunds}`,
                style: "numbers",
                border: [false, true, false, false],
              },
            ],
            [
              "",
              "Внески: ",
              {
                text: `${annualReport.contributionFunds}`,
                style: "numbers",
              },
            ],
            [
              "",
              "Пластовий заробіток:",
              {
                text: `${annualReport.plastSalary}`,
                style: "numbers",
              },
            ],
            [
              "",
              "Спонсорські кошти:",
              {
                text: `${annualReport.sponsorshipFunds}`,
                style: "numbers",
              },
            ],
            //Майно та потреби станиці
            [
              {
                colSpan: 3,
                text: `Майно та потреби станиці`,
                style: "secondHeader",
              },
            ],
            [
              {
                colSpan: 3,
                text: `Вкажіть, що вам допоможе ефективніше залучати волонтерів та створювати виховні частини (гнізда, курені):`,
                border: [false, true, false, false],
              },
            ],
            [
              {
                colSpan: 3,
                text: `${
                  annualReport.listProperty === null
                    ? "Інформація відсутня"
                    : annualReport.listProperty
                }`,
                border: [false, false, false, true],
              },
            ],
            [
              {
                colSpan: 3,
                text: `Вкажіть перелік майна, що є в станиці:`,
              },
            ],
            [
              {
                colSpan: 3,
                text: `${
                  annualReport.improvementNeeds === null
                    ? "Інформація відсутня"
                    : annualReport.improvementNeeds
                }`,
              },
            ],
          ],
        },
      },
    ],

    styles: {
      numbers: {
        alignment: "right" as Alignment,
      },
      header: {
        fontSize: 18,
        alignment: "center" as Alignment,
      },
      secondHeader: {
        fontSize: 16,
        alignment: "center" as Alignment,
      },
    },
    defaultStyle: {
      font: "Times",
      fontSize: 14,
    },
  };
}
