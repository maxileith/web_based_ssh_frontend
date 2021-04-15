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

export default instance;
