import { Lightning, Utils } from "@lightningjs/sdk";
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
import Topbar from "src/components/Topbar";
import DefaultKeyboard from "src/components/DefaultKeyboard";
import { Button } from "src/components/Button";
import { Microphone } from "src/components/Microphone";

interface SearchPageTemplateSpec extends Lightning.Component.TemplateSpec {
  Sidebar: typeof Sidebar;
  SearchInput: typeof SearchInput;
  VerticalList: typeof VerticalList;
  Topbar: typeof Topbar;
  DefaultKeyboard: typeof DefaultKeyboard;
  Microphone: typeof Microphone;
  Carousel: typeof Carousel;
  Label: object;
}

export default class SearchPage
  extends Lightning.Component<SearchPageTemplateSpec>
  implements Lightning.Component.ImplementTemplateSpec<SearchPageTemplateSpec>
{
  static override _template() {
    return {
      w: 1920,
      h: 1080,
      color: COLORS.BACKGROUND,
      rect: true,
      Topbar: {
        type: Topbar,
        zIndex: 2,
      },
      DefaultKeyboard: {
        type: DefaultKeyboard,
        zIndex: 0,
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
        x: 500,
        y: -300,
        zIndex: 1,
      },
      Carousel: {
        type: Carousel,
        // x: 500,
        // y: 100,
        // zIndex: 1,
      },
      Microphone: {
        type: Microphone,
        zIndex: 2,
      },
      Label: {
        x: 847,
        y: 555,
        text: {
          text: "No results found...",
          fontSize: 65,
          textColor: COLORS.WHITE,
        },
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

  get Topbar() {
    return this.getByRef("Topbar") as Topbar;
  }
  get Carousel() {
    return this.getByRef("Carousel") as Carousel;
  }
  override _init() {
    this.Topbar?.patch({
      TopBarComponent: { Label: { text: { text: "Search" } } },
    });

    eventBus.on("focusDefaultKeyboard", () => {
      console.log("focusDefaultKeyboard catched in SearchPage");
      this._setState("DefaultKeyboard");
    });

    eventBus.on("focusCarousel", () => {
      this._setState("VerticalList");
    });
    eventBus.on("focusMicrophone", () => {
      console.log("Focus shifted to Microphone");
      this._setState("MicrophoneFocus");
    });
    eventBus.on("recognizedText", (event: CustomEvent) => {
      const transcript = event.detail as string;
      console.log("Recognized text received in SearchPage:", transcript);
      this._updateSearchInput(transcript);
    });
    eventBus.on("focusBackButton", () => {
      console.log("Focus shifted to TopBar");
      this._setState("TopBarFocus");
    });
  }
  private _updateSearchInput(text: string) {
    this.tag("SearchInput")?.setText(text);

    this._onSearch(text);
  }
  get Label() {
    return this.getByRef("Label");
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

    if (movieResults.length === 0 && tvResults?.length === 0) {
      this.Label!.visible = true;
      this.VerticalList!.visible = false;
      // eventBus.emit("focusDefaultKeyboard");
    }

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
          return this.tag("DefaultKeyboard");
        }
        override _handleUp() {
          this._setState("SearchInputFocus");
        }
      },
      class VerticalList extends this {
        override _getFocused() {
          this.VerticalList.setCarouselsWidth(1370);
          return this.getByRef("VerticalList");
        }
        override _handleUp() {
          const currentIndex = this.VerticalList!.getCurrentIndex;

          if (currentIndex > 0) {
            this.VerticalList!.setCurrentIndex = currentIndex - 1;
            this.VerticalList!.List.setIndex(currentIndex - 1);
          } else {
            return;
          }
        }
      },
      class TopBarFocus extends this {
        override _getFocused(): Lightning.Component | undefined {
          return this.tag("Topbar") as Topbar;
        }
      },
      class MicrophoneFocus extends this {
        override _getFocused() {
          return this.tag("Microphone");
        }
      },
    ];
  }
}
