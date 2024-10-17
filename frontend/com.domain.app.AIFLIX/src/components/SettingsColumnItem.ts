import { Lightning } from "@lightningjs/sdk";
import { COLORS } from "../../static/constants/Colors";
import eventBus from "./EventBus";

interface SettingsColumnItemTemplateSpec extends Lightning.Component.TemplateSpec {
  Label: typeof Text;
}

export default class SettingsColumnItem
  extends Lightning.Component<SettingsColumnItemTemplateSpec>
  implements Lightning.Component.ImplementTemplateSpec<SettingsColumnItemTemplateSpec>
{
  item: { label: string; ref: string } | undefined;

  static override _template() {
    return {
      rect: true,
      w: 280,
      h: 100,
      color: 0x00000000,
      shader: {
        type: Lightning.shaders.Outline,
        width: 2,
        color: COLORS.GREY_LIGHT,
      },
      Label: {
        x: 140,
        y: 50,
        mount: 0.5,
        text: {
          fontSize: 32,
        },
        shader: {
          type: Lightning.shaders.RoundedRectangle,
          strokeColor: 0x00000000,
        },
      },
    };
  }

  get Label() {
    return this.getByRef("Label")!;
  }

  override _init() {
    if (this.item) {
      this.Label.text = this.item.label;
    }
  }

  override _focus() {
    this.patch({
      shader: {
        color: COLORS.GREY_LIGHT,
      },
    });
  }

  override _unfocus() {
    this.patch({
      shader: {
        color: COLORS.GREY_LIGHT,
      },
    });
  }

  changeColorForItemEighteen() {
    const parent = this.parent as any;
    const options = parent.children || [];
    options.forEach((option: any) => {
      if (option.item?.ref === "18") {
        option.patch({
          Label: {
            text: { textColor: COLORS.GREY_LIGHT },
          },
        });
      }
    });
    localStorage.setItem("parcon", '"18"');
  }

  changeColorForItemEighteenToWhite() {
    const parent = this.parent as any;
    const options = parent.children || [];
    options.forEach((option: any) => {
      if (option.item?.ref === "18") {
        option.patch({
          Label: {
            text: { textColor: COLORS.WHITE },
          },
        });
      }
    });
    localStorage.setItem("parcon", '"18"');
  }

  changeColorForItemOFFToWhite() {
    const parent = this.parent as any;
    const options = parent.children || [];
    options.forEach((option: any) => {
      if (option.item?.ref === "OFF") {
        option.patch({
          Label: {
            text: { textColor: COLORS.WHITE },
          },
        });
      }
    });
  }

  changeColorToOrange() {
    this.patch({
      Label: {
        text: { textColor: COLORS.GREY_LIGHT },
      },
    });
  }

  override _handleEnter() {
    this.signal("itemSelected", this.item);

    if (this.item?.ref === "CHANGE_PIN" && localStorage.getItem("password")) {
      const storedPin = localStorage.getItem("password");
      if (storedPin) {
        eventBus.emit("showPinOverlayForParcon", {
          promptText: "Enter Previous Pin",
          showAttempts: true,
        });
        this.changeColorForItemEighteen();
        this.changeColorForItemOFFToWhite();
        eventBus.on("pinCorrect", () => {
          this.changeColorForItemEighteen();
          this.changeColorForItemOFFToWhite();
        });
      }
    } else if (this.item?.ref === "OFF" && localStorage.getItem("password")) {
      eventBus.emit("showPinOverlayForParcon", {
        promptText: "Enter Pin to turn off Parcon",
        showAttempts: true,
      });
      eventBus.on("pinCorrect", () => {
        this.changeColorToOrange();
        this.changeColorForItemEighteenToWhite();
      });
    } else if (this.item?.ref === "18" && !localStorage.getItem("password")) {
      eventBus.emit("showPinOverlayForParcon", {
        promptText: "Set Pin",
        showAttempts: false,
      });
      this.changeColorForItemOFFToWhite();
      this.changeColorToOrange();
    } else if (this.item?.ref === "CHANGE_PIN" && !localStorage.getItem("password")) {
      eventBus.emit("showPinOverlayForParcon", {
        promptText: "Set Pin",
        showAttempts: false,
      });
      this.changeColorForItemOFFToWhite();
      this.changeColorForItemEighteen();
    } else if (
      this.item?.ref === "RO" ||
      this.item?.ref === "HU" ||
      this.item?.ref === "DE" ||
      this.item?.ref === "EN"
    ) {
      this.changeColorToOrange();
    }
  }
}
