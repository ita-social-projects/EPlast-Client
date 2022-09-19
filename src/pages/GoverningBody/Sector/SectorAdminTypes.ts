import { Roles } from "../../../models/Roles/Roles";

enum UniqueSectorAdminTypes {
    Secretar = "Секретар Керівного Органу",
    Progress = "Член Напряму Керівного Органу з питань організаційного розвитку",
    Social = "Член Напряму Керівного Органу з соціального напрямку",
    Сommunication = "Член Напряму Керівного Органу відповідальний за зовнішні зв'язки"
}

enum SectorAdminTypes {
    Head = Roles.GoverningBodySectorHead,
    Secretar = UniqueSectorAdminTypes.Secretar,
    Progress = UniqueSectorAdminTypes.Progress,
    Social = UniqueSectorAdminTypes.Social,
    Сommunication = UniqueSectorAdminTypes.Сommunication
}

export default SectorAdminTypes