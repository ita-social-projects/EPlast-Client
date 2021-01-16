import { Organization } from "../../api/decisionsApi"
import { MethodicDocumentType } from "./MethodicDocumentType"

export type DocumentOnCreateData = {
    organizations: Organization[];
    methodicDocumentTypesItems: MethodicDocumentType[];
}





