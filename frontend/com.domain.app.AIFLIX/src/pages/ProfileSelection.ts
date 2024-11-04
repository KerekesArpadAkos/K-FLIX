import { SCREEN_SIZES } from "static/constants/ScreenSizes";
import { COLORS } from "static/constants/Colors";
import { Lightning, Utils } from "@lightningjs/sdk";
import ProfileCard from "src/components/ProfileCard";

interface LoadingPageTemplateSpec extends Lightning.Component.TemplateSpec {
  Title: object;
  Container: {
    ProfileCard: typeof ProfileCard;
    AddProfile: typeof ProfileCard;
  };
}

export default class LoadingPage extends Lightning.Component<LoadingPageTemplateSpec> {
  static override _template(): Lightning.Component.Template<LoadingPageTemplateSpec> {
    return {
      w: SCREEN_SIZES.WIDTH,
      h: SCREEN_SIZES.HEIGHT,
      rect: true,
      color: COLORS.BACKGROUND,
      Title: {
        x: 80,
        y: 185,
        w: 1760,
        h: 130,
        text: {
          text: "Who's Watching?",
          fontSize: 100,
          fontFace: "Regular",
          textColor: COLORS.WHITE,
          textAlign: "center",
        },
        zIndex: 1,
      },
      Container: {
        x: 256,
        y: 462,
        w: 1407,
        h: 333,
        ProfileCard: {
          type: ProfileCard,
        },
        AddProfile: {
          type: ProfileCard,
        },
      },
    };
  }

  get Container() {
    return this.getByRef("Container");
  }

  get ProfileCards() {
    return this.Container?.getByRef("ProfileCard");
  }

  get AddProfile() {
    return this.Container?.getByRef("AddProfile");
  }

  override _init() {
    if (this.AddProfile) {
      this.AddProfile.x = 500;
      this.AddProfile.profileImage = Utils.asset("images/addProfile.png"); // Use the setter
      this.AddProfile.profileName = "Add Profile"; // Use the setter
    }
  }
}
