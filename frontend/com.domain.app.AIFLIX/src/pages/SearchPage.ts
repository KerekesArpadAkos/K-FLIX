import { Lightning } from "@lightningjs/sdk";
import SearchInput from "../components/SearchInput";
import { movieService } from "../utils/service/MovieService";
import VerticalList from "../components/VerticalList";
import Carousel from "../components/Carousel";
import { COLORS } from "../../static/constants/Colors";
import { tvShowService } from "../utils/service/TVShowService";
import { Sidebar } from "../components/Sidebar";
import Router from "@lightningjs/sdk/src/Router";
import { getImageUrl } from "../utils";
import Card from "../components/Card";
import eventBus from "../components/EventBus";
import PinOverlay from "../components/PinOverlay";
import Topbar from "src/components/Topbar";
import DefaultKeyboard from "src/components/DefaultKeyboard";

interface SearchPageTemplateSpec extends Lightning.Component.TemplateSpec {
  Sidebar: typeof Sidebar;
  SearchInput: typeof SearchInput;
  VerticalList: typeof VerticalList;
  PinOverlay: typeof PinOverlay;
  Topbar: typeof Topbar;
  DefaultKeyboard: typeof DefaultKeyboard;
}

export default class SearchPage
  extends Lightning.Component<SearchPageTemplateSpec>
  implements Lightning.Component.ImplementTemplateSpec<SearchPageTemplateSpec>
{
  static override _template() {
    return {
      w: 1920,
      h: 1080,
      color: COLORS.RAISIN_BLACK,
      rect: true,
      Topbar: {
        type: Topbar,
        zIndex: 2,
      },
      DefaultKeyboard: {
        type: DefaultKeyboard,
        zIndex: 2,
      },
      SearchInput: {
        type: SearchInput,
        x: 199,
        y: 170,
        zIndex: 2,
        signals: {
          focusList: true,
          search: "_onSearch",
          focusSidebar: true,
        },
      },
      VerticalList: {
        type: VerticalList,
        x: 100,
        y: -50,
        zIndex: 1,
      },
      PinOverlay: {
        type: PinOverlay,
        visible: false,
      },
    };
  }

  get Sidebar() {
    return this.getByRef("Sidebar") as Sidebar;
  }

  get SearchInput() {
    return this.getByRef("SearchInput") as SearchInput;
  }

  get VerticalList() {
    return this.getByRef("VerticalList") as VerticalList;
  }

  focusList() {
    this._setState("VerticalList");
  }

  focusSidebar() {
    Router.focusWidget("Sidebar");
  }

  get PinOverlay() {
    return this.getByRef("PinOverlay") as PinOverlay;
  }

  get Topbar() {
    return this.getByRef("Topbar") as Topbar;
  }
  override _init() {
    this.Topbar?.patch({
      TopBarComponent: { Label: { text: { text: "Search" } } },
    });
    eventBus.on("showPinOverlay", (event: CustomEvent) =>
      this.showPinOverlay(event)
    );
    eventBus.on("pinCorrect", this.hidePinOverlay.bind(this));
    eventBus.on("accessDenied", this.handleAccessDenied.bind(this));
    eventBus.on(
      "setStateOnDetailButton",
      this.setStateOnDetailButton.bind(this)
    );

    // eventBus.on("focusSearchInput", () => {
    //   this._setState("SearchInputFocus");
    // });
    eventBus.on("focusDefaultKeyboard", () => {
      this._setState("DefaultKeyboard");
    });
  }
  showPinOverlay(event: CustomEvent) {
    this.PinOverlay.patch({
      visible: true,
      zIndex: 2,
    });
    this.PinOverlay._isMovie = event.detail.isMovie;
    this.PinOverlay.movieId = event.detail.movieId;
    this._setState("PinOverlayFocus");
  }

  hidePinOverlay() {
    this.PinOverlay.patch({
      visible: false,
    });
    this._setState("VerticalList");
  }

  setStateOnDetailButton() {
    this.hidePinOverlay();
  }

  handleAccessDenied() {
    this.hidePinOverlay();
  }
  async _onSearch(query: string) {
    const movieResults = await movieService.searchMovies(query);
    const tvResults = await tvShowService.searchTVShows(query);
    const tvShows = new Carousel(this.stage);
    const movies = new Carousel(this.stage);

    tvShows.props = {
      title: "TV Shows found",
      isMovie: false,
      isTop: false,
      getItems: async () => {
        return tvResults || [];
      },
    };
    movies.props = {
      title: "Movies found",
      isMovie: true,
      isTop: false,
      getItems: async () => {
        return movieResults || [];
      },
    };
    if (query !== "") {
      if (movies || tvShows) {
        this.VerticalList!.loadItems([movies, tvShows]);
        this._setState("VerticalList");
      }
    }
  }

  override _enable() {
    this._setState("DefaultKeyboard");
    Router.focusPage();
  }

  static override _states() {
    return [
      class DefaultKeyboard extends this {
        override _getFocused() {
          console.log("DefaultKeyboard");
          return this.tag("DefaultKeyboard");
        }

        override _handleKey(key: { keyCode: number }) {
          if (key.keyCode === 13) {
            // Enter key
            const keyPressed = this.tag("DefaultKeyboard")?.triggerEnter();
            // if (keyPressed) {
            //   this.SearchInput.addText(keyPressed); // Assuming addText method exists
            // }
          }
        }

        override _handleUp() {
          console.log("Up pressed");
          this._setState("SearchInputFocus");
        }
      },
      class VerticalList extends this {
        override _getFocused() {
          return this.getByRef("VerticalList");
        }
        override _handleUp() {
          const currentIndex = this.VerticalList!.getCurrentIndex;

          if (currentIndex > 0) {
            this.VerticalList!.setCurrentIndex = currentIndex - 1;
            this.VerticalList!.List.setIndex(currentIndex - 1);
          } else {
            this._setState("SearchInput");
          }
        }
      },
      // class SearchInputFocus extends this {
      //   override _getFocused() {
      //     return this.getByRef("SearchInput");
      //   }

      //   override _handleKey(key: { keyCode: number }) {
      //     // Add handling here if needed
      //   }

      //   override _handleDown() {
      //     this._setState("DefaultKeyboard");
      //   }
      // },
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
    ];
  }
}
