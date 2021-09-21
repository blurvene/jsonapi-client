import { AxiosResponse } from 'axios';
import { ErrorCode } from './types';

export class HttpErrorResponse {
    isOk = false as const;

    constructor(public response: AxiosResponse) {}

    get code(): ErrorCode {
        return this.response?.status || 0;
    }
}
