import { Lightning } from "@lightningjs/sdk";
import { COLORS } from "../../static/constants/Colors";
interface SettingsButtonTemplateSpec extends Lightning.Component.TemplateSpec {
  Label: typeof Text;
}

export class SettingsButton
  extends Lightning.Component<SettingsButtonTemplateSpec>
  implements
    Lightning.Component.ImplementTemplateSpec<SettingsButtonTemplateSpec>
{
  buttonText: string | undefined;

  static override _template(): Lightning.Component.Template<SettingsButtonTemplateSpec> {
    return {
      x: 200,
      w: 700,
      h: 100,
      rect: true,
      color: COLORS.BLACK,
      Label: {
        x: 25,
        text: {
          fontSize: 40,
          fontStyle: "normal",
          fontFace: "system-ui",
        },
      },
    };
  }

  get Label() {
    return this.getByRef("Label")!;
  }
  override _init() {
    this.Label.patch({ text: { text: this.buttonText } });
  }
  override _focus() {
    if (this.ref === "LANG") {
      this.signal("toggleLanguages", 1);
      this.signal("toggleParcon", 0);
    } else if (this.ref === "PARCON") {
      this.signal("toggleParcon", 1);
      this.signal("toggleLanguages", 0);
    }
    this.patch({
      color: COLORS.BLUE_FOCUS,
    });
  }
  override _unfocus() {
    this.patch({
      color: COLORS.BLACK,
    });
  }
}
