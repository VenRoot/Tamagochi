import * as ex from '../Excalibur/excalibur';

const consts = {
    SpriteDir: "../../assets/Sprites/",
    spriteInformation:
    {
        General:
        {
            Width: 16,
            Height: 16,
        }
    }
}

const game = new ex.Engine({
  width: 1280,
  height: 720,
  displayMode: ex.DisplayMode.FillScreen,
  pointerScope: ex.Input.PointerScope.Canvas
});

game.start().then(() => {
    console.log("Game started");
});


const canvas = new ex.Canvas({
    draw: (ctx) => {
        ctx.fillStyle = ex.Color.Red.toString();
        ctx.fillRect(0, 0, 100, 100);
    }
});

const actor = new ex.Actor({
    pos: game.screen.center
});

actor.graphics.use(canvas);


const fullScreen = async() => await game.screen.goFullScreen();

function loadSprite()
{
    const image = new ex.ImageSource(consts.SpriteDir+"Down/Down_Walking.png");

    return ex.SpriteSheet.fromImageSource({
        image: image,
        grid: {
            rows: 2,
            columns: 3,
            spriteWidth: 16,
            spriteHeight: 16
        }
    });
}

