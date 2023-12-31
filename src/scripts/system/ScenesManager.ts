import * as PIXI from "pixi.js";
import { App } from "./App";
import { Scene } from "./Scene";

export class ScenesManager {
    public container: PIXI.Container;
    public scene: Scene

    constructor() {
        this.container = new PIXI.Container();
        this.container.interactive = true;
        this.scene = null;
    }

    start(scene: string) {
        if (this.scene) {
            this.scene.destroy?.();
        }

        const SceneClass = App.config.scenes[scene];
        if (SceneClass) {
            this.scene = new SceneClass();
            this.container.addChild(this.scene.container);
        }
    }

    update(dt: number) {
        if (this.scene && this.scene.update) {
            this.scene.update(dt);
        }
    }
}