import { Tools } from "../system/Tools";
import { GameScene } from "./GameScene";
import { ConfigType } from "../../ts/interface";

// Added ConfigType to increase type safety of
// Config values.

export const Config: ConfigType = {
    loader: Tools.massiveRequire(require["context"]('./../../sprites/', true, /\.(mp3|png|jpe?g)$/)),
    bgSpeed: 2,
    score: {
        x: 10,
        y: 10,
        anchor: 0,
        style: {
            fontFamily: "Verdana",
            fontWeight: "bold",
            fontSize: 44,
            fill: ["#FF7F50"]
        }
    },
    diamonds: {
        chance: 0.4,
        offset: {
            min: 100,
            max: 200
        }
    },

    // Sets position and chance of enemy slime appearing. 
    slimes: {
        chance: 0.2,
        offset: {
            min: 40,
            max: 40
        },
    },

    platforms: {
        moveSpeed: -2.0,
        ranges: {
            rows: {
                min: 2,
                max: 6
            },
            cols: {
                min: 3,
                max: 9
            },
            offset: {
                min: 60,
                max: 200
            }
        }
    },
    hero: {
        jumpSpeed: 15,
        maxJumps: 2,
        position: {
            x: 350,
            y: 595
        }
    },
    scenes: {
        "Game": GameScene
    }
};