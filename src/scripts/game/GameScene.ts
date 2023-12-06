import * as Matter from 'matter-js';
import { LabelScore } from "./LabelScore";
import { App } from '../system/App';
import { Background } from "./Background";
import { Scene } from '../system/Scene';
import { Hero } from "./Hero";
import { Platforms } from "./Platforms";
import { ExtendedBodyGameScene } from '../../ts/interface';
import { Leaderboard } from './Leaderboard';
import { Scores } from '../system/Scores';
import { ScoresType } from '../../ts/types';

export class GameScene extends Scene {
    public bg: Background;
    public hero: Hero;
    public platforms: Platforms;
    public labelScore: LabelScore;
    public leaderboard: Leaderboard;
    public body: ExtendedBodyGameScene;

    create() {
        this.createBackground();
        this.createHero();
        this.createPlatforms();
        this.setEvents();
        //[13]

        this.showLeaderboard();

        this.createUI();

    }
    //[13]
    createUI() {
        this.labelScore = new LabelScore();
        this.container.addChild(this.labelScore);
        this.hero.sprite.on("score", () => {
            this.labelScore.renderScore(this.hero.score);
        });
    }
    //[13]

    setEvents() {
        Matter.Events.on(App.physics, 'collisionStart', this.onCollisionStart.bind(this));
    }

    onCollisionStart(event: Matter.IEventCollision<Matter.Engine>) {
        // Simple way to ensure type safety among colliders
        const colliders = [event.pairs[0].bodyA, event.pairs[0].bodyB] as ExtendedBodyGameScene[];
        const hero = colliders.find(body => body.gameHero);
        const platform = colliders.find(body => body.gamePlatform);
        const diamond = colliders.find(body => body.gameDiamond);
        const slime = colliders.find(body => body.gameSlime);


        if (hero && platform) {
            this.hero.stayOnPlatform(platform.gamePlatform.body);
        }

        if (hero && slime) {
            this.hero.slimeAttack(slime.gameSlime);
        }

        if (hero && diamond) {
            this.hero.collectDiamond(diamond.gameDiamond);

        }
    }

    createHero() {
        this.hero = new Hero();
        this.container.addChild(this.hero.sprite);
        this.hero.assignName();

        this.container.interactive = true;
        this.container.on("pointerdown", () => {
            this.hero.startJump();
        });

        // [/14]
        this.hero.sprite.once("die", () => {
            (Scores as ScoresType)[this.hero.name] = this.hero.score;
            const sortedScores = Object.entries(Scores).sort(([, scoreA], [, scoreB]) => scoreB - scoreA);
            if (this.hero.name === sortedScores[0][0]) {
                this.hero.startFireworksAnimation();
                this.hero.showNewHighScoreMessage();
                this.leaderboard.updateScore(this.hero.name, this.hero.score);
            }
            this.hero.nameText.text = '';
            App.scenes.start("Game");
        });
    }

    showLeaderboard() {
        this.leaderboard = new Leaderboard();
        this.container.addChild(this.leaderboard.container)
        // this.leaderboard.updateScore()
        this.leaderboard.show()
    }

    createBackground() {
        this.bg = new Background();
        this.container.addChild(this.bg.container);
    }

    createPlatforms() {
        this.platforms = new Platforms();
        this.container.addChild(this.platforms.container);
    }

    update(dt: number) {
        this.bg.update(dt);
        this.platforms.update(dt);
    }

    destroy() {
        Matter.Events.off(App.physics, 'collisionStart', this.onCollisionStart.bind(this));
        App.app.ticker.remove(this.update, this);
        this.bg.destroy();
        this.hero.destroy();
        this.platforms.destroy();
        this.labelScore.destroy();
    }
}