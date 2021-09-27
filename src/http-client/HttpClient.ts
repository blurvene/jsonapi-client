import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { HttpErrorResponse } from './HttpErrorResponse';
import { HttpSuccessResponse } from './HttpSuccessResponse';
import {
    CustomConfigParams,
    ErrorCallback,
    HttpClientConfig,
    HttpConfig,
    HttpResponse,
    MethodHttpConfig,
} from './types';

function splitConfigs(httpConfig: HttpConfig = {}): [AxiosRequestConfig, CustomConfigParams] {
    const { skipInterceptor, ...axiosConfig } = httpConfig;

    return [
        axiosConfig,
        {
            skipInterceptor,
        },
    ];
}

export class HttpClient {
    axios: AxiosInstance;
    static errorCallback: ErrorCallback;

    constructor(config: HttpClientConfig) {
        this.axios = axios.create(config);
    }

    static onError(callback: ErrorCallback): void {
        HttpClient.errorCallback = callback;
    }

    private static handleSuccess(response: AxiosResponse): HttpSuccessResponse {
        return new HttpSuccessResponse(response);
    }

    private static handleError(error: AxiosError | Error, config: CustomConfigParams): HttpErrorResponse {
        const httpError = new HttpErrorResponse(error);

        if (HttpClient.errorCallback && config.skipInterceptor !== true) {
            HttpClient.errorCallback(httpError);
        }

        return httpError;
    }

    request(config: HttpConfig): Promise<HttpResponse> {
        const [axiosConfig, customConfig] = splitConfigs(config);
        return this.axios
            .request(axiosConfig)
            .then(HttpClient.handleSuccess)
            .catch((error) => {
                return HttpClient.handleError(error, customConfig);
            });
    }

    get(config: MethodHttpConfig): Promise<HttpResponse> {
        return this.request({ ...config, method: 'GET' });
    }

    post(config: MethodHttpConfig): Promise<HttpResponse> {
        return this.request({ ...config, method: 'POST' });
    }

    delete(config: MethodHttpConfig): Promise<HttpResponse> {
        return this.request({ ...config, method: 'DELETE' });
    }

    patch(config: MethodHttpConfig): Promise<HttpResponse> {
        return this.request({ ...config, method: 'PATCH' });
    }
}
