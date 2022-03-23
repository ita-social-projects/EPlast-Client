import { GoverningBody } from "../../api/decisionsApi";
import { MethodicDocumentType } from "./MethodicDocumentType";

export type DocumentOnCreateData = {
  governingBodies: GoverningBody[];
  methodicDocumentTypesItems: MethodicDocumentType[];
};
