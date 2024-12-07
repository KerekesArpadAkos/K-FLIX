import { Lightning, Utils } from "@lightningjs/sdk";
import SearchInput from "../components/SearchInput";
import { movieService } from "../utils/service/MovieService";
import VerticalList from "../components/VerticalList";
import Carousel from "../components/Carousel";
import { COLORS } from "../../static/constants/Colors";
import { tvShowService } from "../utils/service/TVShowService";
import { Sidebar } from "../components/Sidebar";
import Router from "@lightningjs/sdk/src/Router";
import eventBus from "../components/EventBus";
import Topbar from "src/components/Topbar";
import DefaultKeyboard from "src/components/DefaultKeyboard";
import { Microphone } from "src/components/Microphone";
import { generateImageFromPrompt } from "src/utils/pictureGenerator/pictureGenerator";


interface ChooseAvatarPageTemplateSpec extends Lightning.Component.TemplateSpec {
  SearchInput: typeof SearchInput;
  DefaultKeyboard: typeof DefaultKeyboard;
  Microphone: typeof Microphone;
  Label: object;
  AvatarImage: object;
  Title: object;
  ProfileOverlay : {
    ProfileImage: object;
  };
}

export default class ChooseAvatarPage
  extends Lightning.Component<ChooseAvatarPageTemplateSpec>
  implements Lightning.Component.ImplementTemplateSpec<ChooseAvatarPageTemplateSpec>
{
  private _avatarGenerated: boolean = false;
  static override _template() {
    return {
      w: 1920,
      h: 1080,
      color: COLORS.BACKGROUND,
      rect: true,
      Title: {
        x: 80,
        y: 80,
        w: 1760,
        h: 127,
        text: {
          text: "Create Profile",
          fontSize: 100,
          textColor: COLORS.WHITE,
          fontFace: "Regular",
          textAlign: "center",
        },
      },
      DefaultKeyboard: {
        y:348,
        type: DefaultKeyboard,
        zIndex: 0,
      },
      SearchInput: {
        type: SearchInput,
        x: 157,
        y: 248,
        zIndex: 2,
        signals: {
          focusList: true,
          search: "_onSearch",
          focusSidebar: true,
        },
      },
      Microphone: {
        y:852,
        type: Microphone,
        zIndex: 2,
      },
      Label: {
        x: 805,
        y: 624,
        text: {
          text: "The avatar will be shown here...",
          fontSize: 65,
          textColor: COLORS.WHITE,
        },
        visible: false,
      },
      AvatarImage: {
        x: 765,
        y: 369,
        src: "",
        w: 400,
        h: 400,
        visible: false,
      },
      ProfileOverlay: {
        x: 635,
        y: 59,
        w: 650,
        h: 760,
        rect: true,
        color: COLORS.BLACK,
        visible: false,
        alpha: 1,
        shader: {
          type: Lightning.shaders.RoundedRectangle,
          radius: 20,
        },
        ProfileImage: {
          w: 350,
          h: 350,
          y: 36,
          x: 150,
          src: "",
        },
      },
    };
  }

  get SearchInput() {
    return this.getByRef("SearchInput") as SearchInput;
  }

  get Title() {
    return this.getByRef("Title");
  }

  get ProfileOverlay() {
    return this.getByRef("ProfileOverlay");
  }

  get ProfileImage() {
    return this.ProfileOverlay?.tag("ProfileImage");
  }

  setBlur() {
    this.Title?.patch({ alpha: 0.5 });
    this.color = COLORS.BLACK_OPACITY_70;
  }

  removeBlur() {
    this.Title?.patch({ alpha: 1 });
    this.color = COLORS.BACKGROUND;
  }


  override _init() {
    eventBus.on("focusDefaultKeyboard", () => {
      console.log("focusDefaultKeyboard catched in SearchPage");
      this._setState("DefaultKeyboard");
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
  }
  private _updateSearchInput(text: string) {
    // Update the SearchInput component
    this.tag("SearchInput")?.setText(text);

    // Optionally, trigger a search with the recognized text
    this._onSearch(text); // here we are calling our function that generates the picture
  }

    private async _onSearch(query: string) {
        console.log("Search query:", query);
        const image = await generateImageFromPrompt(query);
        if (image) {
        if (this.AvatarImage) {
          this.AvatarImage.src = image;
          this.AvatarImage.visible = true;
        }
        if (this.Label) {
          this.Label.visible = false;
        }
        this._avatarGenerated = true;

        // Set focus to the generated image
        this._setState("AvatarImageFocus");
        } else {
        console.error("Failed to generate image");
        }
    }
  get Label() {
    return this.getByRef("Label");
  }

  get AvatarImage() {
    return this.getByRef("AvatarImage");
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
      class AvatarImageFocus extends this {
        override _getFocused() {
          return this.AvatarImage as unknown as Lightning.Component;
        }
        override _handleEnter() {
          console.log("Avatar image clicked, opening overlay...");
          if (this.ProfileImage && this.AvatarImage) {
            this.ProfileImage.src = this.AvatarImage.src;
          }
          if (this.ProfileOverlay) {
            this.ProfileOverlay.visible = true;
          }
          this._setState("ProfileOverlayFocus");
        }
      },
      class ProfileOverlayFocus extends this {
        override _getFocused(): Lightning.Component {
          return this.ProfileOverlay as unknown as Lightning.Component;
        }
        override _handleBack() {
          console.log("Closing overlay...");
          if (this.ProfileOverlay) {
            this.ProfileOverlay.visible = false;
          }
          this._setState("AvatarImageFocus");
        }
      },
    ];
  }
}
