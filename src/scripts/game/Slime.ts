import * as PIXI from "pixi.js";
import * as Matter from 'matter-js';
import { App } from '../system/App';
import { ExtendedBodySlime } from "../../ts/interface";

export class Slime {
  sprite: PIXI.AnimatedSprite;
  body: ExtendedBodySlime;

  constructor(x: number, y: number) {
    this.createSprite(x, y);
    App.app.ticker.add(this.update, this);
  }

  createSprite(x: number, y: number) {
    this.sprite = new PIXI.AnimatedSprite([
      App.res("Attack1"),
      App.res("Attack2")
    ]);

    this.sprite.x = x;
    this.sprite.y = y;

    this.sprite.loop = true;
    this.sprite.animationSpeed = 0.01;
    this.sprite.play();



  }

  update() {
    if (this.sprite) {
      Matter.Body.setPosition(this.body, { x: this.sprite.width / 2 + this.sprite.x + this.sprite.parent.x, y: this.sprite.height / 2 + this.sprite.y + this.sprite.parent.y });
    }
  }

  createBody() {
    this.body = Matter.Bodies.rectangle(this.sprite.width / 2 + this.sprite.x + this.sprite.parent.x, this.sprite.height / 2 + this.sprite.y + this.sprite.parent.y, this.sprite.width, this.sprite.height, { friction: 0, isStatic: true, render: { fillStyle: '#060a19' } });
    this.body.isSensor = true;
    this.body.gameSlime = this;
    Matter.World.add(App.physics.world, this.body);
  }

  // [14]
  destroy() {
    if (this.sprite) {
      App.app.ticker.remove(this.update, this);
      Matter.World.remove(App.physics.world, this.body);
      this.sprite.destroy();
      this.sprite = null;
    }
  }
}