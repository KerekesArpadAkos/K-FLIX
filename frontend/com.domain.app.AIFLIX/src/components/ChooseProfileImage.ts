import { Lightning, Router } from "@lightningjs/sdk";
import { Button } from "./Button";
import { COLORS } from "../../static/constants/Colors";
import { SCREEN_SIZES } from "../../static/constants/ScreenSizes";

interface ChooseProfileImageTemplateSpec extends Lightning.Component.TemplateSpec {
    ChooseProfileMessage: object;
    ConfirmButton: typeof Button;
    CancelButton: typeof Button;
}

export class ChooseProfileImage
  extends Lightning.Component<ChooseProfileImageTemplateSpec>
  implements Lightning.Component.ImplementTemplateSpec<ChooseProfileImageTemplateSpec>
{
  private _userId: string | null = null;
  static override _template(): Lightning.Component.Template<ChooseProfileImageTemplateSpec> {
    return {
        color: COLORS.BACKGROUND,
        rect: true,
        w: SCREEN_SIZES.WIDTH,
        h: SCREEN_SIZES.HEIGHT,
        ChooseProfileMessage: {
          x: 298,
          y: 288,
          w: 1323,
          h: 224,
          text: {
            text: "Would you like to generate a profile image with AI?",
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
          buttonText: "Yes",
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
          buttonText: "No",
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
  
    override set params(params: { userId: string }) {
      this._userId = params.userId || null;
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
            Router.navigate(`chooseavatar/${this._userId}`);
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
            Router.navigate(`profile/${this._userId}`);
          }
        },
      ];
    }
}

