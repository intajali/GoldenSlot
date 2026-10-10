import { _decorator, Color, resources, Asset } from 'cc';

export class GameUtils {

    /**
     * Deserialize JSON string to object
     * @param path 
     * @param type 
     * @returns 
     */
    public static loadResource<T extends Asset>(path: string, type: new () => T): Promise<T> {
        return new Promise((resolve, reject) => {
            resources.load(path, type, (err, asset) => {
                if (err) {
                    console.error('Resource not found:', err.message);
                    reject(err);
                    return;
                }
                resolve(asset);
            });
        });
    }

    /**
     * Load all assets of a given type from a resources directory
     */
    public static loadAllResource<T extends Asset>(
        path: string,
        assetType: new (...args: any[]) => T
    ): Promise<T[]> {
        return new Promise((resolve, reject) => {
            resources.loadDir(path, assetType, (err, assets) => {
                if (err) {
                    console.error(`[ResourceLoader] Failed to load dir: ${path}`, err);
                    resolve([]);
                    return;
                }
                resolve(assets as T[]);
            });
        });
    }

    public static hexToColor(hex: string): Color {
        return new Color().fromHEX(hex);
    }

}

