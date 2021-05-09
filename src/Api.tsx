import axios from "axios";

let url = "localhost:8000";
let protocol = "http://";
let ws_protocol = "ws://";

// set urls and protocol for production
if (window.location.href.includes("webssh.")) {
    url = "api.webssh.leith.de";
    protocol = "https://";
    ws_protocol = "wss://";
}

let apiUrl = protocol + url;
export let wsUrl = ws_protocol + url;

// create axios instance to use for API calls
const instance = axios.create({
    baseURL: apiUrl,
});

// add interceptor to always send token
instance.interceptors.request.use(function (config) {
    const token = localStorage.token;
    config.headers.token = token;
    return config;
});

// export API for further use
export default instance;
