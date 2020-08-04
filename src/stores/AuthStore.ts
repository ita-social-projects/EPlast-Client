export default class AuthStore {
    static STORAGE_KEY: string = "token";

    static getToken() {
        return window.localStorage.getItem(AuthStore.STORAGE_KEY);
    }

    static setToken(token: string) {
        window.localStorage.setItem(AuthStore.STORAGE_KEY, token);
    }

    static removeToken(): void {
        window.localStorage.removeItem(AuthStore.STORAGE_KEY);
    }
}