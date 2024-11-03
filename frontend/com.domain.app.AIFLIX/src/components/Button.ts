import { Lightning } from "@lightningjs/sdk";
import { COLORS } from "../../static/constants/Colors";

interface ButtonTemplateSpec extends Lightning.Component.TemplateSpec {
  Background: { Text: object };
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
      Background: {
        w: this.bindProp("w"), // Bind width dynamically
        h: this.bindProp("h"), // Bind height dynamically
        rect: true,
        color: this.bindProp("backgroundColor"),
        shader: {
          type: Lightning.shaders.RoundedRectangle,
          radius: 6,
          stroke: 0, // Start without stroke
        },
        Text: {
          x: (w) => w / 2, // Center horizontally
          y: (h) => h / 2 + 2, // Center vertically
          mount: 0.5,
          text: {
            text: this.bindProp("buttonText"),
            fontSize: this.bindProp("fontSize"),
            textColor: this.bindProp("textColor"),
            textAlign: "center",
            fontStyle: "bold",
          },
          shader: {
            type: Lightning.shaders.RoundedRectangle,
            radius: 0,
            stroke: 0,
          },
        },
      },
    };
  }

  override _focus() {
    this.tag("Background")?.patch({
      shader: {
        type: Lightning.shaders.RoundedRectangle,
        radius: 6,
        stroke: 6,
        strokeColor: COLORS.GREEN_FOCUS,
      },
    });
  }

  override _unfocus() {
    this.tag("Background")?.patch({
      shader: {
        type: Lightning.shaders.RoundedRectangle,
        radius: 6,
        stroke: 0, // Remove stroke on unfocus
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
