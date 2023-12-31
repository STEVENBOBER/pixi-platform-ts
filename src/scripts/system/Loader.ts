import { Loader as PIXI_Loader } from 'pixi.js';
import { LoaderConfig } from '../../ts/interface';


export class Loader {
    public loader: PIXI_Loader;
    public config: LoaderConfig;
    public resources: { [key: string]: any };

    constructor(loader: PIXI_Loader, config: LoaderConfig) {
        this.loader = loader;
        this.config = config;
        this.resources = {};
    }

    preload(): Promise<void> {

        for (const asset of this.config.loader) {
            let key = asset.key.substr(asset.key.lastIndexOf('/') + 1);
            key = key.substring(0, key.indexOf('.'));
            if (asset.key.indexOf('.png') !== -1 || asset.key.indexOf('.jpg') !== -1) {
                this.loader.add(key, asset.data.default);
            }
        }

        return new Promise<void>((resolve) => {
            this.loader.load((loader, resources) => {
                this.resources = resources;
                resolve();
            });
        });
    }
}
