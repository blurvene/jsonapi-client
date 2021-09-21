import { HttpClient, HttpResponse } from '../http-client';
import { JsonApiSuccessResponse } from './JsonApiSuccessResponse';
import { JsonApiErrorResponse } from './JsonApiErrorResponse';
import {
    Collection,
    CustomJsonApiConfig,
    ErrorCallback,
    JsonApiConfig,
    JsonApiResponse,
    Resource,
    ResourceMutation,
    Single,
} from './types';
import { getHttpConfig } from './lib';

export class JsonApiClient {
    static errorCallback: ErrorCallback;

    static onError(callback: ErrorCallback): void {
        JsonApiClient.errorCallback = callback;
    }

    constructor(private httpClient: HttpClient) {}

    private sendRequest(config: CustomJsonApiConfig): Promise<JsonApiResponse> {
        return this.httpClient.request(config).then((response: HttpResponse): JsonApiResponse => {
            if (response.isOk) {
                return new JsonApiSuccessResponse(response.data);
            }

            const jsonApiError = new JsonApiErrorResponse(response);

            if (JsonApiClient.errorCallback && config.skipPrimary !== true) {
                JsonApiClient.errorCallback(jsonApiError);
            }

            return jsonApiError;
        });
    }

    create<R = Resource>(
        data: Omit<ResourceMutation, 'id'>,
        config?: JsonApiConfig,
    ): Promise<JsonApiResponse<Single<R>>> {
        return this.sendRequest({ method: 'POST', ...getHttpConfig(data, config) });
    }

    readAll<R = Resource>(type: string, config?: JsonApiConfig): Promise<JsonApiResponse<Collection<R>>> {
        return this.sendRequest({ method: 'GET', ...getHttpConfig(type, config) });
    }

    readById<R = Resource>(
        type: string,
        id: string,
        config?: JsonApiConfig,
    ): Promise<JsonApiResponse<Single<R>>> {
        return this.sendRequest({ method: 'GET', ...getHttpConfig({ type, id }, config) });
    }

    update<R = ResourceMutation>(
        data: ResourceMutation,
        config?: JsonApiConfig,
    ): Promise<JsonApiResponse<Single<R>>> {
        return this.sendRequest({ method: 'PATCH', ...getHttpConfig(data, config) });
    }

    destroy(type: string, id: string, config?: JsonApiConfig): Promise<JsonApiResponse> {
        return this.sendRequest({ method: 'DELETE', ...getHttpConfig({ type, id }, config) });
    }
}
