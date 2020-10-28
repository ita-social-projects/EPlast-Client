import BASE_URL from "../../config";
import * as signalR from '@microsoft/signalr';

const ManageConnection = function(userId : string){
    let connection = new signalR.HubConnectionBuilder()
    .configureLogging(signalR.LogLevel.Debug)
    .withUrl(BASE_URL.substr(0, BASE_URL.length-4) +`notifications?userId=${userId}`)
    .build();
    console.log(connection);
    
    connection.start().then(() => {
        console.log("Connected to Server!");
    }).catch((err) => {
        console.log(err);
        return err.toString();
    })
    
    return connection;
}


export default
{ 
    ManageConnection
};