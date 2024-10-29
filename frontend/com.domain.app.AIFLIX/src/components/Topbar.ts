import { Lightning, Router, Utils } from "@lightningjs/sdk";
import { COLORS } from "static/constants/Colors";

interface TopbarTemplateSpec extends Lightning.Component.TemplateSpec {
  TopBarComponent: {
    Button: object;
    SettingsLabel: object;
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
          src: Utils.asset("images/backButton.png"),
          w: 52,
          h: 52,
          y: centeredY - 26,
        },
        SettingsLabel: {
          text: {
            text: "Settings",
            fontSize: 50,
            textColor: COLORS.WHITE,
          },
          x: 75,
          w: 219,
          h: 76,
          y: centeredY - 31,
        },
        CurrentTime: {
          text: {
            text: "",
            fontSize: 50,
            textColor: COLORS.WHITE,
          },
          x: 1372,
          y: centeredY - 30,
        },
      },
    };
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
