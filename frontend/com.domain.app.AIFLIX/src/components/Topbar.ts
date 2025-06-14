import { Lightning, Router, Utils } from "@lightningjs/sdk";
import { COLORS } from "static/constants/Colors";
import eventBus from "./EventBus";

interface TopbarTemplateSpec extends Lightning.Component.TemplateSpec {
  TopBarComponent: {
    Button: Lightning.Component;
    Label: object;
    CurrentTime: object;
  };
}

export default class Topbar
  extends Lightning.Component<TopbarTemplateSpec>
  implements Lightning.Component.ImplementTemplateSpec<TopbarTemplateSpec>
{
  private _timeInterval: ReturnType<typeof setInterval> | null = null;

  static override _template() {
    const topBarHeight = 89;
    const centeredY = topBarHeight / 2;

    return {
      TopBarComponent: {
        w: 1591,
        h: topBarHeight,
        rect: true,
        color: COLORS.BACKGROUND,
        x: 199,
        y: 58,
        Button: {
          type: Lightning.Component,
          src: Utils.asset("images/backButton.png"),
          w: 52,
          h: 52,
          y: centeredY - 26,
        },
        Label: {
          text: {
            text: "",
            fontSize: 50,
            textColor: COLORS.WHITE,
            fontFace: "NetflixSans-Light",
          },
          x: 75,
          // w: 219,
          // h: 80,
          y: centeredY - 31,
        },
        CurrentTime: {
          text: {
            text: "",
            fontSize: 50,
            textColor: COLORS.WHITE,
            fontFace: "NetflixSans-Light",
          },
          x: 1372,
          y: centeredY - 31,
        },
      },
    };
  }

  override _init() {
    eventBus.on("focusBackButton", () => {
      //focus on the back button
      this._focus();
      this._refocus();
    });
  }
  set props(props: { title: string }) {
    const { title } = props;
    this.patch({ TopBarComponent: { Label: { text: { text: title } } } });
  }

  getCurrentTime(): string {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  get CurrentTime() {
    const topBarComponent = this.tag("TopBarComponent");
    return topBarComponent ? topBarComponent.tag("CurrentTime") : undefined; // Updated for consistent tag referencing
  }

  updateTime() {
    if (this.CurrentTime) {
      this.CurrentTime.patch({
        text: { text: this.getCurrentTime() }, // Update text directly
      });
    }
  }

  override _enable() {
    this.updateTime(); // Initial time update
    this._timeInterval = setInterval(() => {
      this.updateTime();
    }, 60000); // Update every 1 minute
  }

  override _disable() {
    if (this._timeInterval) {
      clearInterval(this._timeInterval);
      this._timeInterval = null;
    }
  }
  override _handleEnter() {
    Router.back();
  }
  override _active() {
    this._unfocus();
  }
  override _handleDown() {
    eventBus.emit("focusMainColumn");
    eventBus.emit("focusDefaultKeyboard");
  }
  override _getFocused(): Lightning.Component | undefined {
    return this.tag("TopBarComponent.Button") as Lightning.Component;
  }
  override _focus() {
    this.tag("TopBarComponent.Button")?.patch({ color: COLORS.BLUE_FOCUS });
  }

  override _unfocus() {
    this.tag("TopBarComponent.Button")?.patch({ color: COLORS.WHITE });
  }
  getFocused() {
    return this.tag("TopBarComponent.Button");
  }
}
