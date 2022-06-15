import { createHook, createStore } from 'react-sweet-state';
import { GoverningBody } from '../api/decisionsApi';
import { createGoverningBody, getGoverningBodiesByPage, getGoverningBodiesList, getGoverningBodyById, removeGoverningBody, updateGoverningBody } from '../api/governingBodiesApi';
import { StoreActions } from './StoreActions';

type GoverningBodiesStoreState = Record<number, GoverningBody>;

type GoverningBodiesStoreActions = StoreActions<GoverningBodiesStoreState, number, GoverningBody>;

const initialState: GoverningBodiesStoreState = {}

const actions: GoverningBodiesStoreActions = {
  refreshAll: () => async ({ setState }) => {
    const result: GoverningBody[] = await getGoverningBodiesList();
    const newState: GoverningBodiesStoreState = {};

    // eslint-disable-next-line no-restricted-syntax
    for (const gb of result) {
      newState[gb.id] = gb;
    }

    setState(newState);
  },

  refreshByPage: (page, pageSize, filters, preserveOldState) => async ({ setState, getState }) => {
    const params = filters as {
      ["name"]: string | undefined
    };

    const result: GoverningBody[] = await getGoverningBodiesByPage(page, pageSize, params.name);
    const newState: GoverningBodiesStoreState = preserveOldState
      ? { ...getState() }
      : {};

    // eslint-disable-next-line no-restricted-syntax
    for (const gb of result) {
      newState[gb.id] = gb;
    }

    setState(newState);
  },

  refreshOneByKey: (key, preserveOldState) => async ({ setState, getState }) => {
    const result: GoverningBody = await getGoverningBodyById(key);
    const newState: GoverningBodiesStoreState = preserveOldState
      ? { ...getState() }
      : {};

    newState[key] = result;

    setState(newState);    
  },

  create: (entity) => async ({ setState, getState }) => {
    const result: number = await createGoverningBody(entity);

    const createdEntity = { ...entity } as GoverningBody;
    createdEntity.id = result;

    setState({
      ...getState(),
      [result]: createdEntity
    });

    return createdEntity;
  },

  updateByKey: (key, newEntity) => async ({ setState, getState }) => {
    await updateGoverningBody(key, newEntity);

    setState({
      ...getState(),
      [key]: newEntity
    });
  },

  patchByKey: (key, patchDoc) => ({ setState, getState }) => {
    throw new Error('Not Implemented Exception');
  },

  deleteAll: () => ({ setState, getState }) => {
    throw new Error('Not Implemented Exception');
  },

  deleteByKey: (key) => async ({ setState, getState }) => {
    await removeGoverningBody(key);

    setState({
      ...getState(),
      [key]: undefined
    });
  }
}

const governingBodiesStore = createStore<GoverningBodiesStoreState, GoverningBodiesStoreActions>({
  initialState,
  actions,
  name: 'GoverningBodiesStore'
});

/**
 * Get all governing bodies.
 * 
 * @returns Record (dictionary) with keys and governing bodies as KeyValue pairs of type `[key: number]: GoverningBody`.
 */
export const UseAllStoredGoverningBodies = createHook(governingBodiesStore);

/**
 * Get all governing bodies as list.
 * 
 * @returns List of governing bodies.
 */
export const UseAllStoredGoverningBodiesAsList = createHook(governingBodiesStore, {
  selector: (state) => {
    const list: GoverningBody[] = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const key in state) {
      if (state[key] as GoverningBody) list.push(state[key]);
    }

    return list;
  }
});

/**
 * Get governing body by id.
 * 
 * @returns Governing body by specified Id. Undefined, if not found.
 */
export const UseStoredGoverningBodyById = createHook(governingBodiesStore, {
  selector: (state, id: number): GoverningBody | undefined => state[id]
});
