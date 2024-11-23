import { Lightning, Utils } from "@lightningjs/sdk";
import { COLORS } from "../../static/constants/Colors";
import { Input } from "@lightningjs/ui-components";
import eventBus from "./EventBus";
import { text } from "stream/consumers";

interface NameInputTemplateSpec extends Lightning.Component.TemplateSpec {
  Content: {
    InputField: object;
  };
}

export default class NameInput
  extends Lightning.Component<NameInputTemplateSpec>
  implements Lightning.Component.ImplementTemplateSpec<NameInputTemplateSpec>
{
  private _inputText = "";

  static override _template() {
    return {
      rect: true,
      w: 229, 
      h: 55,
      color: COLORS.GREY_DARK,
      shader: {
        type: Lightning.shaders.RoundedRectangle,
        radius: 20,
      },
      Content: {
        w: 229,
        h: 55,
        rect: true,
        color: COLORS.GREY_DARK,

        InputField: {
          x: 5.5,
          y: 11.5,
          type: Input,
          w: 218,
          h: 32,
          rect: true,
          text: {
            text: "Enter Name...",
            fontSize: 25,
            textColor: COLORS.WHITE,
            textAlign: "center",
          },
        },
      },
    };
  }

  override _init() {
    eventBus.on("inputTextUpdateOnProfileOverlay", (event: CustomEvent) => {
      const input = event.detail as string;
      if (input === "BACK") {
        this._inputText = this._inputText.slice(0, -1);
      } else if (input === "ENTER") {
        this._triggerSave();
      } else {
        this._inputText += input;
      }
      this._updateInputField();
    });
  }

  private _updateInputField() {
    this.patch({
      Content: {
        InputField: {
          text: { text: this._inputText },
        },
      },
    });
  }

  public setText(text: string) {
    this._inputText = text;
    this._updateInputField();
  }

  private _triggerSave() {
    this.signal("saveName", this._inputText);
  }

  set inputText(value: string) {
    this._inputText = value;
    this._updateInputField();
  }

  get inputText() {
    return this._inputText;
  }
}
