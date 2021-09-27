import axios, { AxiosError } from 'axios';
import { ErrorCode } from './types';

type ErrorResponse = {
    data: any;
    status: number;
    statusText: string;
};

export class HttpErrorResponse {
    isOk = false as const;

    response: ErrorResponse;

    constructor(error: AxiosError | Error) {
        if (axios.isAxiosError(error) && error.response !== undefined) {
            const { data, status, statusText } = error.response;

            this.response = { data, status, statusText };
        } else {
            this.response = {
                data: {},
                status: ErrorCode.Unknown,
                statusText: 'unknown',
            };
        }
    }

    get code(): ErrorCode {
        return this.response.status || 0; 
    }
}
