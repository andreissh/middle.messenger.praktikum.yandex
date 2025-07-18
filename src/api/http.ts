import { baseUrl } from "@/utils/utils";
import HttpClient from "./HttpClient";

export const http = new HttpClient(baseUrl);

export default http;
