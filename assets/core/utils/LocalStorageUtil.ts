/// LocalStorageUtil.ts
/// Utility class for local storage operations
/// Provides methods to set, get, and remove data from local storage
/// Supports number, string, and object types
/// Usage:
/// LocalStorageUtil.setNumber('key', 123);
/// const num = LocalStorageUtil.getNumber('key', 0);

import { sys } from 'cc';

export class LocalStorageUtil {

    static setNumber(key: string, value: number) {
        sys.localStorage.setItem(key, value.toString());
    }

    static getNumber(key: string, defaultValue = 0): number {
        const val = sys.localStorage.getItem(key);
        return val !== null ? Number(val) : defaultValue;
    }

    static setString(key: string, value: string) {
        sys.localStorage.setItem(key, value);
    }

    static getString(key: string, defaultValue = ''): string {
        const val = sys.localStorage.getItem(key);
        return val ?? defaultValue;
    }

    static setObject<T>(key: string, value: T) {
        sys.localStorage.setItem(key, JSON.stringify(value));
    }

    static getObject<T>(key: string, defaultValue: T): T {
        const val = sys.localStorage.getItem(key);
        if (!val) return defaultValue;

        try {
            return JSON.parse(val) as T;
        } catch {
            return defaultValue;
        }
    }


    static remove(key: string) {
        sys.localStorage.removeItem(key);
    }

    static clear() {
        sys.localStorage.clear();
    }
}
