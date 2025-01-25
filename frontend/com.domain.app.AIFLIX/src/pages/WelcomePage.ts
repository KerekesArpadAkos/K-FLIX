import { Utils } from "@lightningjs/sdk";
import { Lightning, Router } from "@lightningjs/sdk";
import { Button } from "src/components/Button";
import { COLORS } from "static/constants/Colors";
import { SCREEN_SIZES } from "static/constants/ScreenSizes";

interface WelcomPageTemplateSpec extends Lightning.Component.TemplateSpec {
  Image: object;
  Name: object;
  WelcomeMessage: object;
  LoginAndRegisterMessage: object;
  LoginButton: typeof Button;
  RegisterButton: typeof Button;
}

export default class WelcomePage extends Lightning.Component<WelcomPageTemplateSpec> {
  static override _template(): Lightning.Component.Template<WelcomPageTemplateSpec> {
    return {
      // color: COLORS.BACKGROUND,
      Image:{
        src: Utils.asset("images/background.png"),
        w: SCREEN_SIZES.WIDTH,
        h: SCREEN_SIZES.HEIGHT,
        scale: 1.1
      },
      rect: true,
      w: SCREEN_SIZES.WIDTH,
      h: SCREEN_SIZES.HEIGHT,
      Name: {
        x: 147,
        y: 219,
        w: 404,
        h: 97,
        text: {
          text: "AIFLIX",
          fontSize: 80,
          fontFace: "NetflixSans-Bold",
          textColor: COLORS.WHITE,
        },
      },
      WelcomeMessage: {
        x: 147,
        y: 418,
        w: 1086,
        h: 93,
        text: {
          text: "Welcome to the Ultimate Movie Experience",
          fontSize: 53,
          fontFace: "NetflixSans-Medium",
          textColor: COLORS.WHITE,
        },
      },
      LoginAndRegisterMessage: {
        x: 147,
        y: 534,
        w: 870,
        h: 57,
        text: {
          text: "Sign In or Sign Up to start your thrilling movie adventure!",
          fontSize: 30,
          fontFace: "NetflixSans-Regular",
          textColor: COLORS.WHITE,
        },
      },
      LoginButton: {
        type: Button,
        x: 147,
        y: 755,
        w: 314,
        h: 50,
        buttonText: "Sign In",
        fontSize: 30,
        textColor: COLORS.WHITE,
        backgroundColor: COLORS.RED_BUTTON,
        shader: {
          type: Lightning.shaders.RoundedRectangle,
          radius: 6,
        },
      },
      RegisterButton: {
        type: Button,
        x: 584,
        y: 755,
        w: 314,
        h: 50,
        buttonText: "Sign Up",
        fontSize: 30,
        textColor: COLORS.WHITE,
        backgroundColor: COLORS.RED_BUTTON,
        shader: {
          type: Lightning.shaders.RoundedRectangle,
          radius: 6,
        },
      },
    };
  }

  get LoginButton() {
    return this.tag("LoginButton");
  }

  get RegisterButton() {
    return this.tag("RegisterButton");
  }

  override _init() {
    this._setState("LoginButton");
  }

  static override _states() {
    return [
      class LoginButton extends this {
        override _getFocused() {
          return this.LoginButton;
        }
        override _handleRight() {
          this._setState("RegisterButton");
        }
        override _handleEnter() {
          Router.navigate("signin");
        }
      },
      class RegisterButton extends this {
        override _getFocused() {
          return this.RegisterButton;
        }
        override _handleLeft() {
          this._setState("LoginButton");
        }
        override _handleEnter() {
          Router.navigate("signup");
        }
      },
    ];
  }
}
