import { Lightning, Router } from "@lightningjs/sdk";
import { Button } from "src/components/Button";
import { COLORS } from "static/constants/Colors";
import { SCREEN_SIZES } from "static/constants/ScreenSizes";

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
    };
  }
}
