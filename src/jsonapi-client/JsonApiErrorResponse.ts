import { titleize } from 'inflected';
import { ErrorCode, HttpErrorResponse } from '../http-client';
import { ErrorPayload } from './types';
import { getFieldName } from './lib';

export class JsonApiErrorResponse {
    isOk = false as const;
    code: ErrorCode;
    payload: ErrorPayload;

    constructor(public httpError: HttpErrorResponse) {
        const { data, status } = httpError.response;
        this.code = status;
        this.payload = data;
    }

    get errors(): Record<string, string> {
        return this.payload.errors.reduce<Record<string, string>>((accum, error) => {
            const fieldName = getFieldName(error);

            if (!fieldName) return accum;

            if (accum[fieldName] === undefined) {
                accum[fieldName] = error.title;
            }

            return accum;
        }, {});
    }

    get primaryErrors(): string[] {
        return this.payload.errors.reduce<string[]>((accum, error) => {
            if (!error.source) return accum;

            const { pointer } = error.source;

            if (pointer === '/data') {
                accum.push(error.title);
            }

            if (pointer.includes('/data/relationships')) {
                const name = getFieldName(error) as string;

                accum.push(`${titleize(name)}: ${error.title}`);
            }

            return accum;
        }, []);
    }

    get isPrimary(): boolean {
        return this.primaryErrors.length > 0;
    }

    get humanErrors(): string[] {
        return this.payload.errors.map((error) => {
            const name = getFieldName(error);

            if (name) {
                return `${titleize(name)}: ${error.title}`;
            }

            return error.title;
        });
    }

    get fullHumanError(): string {
        return this.humanErrors.join('; ');
    }
}
