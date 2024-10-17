import { Lightning, Router, Utils } from "@lightningjs/sdk";
import { COLORS } from "../../static/constants/Colors";
import { SCREEN_SIZES } from "../../static/constants/ScreenSizes";
import { SidebarButton } from "./SidebarButton";
import {VerticalList} from "../components/VerticalList"

const homeIconFontSize = 70;
const settingsIconFontSize = 50;

const homeIconTextY = 25;
const settingsIconTextY = 30;
const defaultTextY = 34;

const defaultAnimationDuration = 0.8;

interface SidebarTemplateSpec extends Lightning.Component.TemplateSpec {
  SearchButton: typeof SidebarButton;
  HomeButton: typeof SidebarButton;
  MoviesButton: typeof SidebarButton;
  SeriesButton: typeof SidebarButton;
  SettingsButton: typeof SidebarButton;
}

export class Sidebar
  extends Lightning.Component<SidebarTemplateSpec>
  implements Lightning.Component.ImplementTemplateSpec<SidebarTemplateSpec>
{
  static override _template(): Lightning.Component.Template<SidebarTemplateSpec> {
    return {
      w: SCREEN_SIZES.SIDEBAR_WIDTH_CLOSED,
      h: SCREEN_SIZES.HEIGHT,
      rect: true,
      color: COLORS.BLACK,
      shader: { type: Lightning.shaders.FadeOut, right: 0 },
      zIndex: 2,
      HomeButton: {
        type: SidebarButton,
        fontSize: SCREEN_SIZES.DEFAULT_BTN_FONT_SIZE,
        src: Utils.asset("images/home.png"),
        x: 35,
        y: 390,
        textX: 144,
        textY: 34,
        zIndex: 4,
      },
      SettingsButton: {
        type: SidebarButton,
        fontSize: SCREEN_SIZES.DEFAULT_BTN_FONT_SIZE,
        src: Utils.asset("images/settings.png"),
        x: 35,
        y: 699,
        textX: 144,
        textY: 34,
        zIndex: 4,
      },
      SearchButton: {
        type: SidebarButton,
        fontSize: SCREEN_SIZES.DEFAULT_BTN_FONT_SIZE,
        src: Utils.asset("images/search.png"),
        x: 35,
        y: 287,
        textX: 144,
        textY: 34,
        zIndex: 4,
      },
      MoviesButton: {
        type: SidebarButton,
        fontSize: SCREEN_SIZES.DEFAULT_BTN_FONT_SIZE,
        src: Utils.asset("images/movies.png"),
        x: 35,
        y: 493,
        textX: 144,
        textY: 34,
        zIndex: 4,
      },
      SeriesButton: {
        type: SidebarButton,
        fontSize: SCREEN_SIZES.DEFAULT_BTN_FONT_SIZE,
        src: Utils.asset("images/series.png"),
        x: 35,
        y: 596,
        textX: 144,
        textY: 34,
        zIndex: 4,
      },
    
    };
  }

  get HomeButton() {
    return this.getByRef("HomeButton");
  }

  get SettingsButton() {
    return this.getByRef("SettingsButton");
  }

  get SearchButton() {
    return this.getByRef("SearchButton");
  }

  get MoviesButton() {  
    return this.getByRef("MoviesButton");
  }

  get SeriesButton() {  
    return this.getByRef("SeriesButton");
  }

  override _getFocused() {
    this._setState("HomeButton");
    this._setState("SettingsButton");
    this._setState("HomeButton");
    this._setState("MoviesButton");
    this._setState("SeriesButton");
    this._setState("SearchButton");

    return this.SearchButton;
  }

  override _handleRight() {
    Router.focusPage();
  }

  override _enable() {
    this.unfocusPatch();
  }

  static override _states() {
    return [
      class HomeButton extends this {
        override _getFocused() {
          return this.HomeButton;
        }

        override _handleDown() {
          this._setState("MoviesButton");
        }

        override _handleUp() {
          this._setState("SearchButton");
        }

        override _handleLeft() {
          return;
        }

        override _handleEnter() {
          Router.navigate("Home");
        }
      },
      class SettingsButton extends this {
        override _getFocused() {
          return this.SettingsButton;
        }

        override _handleUp() {
          this._setState("SeriesButton");
        }

        override _handleDown() {
          return;
        }

        override _handleLeft() {
          return;
        }

        override _handleEnter() {
          Router.navigate("settings");
        }
      },
      class SearchButton extends this {
        override _getFocused() {
          return this.SearchButton;
        }

        override _handleUp() {
          return;
        }

        override _handleLeft() {
          return;
        }

        override _handleDown() {
          this._setState("HomeButton");
        }

        override _handleEnter() {
          Router.navigate("search");
        }
      },
      class MoviesButton extends this {
        override _getFocused() {
          return this.MoviesButton;
        }

        override _handleUp() {
          this._setState("HomeButton");
        }

        override _handleDown() {
          this._setState("SeriesButton");
        }

        override _handleLeft() {
          return;
        }
      },
        class SeriesButton extends this {
          override _getFocused() {
            return this.SeriesButton;
          }
  
          override _handleUp() {
            this._setState("MoviesButton");
          }
  
          override _handleDown() {
            this._setState("SettingsButton");
          }
  
          override _handleLeft() {
            return;
          }
      } 
    ];
  }

  createButtonAnimationForFocus(button: Lightning.Component | undefined) {
    return button?.animation({
      duration: defaultAnimationDuration,
      repeat: 0,
      actions: [
        {
          p: "w",
          v: {
            0: SCREEN_SIZES.SIDEBAR_WIDTH_CLOSED,
            1: SCREEN_SIZES.SIDEBAR_WIDTH_CLOSED,
          },
        },
        {
          p: "textX",
          v: { 0: -90, 1: 250 },
        },
        {
          p: "imageX",
          v: { 0: -90, 1: 110 },
        },
        {
          p: "alpha",
          v: { 0: 0, 1: 1 },
        },
        {
          p: "zIndex",
          v: { 0: 0, 1: 4 },
        },
      ],
    });
  }

  override _focus() {
   
    // const homeButtonAnimation = this.createButtonAnimationForFocus(this.HomeButton);
    // const settingsButtonAnimation = this.createButtonAnimationForFocus(this.SettingsButton);
    // const searchButtonAnimation = this.createButtonAnimationForFocus(this.SearchButton);

    this.focusPatch();

    // settingsButtonAnimation?.start();
    // searchButtonAnimation?.start();
    // homeButtonAnimation?.start();
  }

  createButtonAnimationForUnfocus(button: Lightning.Component | undefined) {
    return button?.animation({
      duration: defaultAnimationDuration,
      repeat: 0,
      actions: [
        {
          p: "w",
          v: {
            0: SCREEN_SIZES.SIDEBAR_WIDTH_OPEN,
            1: SCREEN_SIZES.SIDEBAR_WIDTH_CLOSED,
          },
        },
        {
          p: "textX",
          v: { 0: 250, 1: 40 },
        },
        {
          p: "imageX",
          v: { 0: 110, 1: 0 },
        },
        {
          p: "alpha",
          v: { 0: 0, 1: 1 },
        },
      ],
    });
  }

  override _unfocus() {
    this.unfocusPatch();
  }

  unfocusPatch() {
    console.log("Unfocusing sidebar");
    this.patch({
      w: SCREEN_SIZES.SIDEBAR_WIDTH_CLOSED,
      color: COLORS.BLACK,
    });
    this.HomeButton?.patch({
      src: Utils.asset("images/home.png"),
      h: SCREEN_SIZES.SIDEBAR_ICON_H,
      w: SCREEN_SIZES.SIDEBAR_ICON_W,
      buttonText: "",
      fontSize: homeIconFontSize,
      textY: homeIconTextY,
      textColor: COLORS.GREY_LIGHT,
      iconColor: COLORS.GREY_LIGHT,
      backgroundColor: COLORS.TRANSPARENT,
      alpha: 1,
      zIndex: 4,
    });
    this.SettingsButton?.patch({
      src: Utils.asset("images/settings.png"),
      h: SCREEN_SIZES.SIDEBAR_ICON_H,
      w: SCREEN_SIZES.SIDEBAR_ICON_W,
      buttonText: "",
      fontSize: settingsIconFontSize,
      textY: settingsIconTextY,
      textColor: COLORS.GREY_LIGHT,
      iconColor: COLORS.GREY_LIGHT,
      backgroundColor: COLORS.TRANSPARENT,
      alpha: 1,
      zIndex: 4,
    });
    this.SearchButton?.patch({
      src: Utils.asset("images/search.png"),
      h: SCREEN_SIZES.SIDEBAR_ICON_H,
      w: SCREEN_SIZES.SIDEBAR_ICON_W,
      buttonText: "",
      fontSize: SCREEN_SIZES.DEFAULT_BTN_FONT_SIZE,
      textY: defaultTextY,
      textColor: COLORS.GREY_LIGHT,
      iconColor: COLORS.GREY_LIGHT,
      backgroundColor: COLORS.TRANSPARENT,
      alpha: 1,
      zIndex: 4,
    });
    this.MoviesButton?.patch({
      src: Utils.asset("images/movies.png"),
      h: SCREEN_SIZES.SIDEBAR_ICON_H,
      w: SCREEN_SIZES.SIDEBAR_ICON_W,
      buttonText: "",
      fontSize: SCREEN_SIZES.DEFAULT_BTN_FONT_SIZE,
      textY: defaultTextY,
      textColor: COLORS.GREY_LIGHT,
      iconColor: COLORS.GREY_LIGHT,
      backgroundColor: COLORS.TRANSPARENT,
      alpha: 1,
      zIndex: 4,
    });
    this.SeriesButton?.patch({
      src: Utils.asset("images/series.png"),
      h: SCREEN_SIZES.SIDEBAR_ICON_H,
      w: SCREEN_SIZES.SIDEBAR_ICON_W,
      buttonText: "",
      fontSize: SCREEN_SIZES.DEFAULT_BTN_FONT_SIZE,
      textY: defaultTextY,
      textColor: COLORS.GREY_LIGHT,
      iconColor: COLORS.GREY_LIGHT,
      backgroundColor: COLORS.TRANSPARENT,
      alpha: 1,
      zIndex: 4,
    })
  }

  focusPatch() {
    console.log("Focusing sidebar");
    this.patch({
      w: SCREEN_SIZES.SIDEBAR_WIDTH_OPEN,
      color: COLORS.BLACK,
    });
    this.HomeButton?.patch({
      src: Utils.asset("images/home.png"),
      h: 100,
      buttonText: "Home",
      w: SCREEN_SIZES.SIDEBAR_WIDTH_OPEN,
      fontSize: SCREEN_SIZES.DEFAULT_BTN_FONT_SIZE,
      zIndex: 4,
      alpha: 1,
    });
    this.SettingsButton?.patch({
      src: Utils.asset("images/settings.png"),
      h: 100,
      buttonText: "Settings",
      w: SCREEN_SIZES.SIDEBAR_WIDTH_OPEN,
      fontSize: SCREEN_SIZES.DEFAULT_BTN_FONT_SIZE,
      zIndex: 4,
      alpha: 1,
    });
    this.MoviesButton?.patch({
      src: Utils.asset("images/movies.png"),
      h: 100,
      buttonText: "Movies",
      w: SCREEN_SIZES.SIDEBAR_WIDTH_OPEN,
      fontSize: SCREEN_SIZES.DEFAULT_BTN_FONT_SIZE,
      zIndex: 4,
      alpha: 1,
    });
    this.SeriesButton?.patch({
      src: Utils.asset("images/series.png"),
      h: 100,
      buttonText: "Series",
      w: SCREEN_SIZES.SIDEBAR_WIDTH_OPEN,
      fontSize: SCREEN_SIZES.DEFAULT_BTN_FONT_SIZE,
      zIndex: 4,
      alpha: 1,
    });
    this.SearchButton?.patch({
      src: Utils.asset("images/search.png"),
      h: 100,
      buttonText: "Search",
      w: SCREEN_SIZES.SIDEBAR_WIDTH_OPEN,
      fontSize: SCREEN_SIZES.DEFAULT_BTN_FONT_SIZE,
      zIndex: 4,
      alpha: 1,
    });
  }
}
