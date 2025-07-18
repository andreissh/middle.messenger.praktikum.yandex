import { baseUrl } from "@/utils/utils";
import HttpClient from "./HttpClient";

const http = new HttpClient(baseUrl);

export default http;
