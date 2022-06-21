import { Action } from "react-sweet-state"

/**
 * Used only with `PATCH` requests in REST design.
 * {@link https://docs.microsoft.com/en-us/aspnet/core/web-api/jsonpatch?view=aspnetcore-6.0 Documentation}.
 */
export type JSONPatchDoc = {
    op: "add" | "remove" | "replace" | "move" | "copy" | "test",
    path: string,
    value: any
}[];

/**
 * Used for entities that are single in whole project, can be changed, but can not be deleted nor created.
 * 
 * @typeParam TStoreState - Type of the entity
 */
export type SingleEntityStoreActions<TStoreState, TContainerProps = null> = {
    /**
     * Get all entities from the backend. Always overwrites a previously stored entities in store's state.
     * 
     * @param filters
     * Plane object which will be sent to backend to filter data from database.
     * 
     * @remarks 
     * **DO NOT USE THIS ACTION** if you expect large amount of entities being pulled from backend.
     * Using this action in such cases may result in large client memory usage and very wide bandwith usage.
     * Use {@link StoreActions.refreshByPage | refreshPartial} instead for paginated or dynamically loaded results.
     * 
     * @throws {@link Error}
     * Thrown when GET request has failed (status 4xx - 5xx).
     */
    refreshAll: (filters?: { [filterName: string]: string | number | boolean }) => Action<TStoreState, TContainerProps, Promise<void>>;

    /**
     * Update (in fact - replace) the entity on the backend with all properties from the new state.
     * *Note:* this action used only if store's state represents only a single entity.
     *          
     * @param newState
     * New state using which update to entity will be performed.
     * 
     * @throws {@link Error}
     * Thrown when POST request has failed (status 4xx - 5xx).
     */
    updateWholeState: (newState: TStoreState) => Action<TStoreState, TContainerProps, Promise<void>>;
};

/**
 * Generic store actions
 * 
 * @typeParam TStoreState - Store's state type.
 * 
 * @typeParam TKey - Used to access entity by key in such actions: 
 * {@link StoreActions.refreshOneByKey | refreshOneByKey }, 
 * {@link StoreActions.updateByKey | updateByKey} and 
 * {@link StoreActions.deleteByKey | deleteByKey}.
 * 
 * @typeParam TEntity - Returned entity type by {@link StoreActions.create | create} action.
 * 
 * @typeParam TContainerProps - Container props type if store is being used in sweet-state container.
 */
export type StoreActions<
    TStoreState,
    TKey extends keyof any,
    TEntity,
    TContainerProps = null
    > = Pick<
        SingleEntityStoreActions<TStoreState, TContainerProps>,
        "refreshAll"
    > & {
        /**
         * Get some entities from the backend.
         * 
         * @remarks 
         * Used best with pagination or dynamically loaded scrollable lists.
         * 
         * @param page
         * Number of page to fetch.
         *
         * @param pageSize
         * Amount of entities on one page.
         * 
         * @param filters
         * Plane object which will be sent to backend to filter data from database.
         *
         * @param preserveOldState
         * Pass `true` to preserve old state, pass `false` to overwrite it.
         *
         * @throws {@link Error}
         * Thrown when GET request has failed (status 4xx - 5xx).
         */
        refreshByPage: (page: number, pageSize: number, filters?: { [filterName: string]: string | number | boolean }, preserveOldState?: boolean) => Action<TStoreState, TContainerProps, Promise<void>>;

        /**
         * Get single entity from the backend.
         * 
         * @param key
         * Key of the entity to be fetched in store's state.
         * 
         * @param preserveOldState
         * Pass `true` to preserve old state, pass `false` to overwrite it.
         * 
         * @throws {@link Error}
         * Thrown when GET request has failed (status 4xx - 5xx).
         */
        refreshOneByKey: (key: TKey, preserveOldState?: boolean) => Action<TStoreState, TContainerProps, Promise<void>>;

        /**
         * Create new entity
         * 
         * @param entity
         * Entity to be created. *Note:* this action does not and should not validate incoming entity.
         * 
         * @returns 
         * Created entity with assigned key (id).
         * 
         * @throws {@link Error}
         * Thrown when POST request has failed (status 4xx - 5xx).
         */
        create: (entity: TEntity) => Action<TStoreState, TContainerProps, Promise<TEntity>>;

        /**
         * Update (in fact - replace) the entity by key on the backend with specified new one.
         * 
         * @param key
         * Key of the entity to be replaced on the backend.
         * 
         * @param newEntity
         * Entity to replace with. 
         * *Note:* key property (`id`) of new entity should be the same with `key` param of the action, 
         * otherwise server might return a `400 Bad Request`.
         * 
         * @throws {@link Error}
         * Thrown when POST request has failed (status 4xx - 5xx).
         */
        updateByKey: (key: TKey, newEntity: TEntity) => Action<TStoreState, TContainerProps, Promise<void>>;

        /**
         * Patch the entity by key on the backend, using
         * {@link https://docs.microsoft.com/en-us/aspnet/core/web-api/jsonpatch?view=aspnetcore-6.0 JSON Patch Document}.
         * 
         * @param key
         * Key of the entity to be replaced on the backend.
         * 
         * @param patchDoc
         * {@link https://docs.microsoft.com/en-us/aspnet/core/web-api/jsonpatch?view=aspnetcore-6.0 JSON Patch Document}.
         * *Note:* key property (`id`) should not be patched, 
         * otherwise server might return a `400 Bad Request`.
         * 
         * @throws {@link Error}
         * Thrown when PATCH request has failed (status 4xx - 5xx).
         */
        patchByKey: (key: TKey, patchDoc: JSONPatchDoc) => Action<TStoreState, TContainerProps, Promise<void>>;

        /**
         * Delete all entities of type {@type TEntity} on the backend. 
         * **IS DANGEROUS AND NOT SHOULD NOT BE USED TO ARCHIVE ENTITIES**.
         * 
         * @throws {@link Error}
         * Thrown when DELETE request has failed (status 4xx - 5xx).
         */
        deleteAll: () => Action<TStoreState, TContainerProps, Promise<void>>;

        /**
         * Delete entity by key
         * 
         * @param key
         * Key of the entity to be deleted on the backend.
         * 
         * @throws {@link Error}
         * Thrown when DELETE request has failed (status 4xx - 5xx).
         */
        deleteByKey: (key: TKey) => Action<TStoreState, TContainerProps, Promise<void>>;
    };