import axios from "axios";

let url = "localhost:8000";
let protocol = "http://";
let ws_protocol = "ws://";

if (window.location.href.includes("webssh.")) {
    url = "api.webssh.leith.de"; // fancy url einfügen
    protocol = "https://";
    ws_protocol = "wss://";
}

let apiUrl = protocol + url;
export let wsUrl = ws_protocol + url;

const instance = axios.create({
    baseURL: apiUrl,
});

instance.interceptors.request.use(function (config) {
    const token = localStorage.token;
    config.headers.token = token;
    return config;
});

export default instance;
