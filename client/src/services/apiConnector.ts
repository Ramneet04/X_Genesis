import axios from "axios";
import type { AxiosRequestConfig, Method } from "axios";

export const axiosInstance = axios.create({});
export const apiConnector = (
  method: Method,
  url: string,
  bodyData: any = null,
  headers: Record<string, string> | null = null,
  params: Record<string, any> | null = null
) => {
  const config: AxiosRequestConfig = {
    method,
    url,
    data: bodyData,
    headers: headers ?? undefined,
    params: params ?? undefined,
  };

  return axiosInstance(config);
};
