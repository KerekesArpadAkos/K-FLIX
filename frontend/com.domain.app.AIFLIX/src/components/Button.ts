import { Lightning } from "@lightningjs/sdk";
import { COLORS } from "../../static/constants/Colors";

interface ButtonTemplateSpec extends Lightning.Component.TemplateSpec {
  Text: object;
}

interface ButtonProps {
  buttonText: string;
  textX: number | ((parentWidth: number) => number);
  textY: number | ((parentHeight: number) => number);
  fontSize: number;
  backgroundColor: number;
  textColor: number;
}

export class Button
  extends Lightning.Component<ButtonTemplateSpec & ButtonProps>
  implements Lightning.Component.ImplementTemplateSpec<ButtonTemplateSpec>
{
  static override _template(): Lightning.Component.Template<
    ButtonTemplateSpec & ButtonProps
  > {
    return {
      w: 120,
      h: 50,
      rect: true,
      color: this.bindProp("backgroundColor"),
      Text: {
        x: this.bindProp("textX"),
        y: this.bindProp("textY"),
        mount: 0.5,
        text: {
          text: this.bindProp("buttonText"),
          fontSize: this.bindProp("fontSize"),
          textColor: this.bindProp("textColor"),
          textAlign: "center",
          fontStyle: "bold",
        },
      },
    };
  }

  override _focus() {
    this.patch({
      color: COLORS.BLACK,
      shader: {
        type: Lightning.shaders.RoundedRectangle,
        radius: 4,
        stroke: 2,
        strokeColor: COLORS.GREEN_FOCUS,
      },
      Text: {
        shader: null,
        text: {
          textColor: COLORS.GREEN_FOCUS,
        },
      },
    });
  }

  override _unfocus() {
    this.patch({
      color: COLORS.GREEN_FOCUS,
      shader: null,
      Text: {
        shader: null,
        text: {
          textColor: COLORS.GREEN_FOCUS,
        },
      },
    });
  }
}

export class PlayerUIButton extends Button {
  override _focus() {
    this.patch({
      color: COLORS.WHITE,
      shader: {
        type: Lightning.shaders.RoundedRectangle,
        radius: 10,
        stroke: 5,
        strokeColor: COLORS.GREEN_FOCUS,
      },
    });
  }

  override _unfocus() {
    this.patch({
      color: COLORS.GREY_LIGHT,
      shader: null,
    });
  }
}
