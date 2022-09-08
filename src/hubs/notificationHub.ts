import * as signalR from "@microsoft/signalr"
import { UserNotification } from "../api/NotificationBoxApi";
import AuthLocalStorage from "../AuthLocalStorage"
import BASE_URL from "../config"

class NotificationHub {
    private readonly connection: signalR.HubConnection

    constructor() {
        let url = BASE_URL.substr(0, BASE_URL.length - 5);
        this.connection = new signalR
            .HubConnectionBuilder()
            .withUrl(`${url}/hubs/notification`, { accessTokenFactory: () => AuthLocalStorage.getToken() || ""})
            .configureLogging(signalR.LogLevel.Information)
            .build()

        this.start()
    }
    public OnSend = (method: (text: string) => void) => {
        this.connection.on("Send", method)
    }

    public onAddNotification = (method: (userNotification: UserNotification) => void) => {
        this.connection.on("AddNotification", method)
    }

    public start = () => this.connection.start()
    public stop = () => this.connection.stop()
}

export default NotificationHub