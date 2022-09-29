import { Roles } from "../../models/Roles/Roles";

enum UniqueGoverningBodyAdminTypes {
    Secretar = "Секретар Керівного Органу",
    Progress = "Член Керівного Органу з питань організаційного розвитку",
    Social = "Член Керівного Органу з соціального напрямку",
    Сommunication = "Член Керівного Органу відповідальний за зовнішні зв'язки"
}

enum GoverningBodyAdminTypes {
    Head = Roles.GoverningBodyHead,
    Secretar = UniqueGoverningBodyAdminTypes.Secretar,
    Progress = UniqueGoverningBodyAdminTypes.Progress,
    Social = UniqueGoverningBodyAdminTypes.Social,
    Сommunication = UniqueGoverningBodyAdminTypes.Сommunication
}

export default GoverningBodyAdminTypes