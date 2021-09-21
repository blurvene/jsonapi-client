import { AxiosResponse } from 'axios';

export class HttpSuccessResponse<T = any> {
    isOk = true as const;
    data: T;
    headers: Record<string, string>;

    constructor(response: AxiosResponse<T>) {
        this.data = response.data;
        this.headers = response.headers;
    }
}
