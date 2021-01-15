export type Document = {
    id: number;
    name: string;
    type: string;
    organization: string;
    description: string;
    date: string;
    fileName: string | null;
}

export type MethodicDocumentType = {
    text: string;
    value: string;
}
export type DocumentOnCreateData = {
    organizations: Organization[];
    methodicDocumentTypesItems: MethodicDocumentType[];
}

export type FileWrapper = {
    FileAsBase64: string | null;
    FileName: string | null;
}

export type Organization = {
    id: number;
    organizationName: string;
}

export type DocumentWrapper = {
    MethodicDocument: DocumentPost;
    fileAsBase64: string | null;
}
export type DocumentPost = {
    id: number;
    name: string;
    type: number;
    organization: Organization;
    description: string;
    date: string;
    fileName: string | null;
}