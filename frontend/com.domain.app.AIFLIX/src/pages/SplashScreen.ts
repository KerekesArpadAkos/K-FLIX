import { Lightning, Utils, Router } from "@lightningjs/sdk";
import lng from "@lightningjs/sdk/src/Lightning";
import { SCREEN_SIZES } from "../../static/constants/ScreenSizes";

function delay(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export class SplashScreen extends Lightning.Component {
  static override _template() {
    return {
      w: SCREEN_SIZES.WIDTH,
      h: SCREEN_SIZES.HEIGHT,
      Background: {
        texture: lng.Tools.getSvgTexture(
          Utils.asset("images/background.svg"),
          SCREEN_SIZES.WIDTH,
          SCREEN_SIZES.HEIGHT
        ),
      },
      Logo: {
        x: SCREEN_SIZES.WIDTH / 2,
        y: SCREEN_SIZES.HEIGHT / 2,
        mount: 0.5,
        Thunder: {
          x: -300,
          y: 0,
          mount: 0.5,
          alpha: 0,
          texture: lng.Tools.getSvgTexture(
            Utils.asset("images/logoImage.svg"),
            500,
            300
          ),
        },
        Name: {
          x: 250,
          y: 70,
          mountX: 0.5,
          mountY: 0.75,
          alpha: 0,
          texture: lng.Tools.getSvgTexture(
            Utils.asset("images/logoName.svg"),
            600,
            200
          ),
        },
        Slogan: {
          x: 0,
          y: 200,
          mount: 0.5,
          alpha: 0,
          texture: lng.Tools.getSvgTexture(
            Utils.asset("images/logoSlogan.svg"),
            1620,
            40
          ),
        },
      },
    };
  }

  get Logo() {
    return this.getByRef("Logo");
  }

  get Thunder() {
    return this.Logo.tag("Thunder");
  }

  get Name() {
    return this.Logo.tag("Name");
  }

  get Slogan() {
    return this.Logo.tag("Slogan");
  }

  override async _init() {
    await delay(500);
    await this.Name.setSmooth("alpha", 1, { duration: 1.3 });
    await this.Name.animation({
      duration: 1.3,
      actions: [
        { p: "y", v: { 0: 100, 1: 50 } },
        { p: "scale", v: { 0: 0.8, 0.5: 1.1, 1: 1 } },
      ],
    }).start();

    await this.Thunder.setSmooth("alpha", 1, { duration: 2 });
    await this.Thunder.animation({
      duration: 2,
      actions: [
        { p: "scale", v: { 0: 4, 0.5: 1 } },
        {
          p: "rotation",
          v: { 0: 0, 0.5: 2 * Math.PI },
        },
      ],
    }).start();

    await delay(2000);
    await this.Slogan.setSmooth("alpha", 1, { duration: 2 });
    await this.Slogan.animation({
      duration: 2,
      actions: [{ p: "scale", v: { 0: 0.8, 0.5: 1.1, 1: 1 } }],
    }).start();

    await delay(3500);
    await this.Logo.setSmooth("alpha", 0, { duration: 1 });

    if(!localStorage.getItem("userId") || !localStorage.getItem("profileId")) {
      Router.navigate("welcome");
    }else{
      Router.navigate("home");
    }
  }
}

export default SplashScreen;
