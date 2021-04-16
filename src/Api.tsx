import axios from "axios";

let apiUrl;

if (window.location.href.includes(".ssh.")) {
    apiUrl = "https://ssh."; // fancy url einfügen
} else {
    apiUrl = "http://localhost:8000";
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
