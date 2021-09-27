import { AxiosRequestConfig } from 'axios';
import { HttpErrorResponse } from './HttpErrorResponse';
import { HttpSuccessResponse } from './HttpSuccessResponse';

export type CustomConfigParams = {
    skipInterceptor?: boolean;
};

export type HttpConfig = CustomConfigParams & AxiosRequestConfig;
export type MethodHttpConfig = Omit<HttpConfig, 'method'>;

export type HttpClientConfig = {
    baseURL: string;
    headers: Record<string, string>;
    withCredentials: boolean;
};

export type HttpResponse<T = any> = HttpErrorResponse | HttpSuccessResponse<T>;

export enum ErrorCode {
    Unknown = 0,
    BadRequest = 400,
    NotAuthorized = 401,
    Forbidden = 403,
    NotFound = 404,
    Validation = 422,
    Locked = 423,
    BlockedIp = 424,
    RequiredTwoFactor = 432,
    InternalServer = 500,
    BadGateway = 502,
}

export type ErrorCallback = (error: HttpErrorResponse) => void;
