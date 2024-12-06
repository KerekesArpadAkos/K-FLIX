import { Lightning, Router } from "@lightningjs/sdk";
import { Button } from "../components/Button";
import { COLORS } from "../../static/constants/Colors";
import { SCREEN_SIZES } from "../../static/constants/ScreenSizes";

interface LogoutPageTemplateSpec extends Lightning.Component.TemplateSpec {
    LogoutMessage: object;
    ConfirmButton: typeof Button;
    CancelButton: typeof Button;
}

export class LogoutPage
  extends Lightning.Component<LogoutPageTemplateSpec>
  implements Lightning.Component.ImplementTemplateSpec<LogoutPageTemplateSpec>
{
  private _previousPageRoute!: string;
  static override _template(): Lightning.Component.Template<LogoutPageTemplateSpec> {
    return {
        color: COLORS.BACKGROUND,
        rect: true,
        w: SCREEN_SIZES.WIDTH,
        h: SCREEN_SIZES.HEIGHT,
        LogoutMessage: {
          x: 298,
          y: 288,
          w: 1323,
          h: 224,
          text: {
            text: "Are you sure you want to log out of your account?",
            fontSize: 80,
            fontFace: "Regular",
            wordWrapWidth: 1323,
            textAlign: "center",
          },
        },
        ConfirmButton: {
          type: Button,
          x: 414,
          y: 712,
          w: 400,
          h: 105,
          buttonText: "Confirm",
          fontSize: 64,
          textColor: COLORS.WHITE,
          backgroundColor: COLORS.RED_BUTTON,
          shader: {
            type: Lightning.shaders.RoundedRectangle,
            radius: 6,
          },
        },
        CancelButton: {
          type: Button,
          x: 1106,
          y: 712,
          w: 400,
          h: 105,
          buttonText: "Cancel",
          fontSize: 64,
          textColor: COLORS.WHITE,
          backgroundColor: COLORS.RED_BUTTON,
          shader: {
            type: Lightning.shaders.RoundedRectangle,
            radius: 6,
          },
        },
      };
    }
  
    override set params(pageRoute: any) {
      this._previousPageRoute = pageRoute.pageRoute;
    }

    get ConfirmButton() {
      return this.tag("ConfirmButton");
    }
  
    get CancelButton() {
      return this.tag("CancelButton");
    }
  
    override _active() {
      this._setState("ConfirmButton");
    }
  
    static override _states() {
      return [
        class ConfirmButton extends this {
          override _getFocused() {
            return this.ConfirmButton;
          }
          override _handleRight() {
            this._setState("CancelButton");
          }
          override _handleEnter() {
            localStorage.removeItem("userId");
            localStorage.removeItem("profileId");
            localStorage.removeItem("profileName");
            localStorage.removeItem("profileImage");
            //and here i also have to remove the token, but first i have to rename the token
            Router.navigate("signin");
          }
        },
        class CancelButton extends this {
          override _getFocused() {
            return this.CancelButton;
          }
          override _handleLeft() {
            this._setState("ConfirmButton");
          }
          override _handleEnter() {
            //here i shall navigate back to that page where i have entered logout button
            Router.navigate(`${this._previousPageRoute}`);
          }
        },
      ];
    }
}

