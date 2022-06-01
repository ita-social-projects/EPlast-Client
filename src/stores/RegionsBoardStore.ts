import { Action, createHook, createStore } from "react-sweet-state"
import { GetRegionsBoard, EditRegion, addDocument, removeDocument } from "../api/regionsApi"
import CityDocument from "../models/City/CityDocument"
import { SingleEntityStoreActions } from "./StoreActions"

type RegionsBoard = {
  id: number,
  regionName: string,
  description?: string,
  logo?: string,
  email?: string,
  houseNumber?: string,
  link?: string,
  officeNumber?: string,
  phoneNumber?: string,
  postIndex?: number,
  street?: string,
  city?: string,
  documents: CityDocument[]
}

type RegionsBoardStoreState = RegionsBoard;

type RegionsBoardStoreActions = SingleEntityStoreActions<RegionsBoardStoreState> & {
  /**
   * @deprecated Documents will move to their special store some time
   */
  addDocument: (document: CityDocument) => Action<RegionsBoardStoreState>,

  /**
   * @deprecated Documents will move to their special store some time
   */
  deleteDocument: (id: number) => Action<RegionsBoardStoreState>
}

const initialState: RegionsBoardStoreState = {
  id: 0,
  regionName: "<Store is not refreshed! Call storeActions.refresh() before using the store>",
  postIndex: 0,
  documents: []
}

const actions: RegionsBoardStoreActions = {
  refreshAll: () => async ({ setState }) => {
    const { data } = await GetRegionsBoard();
    setState(data);
  },

  updateWholeState: (entity) => async ({ getState, setState }) => {
    await EditRegion(getState().id, entity);

    setState({
      ...entity,
      id: getState().id,
      documents: getState().documents,
    });

  },

  addDocument: (document) => async ({ getState, setState }) => {
    await addDocument(document);

    const newDocumentsState = Array.from(getState().documents);
    newDocumentsState.push(document);

    setState({
      ...getState(),
      documents: newDocumentsState
    })
  },

  deleteDocument: (id) => async ({ getState, setState }) => {
    await removeDocument(id);

    const newDocuments = Array
      .from(getState().documents)
      .filter(d => d.id !== id);

    setState({
      ...getState(),
      documents: newDocuments
    });
  }
}

const regionsBoardStore = createStore<RegionsBoardStoreState, RegionsBoardStoreActions>({
  initialState,
  actions,
  name: 'RegionBoardStore'
});

/**
 * Get regions board.
 */
export const GetStoredRegionsBoard = createHook(regionsBoardStore);

/**
 * Get documents from regions board.
 * 
 * @returns Documents, or empty array.
 * 
 * @deprecated Documents will move to their special store some time.
 */
export const GetStoredRegionsBoardDocuments = createHook(regionsBoardStore, {
  selector: (state) => state.documents
});

/**
 * Get document by id from regions board.
 * 
 * @param id: number - Id of the document.
 * 
 * @returns Document by specified key. Undefined, if not found.
 * 
 * @deprecated Documents will move to their special store some time.
 */
export const GetStoredRegionsBoardDocumentById = createHook(regionsBoardStore, {
  selector: (state, id: number): CityDocument | undefined => state.documents.find(d => d.id === id)
});
