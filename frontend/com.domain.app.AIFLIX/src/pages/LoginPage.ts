import { Lightning, Router } from "@lightningjs/sdk";
import { Button } from "src/components/Button";
import { COLORS } from "static/constants/Colors";
import { SCREEN_SIZES } from "static/constants/ScreenSizes";
import { LandscapeKeyboard } from "src/components/LandscapeKeyboard";

interface LoginPageTemplateSpec extends Lightning.Component.TemplateSpec {
  Name: object;
  Container: {
    EmailContainer: {
      EmailLabel: object;
    };
    PasswordContainer: {
      PasswordLabel: object;
    };
    LoginButton: typeof Button;
    NoAccountMessage: object;
    RegisterButton: typeof Button;
  };
  //here will come the LandscapeKeyboard component
  LandscapeKeyboard: typeof LandscapeKeyboard;
}

export default class LoginPage extends Lightning.Component<LoginPageTemplateSpec> {
  static override _template(): Lightning.Component.Template<LoginPageTemplateSpec> {
    return {
      rect: true,
      w: SCREEN_SIZES.WIDTH,
      h: SCREEN_SIZES.HEIGHT,
      color: COLORS.BACKGROUND,

      Name: {
        x: 785,
        y: 31,
        text: {
          text: "AIFLIX",
          fontSize: 100,
          fontFace: "Regular",
          textColor: COLORS.WHITE,
        },
        zIndex: 1,
      },

      Container: {
        x: 722,
        y: 125,
        w: 476,
        h: 614,
        rect: true,
        color: COLORS.BACKGROUND,
        EmailContainer: {
          x: 15,
          y: 89,
          w: 450,
          h: 90,
          color: COLORS.BLACK,
          rect: true,
          shader: {
            type: Lightning.shaders.RoundedRectangle,
            radius: 10,
            stroke: 3,
            strokeColor: COLORS.GREY_LIGHT,
          },
          EmailLabel: {
            x: 15,
            y: 25,
            w: 420,
            h: 45,
            text: {
              text: "Email",
              fontSize: 25,
              fontFace: "Regular",
              textColor: COLORS.WHITE,
            },
            shader: {
              type: Lightning.shaders.RoundedRectangle,
              radius: 0,
              stroke: 0,
            },
          },
        },

        PasswordContainer: {
          x: 15,
          y: 233,
          w: 450,
          h: 90,
          color: COLORS.BLACK,
          rect: true,
          shader: {
            type: Lightning.shaders.RoundedRectangle,
            radius: 10,
            stroke: 3,
            strokeColor: COLORS.GREY_LIGHT,
          },
          PasswordLabel: {
            x: 16,
            y: 25,
            w: 420,
            h: 45,
            text: {
              text: "Password",
              fontSize: 25,
              fontFace: "Regular",
              textColor: COLORS.WHITE,
            },
            shader: {
              type: Lightning.shaders.RoundedRectangle,
              radius: 0,
              stroke: 0,
            },
          },
        },

        LoginButton: {
          type: Button,
          x: 15,
          y: 440,
          w: 450,
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

        NoAccountMessage: {
          x: 15,
          y: 514,
          w: 461,
          h: 30,
          text: {
            text: "Don't have an account yet?",
            fontSize: 25,
            fontFace: "Regular",
            textColor: COLORS.WHITE,
            textAlign: "center",
          },
        },

        RegisterButton: {
          type: Button,
          x: 140,
          y: 564,
          w: 200,
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
      },
      LandscapeKeyboard: {
        type: LandscapeKeyboard,
        visible: false,
      },
    };
  }

  get Container() {
    return this.getByRef("Container");
  }

  get EmailContainer() {
    return this.Container?.getByRef("EmailContainer");
  }

  get EmailLabel() {
    return this.EmailContainer?.getByRef("EmailLabel");
  }

  get PasswordContainer() {
    return this.Container?.getByRef("PasswordContainer");
  }

  get PasswordLabel() {
    return this.PasswordContainer?.getByRef("PasswordLabel");
  }

  get LoginButton() {
    return this.Container?.getByRef("LoginButton");
  }

  get RegisterButton() {
    return this.Container?.getByRef("RegisterButton");
  }

  get LandscapeKeyboard() {
    return this.getByRef("LandscapeKeyboard");
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
        override _handleUp() {
          this._setState("PasswordContainer");
        }
        override _handleDown() {
          this._setState("RegisterButton");
        }
        override _handleEnter() {
          // Router.navigate("signin");
          //here should be the logic to sign in
        }
      },
      class RegisterButton extends this {
        override _getFocused() {
          return this.RegisterButton;
        }
        override _handleUp() {
          this._setState("LoginButton");
        }
        override _handleEnter() {
          Router.navigate("signup");
        }
      },
      class PasswordContainer extends this {
        override _getFocused() {
          this.PasswordContainer?.patch({
            shader: {
              type: Lightning.shaders.RoundedRectangle,
              radius: 6,
              stroke: 6,
              strokeColor: COLORS.GREEN_FOCUS,
            },
          });
          if (this.LandscapeKeyboard) {
            this.LandscapeKeyboard.visible = true;
          }
          return this.LandscapeKeyboard;
        }
        override _unfocus() {
          this.PasswordContainer?.patch({
            shader: {
              type: Lightning.shaders.RoundedRectangle,
              radius: 10,
              stroke: 3,
              strokeColor: COLORS.GREY_LIGHT,
            },
          });
          if (this.LandscapeKeyboard) {
            this.LandscapeKeyboard.visible = false;
          }
        }
        override _handleUp() {
          this._unfocus();
          this._setState("EmailContainer");
        }
        override _handleDown() {
          this._unfocus();
          this._setState("LoginButton");
        }
      },
      class EmailContainer extends this {
        override _getFocused() {
          this.EmailContainer?.patch({
            shader: {
              type: Lightning.shaders.RoundedRectangle,
              radius: 6,
              stroke: 6,
              strokeColor: COLORS.GREEN_FOCUS,
            },
          });
          if (this.LandscapeKeyboard) {
            this.LandscapeKeyboard.visible = true;
          }
          return this.LandscapeKeyboard;
        }
        override _unfocus() {
          this.EmailContainer?.patch({
            shader: {
              type: Lightning.shaders.RoundedRectangle,
              radius: 10,
              stroke: 3,
              strokeColor: COLORS.GREY_LIGHT,
            },
          });
          if (this.LandscapeKeyboard) {
            this.LandscapeKeyboard.visible = false;
          }
        }
        override _handleDown() {
          this._unfocus();
          this._setState("PasswordContainer");
        }
      },
      class LandscapeKeyboard extends this {
        override _getFocused() {
          return this.LandscapeKeyboard;
        }
        override _handleUp() {
          this._setState("RegisterButton");
        }
      },
    ];
  }
}
