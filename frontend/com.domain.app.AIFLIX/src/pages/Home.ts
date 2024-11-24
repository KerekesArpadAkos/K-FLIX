import { Lightning, Router, Utils } from "@lightningjs/sdk";
import { Gallery } from "../components/Gallery";
import { movieService } from "../utils/service/MovieService";
import { SCREEN_SIZES } from "../../static/constants/ScreenSizes";
import VerticalList from "../components/VerticalList";
import { GalleryItem } from "../utils/interfaces/items/itemsInterface";
import Card from "../components/Card";
import { getImageUrl } from "../utils";
import Carousel from "../components/Carousel";
import { tvShowService } from "../utils/service/TVShowService";
import { convertItemToGallery } from "../utils/formatters/itemMapper";
import PinOverlay from "../components/PinOverlay";
import eventBus from "../components/EventBus";
import lng from "@lightningjs/sdk/src/Lightning";
import { getGlobalUserId, getGlobalProfileId } from "../services/firebaseService";

interface HomePageTemplateSpec extends Lightning.Component.TemplateSpec {
  Image: object;
  // BackgroundImage: object;
  Gallery: typeof Gallery;
  VerticalList: typeof VerticalList;
  PinOverlay: typeof PinOverlay;
}

export class Home
  extends Lightning.Component<HomePageTemplateSpec>
  implements Lightning.Component.ImplementTemplateSpec<HomePageTemplateSpec>
{

  private _userId: string | null = null;
  private _profileId: string | null = null;
  static override _template(): Lightning.Component.Template<HomePageTemplateSpec> {
    return {
      w: SCREEN_SIZES.WIDTH,
      h: SCREEN_SIZES.HEIGHT,
      Image: {
        w: SCREEN_SIZES.WIDTH,
        h: SCREEN_SIZES.HEIGHT,
        visible: false,
        zIndex: 6,
        texture: {
          type: lng.textures.ImageTexture,
          src: Utils.asset("images/defaultSkeleton.png"),
        },
      },
      // BackgroundImage: {
      //   zIndex: 2,
      //   texture: lng.Tools.getSvgTexture(
      //     Utils.asset("images/background.svg"),
      //     SCREEN_SIZES.WIDTH,
      //     SCREEN_SIZES.HEIGHT
      //   ),
      // },
      Gallery: {
        type: Gallery,
      },
      VerticalList: {
        zIndex: 2,
        type: VerticalList,
        x: 100,
        signals: {
          $onFocusGallery: true,
          $dimGallery: true,
        },
      },
      PinOverlay: {
        type: PinOverlay,
        visible: false,
      },
    };
  }
  
  
  get Image() {
    return this.getByRef("Image");
  }

  // get BackgroundImage() {
  //   return this.getByRef("BackgroundImage");
  // }
  get PinOverlay() {
    return this.getByRef("PinOverlay") as PinOverlay;
  }

  get Gallery() {
    return this.getByRef("Gallery") as Gallery;
  }

  get VerticalList() {
    return this.getByRef("VerticalList") as VerticalList;
  }

  override _init() {
    this.addGallery();
  }

  override _firstEnable() {
    console.log("Home firstEnable");
    eventBus.on("showPinOverlay", this.showPinOverlay.bind(this));
    eventBus.on("pinCorrect", this.hidePinOverlay.bind(this));
    eventBus.on("accessDenied", this.handleAccessDenied.bind(this));
    eventBus.on(
      "setStateOnDetailButton",
      this.setStateOnDetailButton.bind(this)
    );

    Router.focusPage(); 
  }

  override _active() {
    setTimeout(() => {
      this.checkRoute();
    }, 100);
    console.warn("Home active");

    this._userId = getGlobalUserId() || localStorage.getItem("userId");
    this._profileId = getGlobalProfileId() || localStorage.getItem("profileId");

    if (!this._userId || !this._profileId) {
      console.error("Missing userId or profileId. Redirecting to login...");
      Router.navigate("signin");
      return;
    }

    console.warn(
      `User ID: ${this._userId}, Profile ID: ${this._profileId} - Home loaded`
    );

    this._setState("Gallery");
  }

  async checkRoute() {
    const activeHash = Router.getActiveHash();

    // this.addDefaultSkeletonAnimation();

    if (activeHash === "home") {
      const carousels = await this.createHomeCarousels();
      this.VerticalList.loadItems(carousels);
    } else if (activeHash === "series") {
      const carousels = await this.createTvShowCarousels();
      this.VerticalList.loadItems(carousels);
    } else if (activeHash === "movies") {
      const carousels = await this.createMovieCarousels();
      this.VerticalList.loadItems(carousels);
    } else {
      console.error("Unknown route:", activeHash);
    }
  }

  // addDefaultSkeletonAnimation() {
  //   const skeleton = this.Image;
  //   const backgroundImage = this.BackgroundImage;

  //   const animationDuration = 1;
  //   const fadeAlphaStart = 0.5;
  //   const fadeAlphaEnd = 1;
  //   const displayDuration = 1000;

  //   if (!skeleton || !backgroundImage) {
  //     console.error("loadingImage or BackgroundImage is not found.");
  //     return;
  //   }

  //   backgroundImage.patch({ visible: true, alpha: 1 });
  //   skeleton.patch({ visible: true, alpha: fadeAlphaStart });

  //   const pulseAnimation = skeleton.animation({
  //     duration: animationDuration,
  //     repeat: -1,
  //     actions: [
  //       {
  //         p: "alpha",
  //         v: { 0: fadeAlphaStart, 0.5: fadeAlphaEnd, 1: fadeAlphaStart },
  //       },
  //     ],
  //   });

  //   pulseAnimation.start();

  //   setTimeout(() => {
  //     pulseAnimation.stop();
  //     skeleton.patch({ visible: false });
  //     backgroundImage.patch({ visible: false });
  //   }, displayDuration);
  // }

  async addGallery() {
    const popularMovieDetails = await movieService.getMostPopularMovieDetails();

    const logoTitle = await movieService.getMovieImages(
      popularMovieDetails?.id || 0
    );

    this.patch({
      Gallery: {
        zIndex: 1,
        type: Gallery,
      },
    });

    const backdrop = await movieService.getMovieDetails(
      popularMovieDetails?.id || 0
    );

    this.Gallery.props = {
      logoTitle: getImageUrl(
        logoTitle?.file_path || "",
        SCREEN_SIZES.LOGO_IMAGE_WIDTH
      ),
      title: popularMovieDetails?.title || "",
      description: popularMovieDetails?.overview || "",
      src: getImageUrl(backdrop?.backdrop_path || "", "w1280"),
      id: popularMovieDetails?.id || 0,
      showBtn: true,
      showTrailers: false,
      isHomePage: true,
      isMovie: true,
      adult: popularMovieDetails?.adult || false,
      isCentered: false,
    };
  }

  async createHomeCarousels() {
    const carousels = [];

    const carouselPopularMovies = new Carousel(this.stage);
    carouselPopularMovies.props = {
      title: "Most Popular Movies",
      isMovie: true,
      isTop: false,
      getItems: async () => {
        return await movieService.getMostPopularMoviesCards();
      },
    };
    carousels.push(carouselPopularMovies);

    const carouselTopRatedMovies = new Carousel(this.stage);
    carouselTopRatedMovies.props = {
      title: "Top Rated Movies",
      isMovie: true,
      isTop: true,
      getItems: async () => {
        return await movieService.getTopRatedMovieCards();
      },
    };
    carousels.push(carouselTopRatedMovies);

    const carouselPopularTVShows = new Carousel(this.stage);
    carouselPopularTVShows.props = {
      title: "Most Popular TV Shows",
      isMovie: false,
      isTop: false,
      getItems: async () => {
        return await tvShowService.getMostPopularTVShowsCards();
      },
    };
    carousels.push(carouselPopularTVShows);

    const carouselTopRatedTVShows = new Carousel(this.stage);
    carouselTopRatedTVShows.props = {
      title: "Top Rated TV Shows",
      isMovie: false,
      isTop: true,
      getItems: async () => {
        return await tvShowService.getTopRatedTVCards();
      },
    };
    carousels.push(carouselTopRatedTVShows);

    const genres = await movieService.getMovieGenres();
    if (genres) {
      for (const genre of genres) {
        const carouselGenre = new Carousel(this.stage);
        carouselGenre.props = {
          title: genre.name,
          isMovie: true,
          isTop: false,
          getItems: async () => {
            return await movieService.getMoviesByGenre(genre.id);
          },
        };
        carousels.push(carouselGenre);
      }
    }

    return carousels;
  }

  async createMovieCarousels() {
    const carousels = [];

    const carouselPopularMovies = new Carousel(this.stage);
    carouselPopularMovies.props = {
      title: "Most Popular Movies",
      isMovie: true,
      isTop: false,
      getItems: async () => {
        return await movieService.getMostPopularMoviesCards();
      },
    };
    carousels.push(carouselPopularMovies);

    const carouselTopRatedMovies = new Carousel(this.stage);
    carouselTopRatedMovies.props = {
      title: "Top Rated Movies",
      isMovie: true,
      isTop: true,
      getItems: async () => {
        return await movieService.getTopRatedMovieCards();
      },
    };
    carousels.push(carouselTopRatedMovies);

    const genres = await movieService.getMovieGenres();
    if (genres) {
      for (const genre of genres) {
        const carouselGenre = new Carousel(this.stage);
        carouselGenre.props = {
          title: genre.name,
          isMovie: true,
          isTop: false,
          getItems: async () => {
            return await movieService.getMoviesByGenre(genre.id);
          },
        };
        carousels.push(carouselGenre);
      }
    }

    return carousels;
  }

  async createTvShowCarousels() {
    const carousels = [];

    const carouselPopularTVShows = new Carousel(this.stage);
    carouselPopularTVShows.props = {
      title: "Most Popular TV Shows",
      isMovie: false,
      isTop: false,
      getItems: async () => {
        return await tvShowService.getMostPopularTVShowsCards();
      },
    };
    carousels.push(carouselPopularTVShows);

    const carouselTopRatedTVShows = new Carousel(this.stage);
    carouselTopRatedTVShows.props = {
      title: "Top Rated TV Shows",
      isMovie: false,
      isTop: true,
      getItems: async () => {
        return await tvShowService.getTopRatedTVCards();
      },
    };
    carousels.push(carouselTopRatedTVShows);

    return carousels;
  }

  async $onFocusGallery(data: Card) {
    const logoTitle = data.isMovieCard
      ? await movieService.getMovieImages(data.idCard)
      : await tvShowService.getTVShowImages(data.idCard);

    let backdropPath = "";

    if (data.isMovieCard) {
      const movieDetails = await movieService.getMovieDetails(data.idCard);
      backdropPath = movieDetails?.backdrop_path
        ? getImageUrl(movieDetails.backdrop_path, "w1280")
        : "";
    } else {
      const showDetails = await tvShowService.getTVShowDetails(data.idCard);
      backdropPath = showDetails?.backdrop_path
        ? getImageUrl(showDetails.backdrop_path, "w1280")
        : "";
    }

    const logoTitlePath = logoTitle?.file_path
      ? getImageUrl(logoTitle.file_path, SCREEN_SIZES.LOGO_IMAGE_WIDTH)
      : "";

    this.Gallery.props = {
      title: data.title,
      description: data.overview,
      src: backdropPath,
      id: data.idCard,
      isMovie: data.isMovieCard,
      showBtn: true,
      showTrailers: false,
      logoTitle: logoTitlePath ? logoTitlePath : "",
      isHomePage: true,
      adult: data.adult,
      isCentered: false,
    };
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
    this._setState("Gallery");
  }

  setStateOnDetailButton() {
    this.hidePinOverlay();
  }

  handleAccessDenied() {
    this.hidePinOverlay();
  }

  $dimGallery(focused: number) {
    this.Gallery.Details.patch({
      smooth: { alpha: focused < 1 ? 1 : 0 },
      transitions: { alpha: { duration: 0.1 } },
    });
    this.Gallery.DetailsBtn.patch({
      smooth: { alpha: focused < 1 ? 1 : 0 },
      transitions: { alpha: { duration: 0.4 } },
    });
    this.Gallery.Details.patch({
      smooth: { y: focused < 1 ? 0 : -50 },
      transitions: { alpha: { duration: 0.4 }, y: { duration: 0.3 } },
    });
    this.Gallery.Description.patch({
      smooth: { alpha: focused < 1 ? 1 : 0 },
      transitions: { alpha: { duration: 0.4 } },
    });
    this.Gallery.Image.patch({
      smooth: { alpha: focused < 2 ? 1 : 0.9 },
      transitions: { alpha: { duration: 0.4 } },
    });
  }

  async handleLoadGallery() {
    const popularMovieDetails = await movieService.getMostPopularMovieDetails();

    const logoTitle = await movieService.getMovieImages(
      popularMovieDetails?.id || 0
    );

    if (popularMovieDetails) {
      const { title, overview, backdrop_path, id, adult } =
        popularMovieDetails as GalleryItem;

      const backdrop = await movieService.getMovieDetails(id);

      this.Gallery.props = {
        logoTitle: getImageUrl(
          logoTitle?.file_path || "",
          SCREEN_SIZES.LOGO_IMAGE_WIDTH
        ),
        title: title,
        description: overview,
        src: getImageUrl(backdrop!.backdrop_path, "w1280"),
        id: id,
        showBtn: true,
        adult: adult,
        showTrailers: false,
        isHomePage: true,
        isMovie: true,
        isCentered: false,
      };

      const alphaAnimation = this.Gallery.animation({
        duration: 3,
        repeat: 0,
        actions: [{ p: "alpha", v: { 0: 0, 0.5: 0.5, 1: 1 } }],
      });
      alphaAnimation.start();
    }
  }

  override _handleBack() {
    console.log("Home _handleBack");
    return;
  }

  static override _states() {
    return [
      class VerticalList extends this {
        override _getFocused() {
          return this.VerticalList;
        }

        override _handleUp() {
          const currentIndex = this.VerticalList.getCurrentIndex;

          if (currentIndex > 0 && this.VerticalList.List) {
            this.VerticalList.setCurrentIndex = currentIndex - 1;
            this.VerticalList.List.setIndex(currentIndex);
          } else {
            this._setState("Gallery");
          }
        }
      },
      class Gallery extends this {
        private _alreadyFocused = false; 
      
        override _getFocused() {
          if (!this._alreadyFocused) {
            console.warn("Gallery focused");
            this._alreadyFocused = true; 
          }
          return this.Gallery;
        }
      
        override _handleLeft() {
          Router.focusWidget("Sidebar");
        }
      
        override _handleDown() {
          this._alreadyFocused = false; 
          this._setState("VerticalList");
        }
      
        override _handleUp() {
          this._alreadyFocused = false; 
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
    ];
  }
}

export default Home;