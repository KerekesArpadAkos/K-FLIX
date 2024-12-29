import { Lightning, Utils } from "@lightningjs/sdk";
import { COLORS } from "../../static/constants/Colors";
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
      Content: {
        SearchImage: {
          x: 10,
          y: 30,
          mountY: 0.5,
          w: 40,
          h: 40,
          src: Utils.asset("images/search.png"),
        },
        InputField: {
          x: 60,
          type: Input,
          w: 1546,
          h: 55,
          text: {
            text: "Enter title here...",
            fontSize: 44,
            textColor: COLORS.WHITE,
            fontFace: "NetflixSans-Light",
          },
        },
      },
    };
  }

  override _init() {
    eventBus.on("inputTextUpdate", (event: CustomEvent) => {
      const input = event.detail as string;
      if (input === "BACK") {
        this._inputText = this._inputText.slice(0, -1);
      } else if (input === "ENTER") {
        this._triggerSearch();
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

  // Implementing the setText method
  public setText(text: string) {
    this._inputText = text;
    this._updateInputField();
  }

  private _triggerSearch() {
    this.signal("search", this._inputText);
  }

  set inputText(value: string) {
    this._inputText = value;
    this._updateInputField();
  }

  get inputText() {
    return this._inputText;
  }
}
