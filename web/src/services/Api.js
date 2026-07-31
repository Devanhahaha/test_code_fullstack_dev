import axios from "axios";

const Api = axios.create({
    baseURL: "http://192.168.1.5:8000/api",
});

export default Api;