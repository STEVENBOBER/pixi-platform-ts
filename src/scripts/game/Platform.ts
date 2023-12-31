import * as Matter from 'matter-js';
import * as PIXI from "pixi.js";
import { App } from '../system/App';
import { Diamond } from './Diamond';
import { Slime } from './Slime';
import { ExtendedBodyPlatform } from '../../ts/interface';

export class Platform {
    diamonds: Diamond[];
    slimes: Slime[];
    rows: number;
    cols: number;
    tileSize: number;
    width: number;
    height: number;
    dx: number;
    container: PIXI.Container;
    body: ExtendedBodyPlatform;

    constructor(rows: number, cols: number, x: number) {
        // [10]
        this.diamonds = [];
        this.slimes = [];
        // [/10]

        this.rows = rows;
        this.cols = cols;

        this.tileSize = PIXI.Texture.from("tile").width;
        this.width = this.tileSize * this.cols;
        this.height = this.tileSize * this.rows;

        this.createContainer(x);
        this.createTiles();

        this.dx = App.config.platforms.moveSpeed;
        this.createBody();
        this.createDiamonds();
        this.createSlimes();
    }

    // [10]
    createDiamonds() {
        const y = App.config.diamonds.offset.min + Math.random() * (App.config.diamonds.offset.max - App.config.diamonds.offset.min);

        for (let i = 0; i < this.cols; i++) {
            if (Math.random() < App.config.diamonds.chance) {
                this.createDiamond(this.tileSize * i, -y);
            }
        }
    }

    createDiamond(x: number, y: number) {
        const diamond = new Diamond(x, y);
        this.container.addChild(diamond.sprite);
        diamond.createBody();
        this.diamonds.push(diamond);
    }

    createSlimes() {
        const y = App.config.slimes.offset.min + Math.random() * (App.config.slimes.offset.max - App.config.slimes.offset.min);

        for (let i = 0; i < this.cols; i++) {
            if (Math.random() < App.config.slimes.chance) {
                this.createSlime(this.tileSize * i, -y);
            }
        }
    }

    createSlime(x: number, y: number) {
        const slime = new Slime(x, y);
        this.container.addChild(slime.sprite);
        slime.createBody();
        this.slimes.push(slime);
    }

    // [/10]

    createBody() {
        this.body = Matter.Bodies.rectangle(this.width / 2 + this.container.x, this.height / 2 + this.container.y, this.width, this.height, { friction: 0, isStatic: true });
        Matter.World.add(App.physics.world, this.body);
        this.body.gamePlatform = this;
    }

    createContainer(x: number) {
        this.container = new PIXI.Container();
        this.container.x = x;
        this.container.y = window.innerHeight - this.height;
    }

    createTiles() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                this.createTile(row, col);
            }
        }
    }

    createTile(row: number, col: number) {
        const texture = row === 0 ? "platform" : "tile"
        const tile = App.sprite(texture);
        this.container.addChild(tile);
        tile.x = col * tile.width;
        tile.y = row * tile.height;
    }


    // 06
    move() {
        if (this.body) {
            Matter.Body.setPosition(this.body, { x: this.body.position.x + this.dx, y: this.body.position.y });
            this.container.x = this.body.position.x - this.width / 2;
            this.container.y = this.body.position.y - this.height / 2;
        }
    }

    destroy() {
        Matter.World.remove(App.physics.world, this.body);
        this.diamonds.forEach(diamond => diamond.destroy());
        this.slimes.forEach(slime => slime.destroy());
        this.container.destroy();
    }
}