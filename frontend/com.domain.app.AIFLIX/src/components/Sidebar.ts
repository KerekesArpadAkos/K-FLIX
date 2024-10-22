import { Lightning, Router, Utils } from "@lightningjs/sdk";
import { COLORS } from "../../static/constants/Colors";
import { SCREEN_SIZES } from "../../static/constants/ScreenSizes";
import { SidebarButton } from "./SidebarButton";

interface SidebarTemplateSpec extends Lightning.Component.TemplateSpec {
  SearchButton: typeof SidebarButton;
  HomeButton: typeof SidebarButton;
  MoviesButton: typeof SidebarButton;
  SeriesButton: typeof SidebarButton;
  SettingsButton: typeof SidebarButton;
  ProfileButton: typeof SidebarButton;
  Image: object;
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
        x: 35,
        y: 390,
        zIndex: 4,
      },
      SettingsButton: {
        type: SidebarButton,
        fontSize: SCREEN_SIZES.DEFAULT_BTN_FONT_SIZE,
        x: 35,
        y: 699,
        textX: 196,
        zIndex: 4,
      },
      SearchButton: {
        type: SidebarButton,
        fontSize: SCREEN_SIZES.DEFAULT_BTN_FONT_SIZE,
        x: 35,
        y: 287,
        zIndex: 4,
      },
      MoviesButton: {
        type: SidebarButton,
        fontSize: SCREEN_SIZES.DEFAULT_BTN_FONT_SIZE,
        x: 35,
        y: 493,
        zIndex: 4,
      },
      SeriesButton: {
        type: SidebarButton,
        fontSize: SCREEN_SIZES.DEFAULT_BTN_FONT_SIZE,
        x: 35,
        y: 596,
        zIndex: 4,
      },
      ProfileButton: {
        type: SidebarButton,
        fontSize: SCREEN_SIZES.DEFAULT_BTN_FONT_SIZE,
        x: 35,
        y: 65,
        zIndex: 4,
        textX:111,
        textY:42,
        src: Utils.asset("images/guest.png"),
      },
      Image:{
        src: Utils.asset("images/AI.png"),
        x: 35,
        y: 967,
        w: 70,
        h: 70,
      }
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

  get ProfileButton() {  
    return this.getByRef("ProfileButton");
  }

  get Image() {  
    return this.getByRef("Image");
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
          Router.navigate("home");
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

        override _handleEnter() {
          Router.navigate("movies");
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

          override _handleEnter() {
            Router.navigate("series");
          }
      } 
    ];
  }


  override _focus() {
    console.log("Focusing sidebar");
    this.patch({
      w: SCREEN_SIZES.SIDEBAR_WIDTH_OPEN,
      color: COLORS.BLACK,
    });
    this.HomeButton?.patch({
      buttonText: "Home",
      zIndex: 4,
      alpha: 1,
    });
    this.SettingsButton?.patch({
      buttonText: "Settings",
      zIndex: 4,
      alpha: 1,
    });
    this.MoviesButton?.patch({
      buttonText: "Movies",
      zIndex: 4,
      alpha: 1,
    });
    this.SeriesButton?.patch({
      buttonText: "Series",
      zIndex: 4,
      alpha: 1,
    });
    this.SearchButton?.patch({
      buttonText: "Search",
      zIndex: 4,
      alpha: 1,
    });
    this.ProfileButton?.patch({
      buttonText: "Guest", // get the name if he/she is logged in
    });
    this.Image?.patch({
      src: Utils.asset("images/logoName.png"),
      h: 70,
      w:215
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
      buttonText: "",
      backgroundColor: COLORS.TRANSPARENT,
      alpha: 1,
      zIndex: 4,
    });
    this.SettingsButton?.patch({
      src: Utils.asset("images/settings.png"),
      buttonText: "",
      backgroundColor: COLORS.TRANSPARENT,
      alpha: 1,
      zIndex: 4,
    });
    this.SearchButton?.patch({
      src: Utils.asset("images/search.png"),
      backgroundColor: COLORS.TRANSPARENT,
      alpha: 1,
      zIndex: 4,
      buttonText: "",
    });
    this.MoviesButton?.patch({
      src: Utils.asset("images/movies.png"),
      backgroundColor: COLORS.TRANSPARENT,
      alpha: 1,
      zIndex: 4,
      buttonText: "",
    });
    this.SeriesButton?.patch({
      src: Utils.asset("images/series.png"),
      backgroundColor: COLORS.TRANSPARENT,
      alpha: 1,
      zIndex: 4,
      buttonText: "",
    });
    this.ProfileButton?.patch({
      buttonText: "",
    });
    this.Image?.patch({
      src: Utils.asset("images/AI.png"),
      h: 70,
      w:70
    });
  }
}