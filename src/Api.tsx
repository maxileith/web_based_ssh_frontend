import axios from "axios";

let apiUrl = "http://localhost:8000";

if (window.location.href.includes("webssh.")) {
    apiUrl = "https://api.webssh.leith.de"; // fancy url einfügen
}

const instance = axios.create({
    baseURL: apiUrl,
});

instance.interceptors.request.use(function (config) {
    const token = localStorage.token;
    config.headers.token = token;
    return config;
});

export default instance;
