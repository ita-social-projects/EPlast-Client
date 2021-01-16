import { DocumentPost } from "./DocumentPost";

export type DocumentWrapper = {
    MethodicDocument: DocumentPost;
    fileAsBase64: string | null;
}