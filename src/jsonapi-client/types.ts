import { JsonApiErrorResponse } from './JsonApiErrorResponse';
import { JsonApiSuccessResponse } from './JsonApiSuccessResponse';
import { HttpConfig } from '../http-client';

export interface QueryOptions {
    filter?: {
        [key: string]: any;
    };
    fields?: {
        [key: string]: string;
    };
    include?: string;
    page?: {
        number?: number;
        size?: number;
    };
    sort?: string;
    [key: string]: unknown;
}

interface CustomJsonApiConfigParams {
    skipPrimary?: boolean;
}

export type CustomJsonApiConfig = HttpConfig & CustomJsonApiConfigParams;

export interface JsonApiConfig extends CustomJsonApiConfigParams {
    query?: QueryOptions;
    url?: string;
    skipInterceptor?: boolean;
    withCredentials?: boolean;
}

export type ErrorPayloadItem = {
    source?: {
        pointer: string;
    };
    title: string;
    detail: string;
};

export type ErrorPayload = {
    errors: ErrorPayloadItem[];
};

export type JsonApiResponse<T = any> = JsonApiErrorResponse | JsonApiSuccessResponse<T>;

export type Resource = {
    id: string;
    type: string;
    attributes: Record<string, any>;
    relationships: Record<string, any>;
    meta?: Record<string, any>;
};

export type ResourceMutation = {
    id: string;
    type: string;
    attributes?: Record<string, any>;
    relationships?: Record<string, any>;
    meta?: Record<string, any>;
};

export type Single<T> = {
    data: T;
    included: Resource[];
    meta: any;
};

export type Collection<T> = {
    data: T[];
    included: Resource[];
    meta: any;
};

export type ErrorCallback = (error: JsonApiErrorResponse) => void;
