import BASE_URL from "../../config";

const GetURL = (userId: string): string => {
  let url = BASE_URL.substr(0, BASE_URL.length - 5);
  url = url.replace("http", "ws");
  return url + "/notifications" + `?userId=${userId}`;
};

function ManageConnection(userId: string) {
  const url = GetURL(userId);
  let socket = new WebSocket(url);
  socket.onopen = function (event) {
    console.log("opened connection to " + url);
  };
  socket.onclose = function (event) {
    console.log("closed connection from " + url);
  };
  socket.onerror = function (event) {
    console.log("error: " + event);
  };
  return socket;
}

export default {
  ManageConnection,
};
