import { Lightning, Router } from "@lightningjs/sdk";
import { SettingsColumn } from "../components/SettingsColumn";
import { SettingsButton } from "../components/SettingsButton";
import { SCREEN_SIZES } from "../../static/constants/ScreenSizes";
import { COLORS } from "../../static/constants/Colors";
import {
  PARCON_OPTIONS,
  LANGUAGE_OPTIONS,
} from "../../static/constants/SettingsOptions";
import eventBus from "../components/EventBus";
import PinOverlay from "../components/PinOverlay";
import { KEYS } from "../../static/constants/Keys";
import { getPressedKey } from "../../static/constants/Keys";
import { Sidebar } from "../components/Sidebar";
import Topbar from "src/components/Topbar";
interface SettingsPageTemplateSpec extends Lightning.Component.TemplateSpec {
  Topbar: typeof Topbar;
  Content: {
    MainColumn: {
      LanguageButton: typeof SettingsButton;
      ParconButton: typeof SettingsButton;
    };
    OptionsColumn: {
      LanguageOptions: typeof SettingsColumn;
      ParconOptions: typeof SettingsColumn;
    };
    PinOverlay: typeof PinOverlay;
    Sidebar: typeof Sidebar;
  };
}

export default class SettingsPage
  extends Lightning.Component<SettingsPageTemplateSpec>
  implements
    Lightning.Component.ImplementTemplateSpec<SettingsPageTemplateSpec>
{
  buttonIndex = 0;

  static override _template() {
    return {
      w: SCREEN_SIZES.WIDTH,
      h: SCREEN_SIZES.HEIGHT,
      color: COLORS.BACKGROUND,
      rect: true,
      Topbar: {
        type: Topbar,
      },
      Content: {
        MainColumn: {
          LanguageButton: {
            y: 187,
            type: SettingsButton,
            ref: "LANG",
            buttonText: "Languages",
            signals: {
              toggleLanguages: true,
              toggleParcon: true,
            },
          },
          ParconButton: {
            y: 307,
            type: SettingsButton,
            ref: "PARCON",
            buttonText: "Parental Control & PIN",
            signals: {
              toggleLanguages: true,
              toggleParcon: true,
              showPinOverlayForParcon: true,
            },
          },
        },
        OptionsColumn: {
          LanguageOptions: {
            visible: false,
            x: 1090,
            y: 187,
            type: SettingsColumn,
          },
          ParconOptions: {
            visible: false,
            x: 1090,
            y: 187,
            type: SettingsColumn,
          },
        },

        PinOverlay: {
          type: PinOverlay,
          visible: false,
          signals: {
            focusSettingsPageParconButton: true,
          },
        },
      },
    };
  }

  get Topbar() {
    return this.tag("Topbar");
  }
  get Content() {
    return this.getByRef("Content")!;
  }

  get MainColumn() {
    return this.Content.tag("MainColumn")!;
  }

  get LanguageButton() {
    return this.MainColumn.tag("LanguageButton")!;
  }

  get ParconButton() {
    return this.MainColumn.tag("ParconButton")!;
  }

  get OptionsColumn() {
    return this.Content.tag("OptionsColumn")!;
  }

  get LanguageOptions() {
    return this.OptionsColumn.tag("LanguageOptions")!;
  }

  get ParconOptions() {
    return this.OptionsColumn.tag("ParconOptions")!;
  }

  get PinOverlay() {
    return this.Content.tag("PinOverlay")!;
  }

  toggleLanguages(visible: boolean) {
    this.LanguageOptions.patch({ visible });
  }

  toggleParcon(visible: boolean) {
    this.ParconOptions.patch({ visible });
  }

  updateLanguages() {
    this.LanguageOptions.items = [...LANGUAGE_OPTIONS];
  }

  updateParcon() {
    this.ParconOptions.items = [...PARCON_OPTIONS];
  }

  getOptionIndexByRef(
    options: { label: string; ref: string }[],
    ref: string
  ): number {
    return options.findIndex((option) => option.ref === ref);
  }

  focusSettingsPageLanguagesButton() {
    this.buttonIndex = 0;
    this._setState("MainColumn");
  }

  setInitialFocus() {
    this.buttonIndex = 0;
    this._setState("MainColumn");
  }

  override _init() {
    if (!localStorage.getItem("lang")) {
      localStorage.setItem("lang", "EN");
    }
    if (!localStorage.getItem("parcon")) {
      localStorage.setItem("parcon", "OFF");
    }

    eventBus.on("showPinOverlayForParcon", (event: CustomEvent) =>
      this.showPinOverlayForParcon(event)
    );
    eventBus.on("focusMainColumn", () => this._setState("MainColumn"));
  }

  override _active() {
    this.updateLanguages();
    this.updateParcon();
    this.setInitialFocus();
  }

  override _enable() {
    if (this.PinOverlay.visible) {
      this.PinOverlay.patch({
        visible: false,
      });
    }

    Router.focusPage();
  }
  showPinOverlayForParcon(event: CustomEvent) {
    if (!event.detail) {
      console.error("Event detail is undefined");
      return;
    }

    this.PinOverlay.patch({
      visible: true,
      zIndex: 2,
    });

    this.PinOverlay.showPinOverlayForParcon(event);
    this._setState("PinOverlayFocus");
  }

  override _handleBack() {
    Router.navigate("home");
    this._setState("MainColumn");
    eventBus.emit("setStateOnDetailButton", {});
  }

  override _handleKey(event: { keyCode: number }) {
    const key = getPressedKey(event.keyCode);

    if (key === undefined) {
      return;
    }

    switch (key) {
      case KEYS.VK_BACK:
        this._handleBack();
        break;
      case KEYS.VK_LEFT:
        this._setState("MainColumn");
        break;
    }
  }

  static override _states() {
    return [
      class MainColumn extends this {
        override _getFocused(): SettingsButton {
          return this.MainColumn.children[this.buttonIndex] as SettingsButton;
        }

        override _handleKey(event: { keyCode: number }) {
          const key = getPressedKey(event.keyCode);

          if (key === undefined) {
            return;
          }

          switch (key) {
            case KEYS.VK_BACK:
              this._handleBack();
              break;
            case KEYS.VK_UP:
              if (this.buttonIndex === 0) {
                this._setState("TopbarFocus"); // Move focus to Topbar
              } else {
                this.buttonIndex--;
              }
              break;
            case KEYS.VK_DOWN:
              if (this.buttonIndex < this.MainColumn.children.length - 1) {
                this.buttonIndex++;
              }
              break;
            case KEYS.VK_RIGHT:
              if (this.buttonIndex === 0) {
                // Right key on LanguageButton
                this._setState("LanguageOptions");
                this.toggleLanguages(true);
                this.toggleParcon(false);
              } else if (this.buttonIndex === 1) {
                // Right key on ParconButton
                this._setState("ParconOptions");
                this.toggleLanguages(false);
                this.toggleParcon(true);
              }
              break;
            case KEYS.VK_LEFT:
              Router.focusWidget("Sidebar");
              break;
          }
        }
      },
      class TopbarFocus extends this {
        override _getFocused() {
          return this.Topbar;
        }

        override _handleEnter() {
          this._handleBack();
        }

        override _handleKey(event: { keyCode: number }) {
          const key = getPressedKey(event.keyCode);
          if (key === KEYS.VK_DOWN) {
            this.buttonIndex = 0; // Focus back on LanguageButton
            this._setState("MainColumn");
          }
        }

        override _focus() {
          this.Topbar!.tag("TopBarComponent.Button")?.patch({
            color: COLORS.BLUE_FOCUS,
          });
        }

        override _unfocus() {
          this.Topbar!.tag("TopBarComponent.Button")?.patch({
            color: COLORS.WHITE,
          });
        }
      },
      class LanguageOptions extends this {
        override _getFocused(): SettingsColumn {
          return this.LanguageOptions;
        }
      },
      class ParconOptions extends this {
        override _getFocused(): SettingsColumn {
          return this.ParconOptions;
        }
      },
      class PinOverlayFocus extends this {
        override _getFocused(): PinOverlay {
          return this.PinOverlay;
        }

        override _handleBack() {
          this.PinOverlay.hidePinOverlay();
        }

        override _handleEnter() {
          this.PinOverlay._handleEnter();
        }
      },
      class ParconButton extends this {
        override _getFocused(): SettingsButton {
          return this.ParconButton;
        }
      },
      class LanguageButton extends this {
        override _getFocused(): SettingsButton {
          return this.LanguageButton;
        }
      },
    ];
  }
}
