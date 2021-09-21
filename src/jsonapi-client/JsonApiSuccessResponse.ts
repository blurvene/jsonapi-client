export class JsonApiSuccessResponse<T = any> {
    isOk = true as const;

    constructor(public result: T) {}
}
