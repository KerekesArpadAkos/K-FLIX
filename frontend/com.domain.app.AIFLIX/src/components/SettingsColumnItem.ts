import { Lightning, Utils } from "@lightningjs/sdk";
import { COLORS } from "../../static/constants/Colors";
import eventBus from "./EventBus";

interface SettingsColumnItemTemplateSpec
  extends Lightning.Component.TemplateSpec {
  Label: typeof Text;
  SelectedIcon: object;
}

export default class SettingsColumnItem
  extends Lightning.Component<SettingsColumnItemTemplateSpec>
  implements
    Lightning.Component.ImplementTemplateSpec<SettingsColumnItemTemplateSpec>
{
  item: { label: string; ref: string } | undefined;
  selected: boolean = false;

  static override _template() {
    return {
      rect: true,
      w: 700,
      h: 100,
      color: COLORS.BLACK,
      Label: {
        x: 25,
        text: {
          fontSize: 40,
          fontStyle: "normal",
          fontFace: "system-ui",
        },
      },
      SelectedIcon: {
        src: Utils.asset("images/selectedItem.png"),
        w: 30,
        h: 30,
        x: 660,
        y: 35,
        visible: false,
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

    this.tag("SelectedIcon")!.visible = this.selected;
  }

  updateSelectedState(selected: boolean) {
    this.selected = selected;
    this.tag("SelectedIcon")!.visible = selected;
  }

  override _focus() {
    this.patch({
      color: COLORS.BLUE_FOCUS,
    });
  }

  override _unfocus() {
    this.patch({
      color: COLORS.BLACK,
    });
  }

  override _handleEnter() {
    this.signal("itemSelected", this);

    if (this.item?.ref === "CHANGE_PIN" && localStorage.getItem("password")) {
      const storedPin = localStorage.getItem("password");
      if (storedPin) {
        eventBus.emit("showPinOverlayForParcon", {
          promptText: "Enter Previous Pin",
          showAttempts: true,
        });
      }
    } else if (this.item?.ref === "OFF" && localStorage.getItem("password")) {
      eventBus.emit("showPinOverlayForParcon", {
        promptText: "Enter Pin to turn off Parcon",
        showAttempts: true,
      });
    } else if (this.item?.ref === "18" && !localStorage.getItem("password")) {
      eventBus.emit("showPinOverlayForParcon", {
        promptText: "Set Pin",
        showAttempts: false,
      });
    } else if (
      this.item?.ref === "CHANGE_PIN" &&
      !localStorage.getItem("password")
    ) {
      eventBus.emit("showPinOverlayForParcon", {
        promptText: "Set Pin",
        showAttempts: false,
      });
    }
  }
}
