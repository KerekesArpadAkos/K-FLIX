import { Colors, Lightning, Utils } from "@lightningjs/sdk";
import { COLORS } from "../../static/constants/Colors";
import { SCREEN_SIZES } from "../../static/constants/ScreenSizes";
import { Input } from "@lightningjs/ui-components";
import eventBus from "./EventBus";

interface SearchInputTemplateSpec extends Lightning.Component.TemplateSpec {
  Content: {
    InputField: object;
    SearchButton: object;
    SearchImage: object;
  };
}

export default class SearchInput
  extends Lightning.Component<SearchInputTemplateSpec>
  implements Lightning.Component.ImplementTemplateSpec<SearchInputTemplateSpec>
{
  private _inputText = "";

  static override _template() {
    return {
      rect: true,
      w: 1606,
      h: 55,
      color: COLORS.GREY_DARK,
      shader: {
        type: Lightning.shaders.RoundedRectangle,
        radius: 15,
        stroke: 2,
      },
      Content: {
        SearchImage: {
          x: 10,
          y: 30,
          mountY: 0.5,
          w: 40,
          h: 40,
          src: Utils.asset("images/search.png"),
          shader: {
            type: Lightning.shaders.RoundedRectangle,
            strokeColor: COLORS.BLACK,
          },
        },
        InputField: {
          x: 60,
          y: 30,
          mountY: 0.5,
          type: Input,
          w: 1546,
          h: 55,
          text: {
            text: "Enter title here...",
            fontSize: 44,
            textColor: COLORS.WHITE,
          },
          shader: {
            type: Lightning.shaders.RoundedRectangle,
            strokeColor: COLORS.BLACK,
            radius: [0, 15, 15, 0],
          },
        },
      },
    };
  }
  get Content() {
    return this.getByRef("Content");
  }

  get InputField() {
    return this.Content?.tag("InputField");
  }

  set inputText(value: string) {
    this._inputText = value;
    this.InputField?.patch({
      text: { text: this._inputText },
    });
  }

  get inputText() {
    return this._inputText;
  }

  override _handleKey(event: KeyboardEvent) {
    if (event.key.length === 1) {
      this.inputText += event.key;
    } else if (event.key === "Backspace") {
      this.inputText = this.inputText.slice(0, -1);
    }
  }

  override _handleEnter() {
    this.signal("search", this.inputText);
  }

  override _handleDown() {
    // this.signal("focusList");
    eventBus.emit("focusDefaultKeyboard");
  }

  override _handleLeft() {
    this.signal("focusSidebar");
  }

  get inputValue() {
    return this.inputText;
  }

  override _focus() {
    console.log("Focused on InputField"); // Debugging for focus tracking
    this.InputField?.patch({
      color: COLORS.GREEN_FOCUS,
    });
  }

  override _unfocus() {
    this.InputField?.patch({
      color: COLORS.GREY_DARK,
    });
  }
}
