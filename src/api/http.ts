import HttpClient from "./HttpClient";

const baseUrl = "https://ya-praktikum.tech/api/v2/";
export const http = new HttpClient(baseUrl);

export default http;
