import { Lightning, Router } from "@lightningjs/sdk";
import Card from "./Card";
import { CardItem } from "../utils/interfaces/items/itemsInterface";
import eventBus from "./EventBus";

interface CarouselTemplateSpec extends Lightning.Component.TemplateSpec {
  Title: object;
  List: {
    type: object;
    items: Card[];
  };
}

interface ListComponentType extends Lightning.components.ListComponent {
  getElement(index: number): Lightning.Component<any>;
}

export class Carousel extends Lightning.Component<CarouselTemplateSpec> {
  currentIndex = 0;

  _title = "";
  _isMovie = true;
  _isTop = false;
  _getItems: () => Promise<CardItem[]> = () => Promise.resolve([]);

  static override _template() {
    return {
      w: 1780,
      h: 400,
      y: 200,
      Title: {
        x: 30,
        y: -25,
        text: {
          text: "",
          fontSize: 38,
          textColor: 0xffffffff,
        },
      },
      List: {
        type: Lightning.components.ListComponent,
        w: 1770,
        h: 400,
        itemSize: 230,
        roll: true,
        clipping: true,
        items: [],
        flex: {
          paddingLeft: 30,
          flexDirection: "row",
        },
      },
    };
  }

  override _init() {
    this.currentIndex = 0;
    this.loadMovies();
    this._setState("Carousel");
  }

  get List() {
    return this.getByRef("List") as ListComponentType;
  }

  set isMovie(isMovie: boolean) {
    this._isMovie = isMovie;
  }

  get isMovie() {
    return this._isMovie;
  }

  set isTop(isTop: boolean) {
    this._isTop = isTop;
  }

  get isTop() {
    return this._isTop;
  }

  set listWidth(width: number) {
    this.List.w = width; // Use 'this.tag("List")' to access the List component
  }

  async loadMovies() {
    try {
      const movies: CardItem[] = await this._getItems();
      const items = movies.map((movie: CardItem, index: number) => ({
        type: Card,
        props: {
          id: movie.id,
          title: movie.title,
          src: movie.src,
          overview: movie.overview,
          adult: movie.adult,
          isMovie: this.isMovie,
          isTop: this.isTop,
          topIndex: index,
        },
      }));
      this.List.items = items;

      if (this.isTop) {
        this.List.patch({
          itemSize: 400,
          flex: {
            paddingLeft: 200,
          },
        });
      }
      this._refocus();
    } catch (error) {
      console.error("Error loading movies:", error);
    }
  }

  set props(props: {
    title: string;
    isMovie: boolean;
    isTop: boolean;
    getItems: () => Promise<CardItem[]>;
  }) {
    const { title, isMovie, isTop, getItems } = props;

    this.patch({
      Title: {
        text: { text: title, fontFace: "NetflixSans-Medium" },
      },
    });

    this._title = title;
    this._isTop = isTop;
    this._isMovie = isMovie;
    this._getItems = getItems;
  }

  get title() {
    return this._title;
  }

  get getItems() {
    return this._getItems;
  }

  static override _states() {
    return [
      class Carousel extends this {
        override _getFocused() {
          const list = this.List as ListComponentType;
          if (list.length > 0) {
            return list.getElement(this.currentIndex);
          }
          return null;
        }

        override _handleLeft() {
          if (this.currentIndex > 0) {
            this.currentIndex--;
            this.List?.setIndex(this.currentIndex);
          } else {
            if (Router.getActiveHash() === "search") {
              console.log("focusDefaultKeyboard from search");
              eventBus.emit("focusDefaultKeyboard");
            } else {
              Router.focusWidget("Sidebar");
            }
          }
        }

        override _handleRight() {
          const list = this.List as ListComponentType;
          if (list && this.currentIndex < list.length - 1) {
            this.currentIndex++;
            this.List?.setIndex(this.currentIndex);
          }
        }
      },
    ];
  }
}

export default Carousel;
