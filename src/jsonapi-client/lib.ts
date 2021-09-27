import { CustomJsonApiConfig, ErrorPayloadItem, JsonApiConfig, QueryOptions } from './types';

export function serializeQuery(obj: any, prefix?: string): string {
    const str = [];

    for (const p in obj) {
        if (obj.hasOwnProperty(p) && obj[p] !== undefined) {
            const k = prefix ? `${prefix}[${p}]` : p;
            const v = obj[p];

            const element =
                v !== null && typeof v === 'object'
                    ? serializeQuery(v, k)
                    : `${encodeURIComponent(k)}=${encodeURIComponent(v)}`;

            if (element) {
                str.push(element);
            }
        }
    }

    return str.join('&');
}

function getQuery(query?: QueryOptions): string {
    if (!query) return '';

    query.include = query.include?.replace(/\s+/g, '');

    return serializeQuery(query);
}

export type Entity =
    | string
    | {
          id?: string;
          type: string;
      };

function getRequestUrl(entity: Entity, options?: JsonApiConfig): string {
    let resourceName;

    if (options?.url) {
        resourceName = options.url;
    } else {
        resourceName = typeof entity === 'string' ? entity : `${entity.type}/${entity.id || ''}`;
    }

    const queryString = getQuery(options?.query);
    return `${resourceName}?${queryString}`;
}

export function getHttpConfig(entity: Entity, options: JsonApiConfig = {}): CustomJsonApiConfig {
    const url = getRequestUrl(entity, options);
    const { skipInterceptor = false, skipPrimary = false, withCredentials = true, headers } = options;

    return {
        url,
        headers,
        data: typeof entity === 'object' ? { data: entity } : undefined,
        skipInterceptor,
        skipPrimary,
        withCredentials,
    };
}

export function getFieldName(item: ErrorPayloadItem): string | undefined {
    if (item.source) {
        return item.source.pointer.split('/')[3];
    }
}
