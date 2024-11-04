import { Lightning, Utils } from "@lightningjs/sdk";
import ProfileCard from "src/components/ProfileCard";
import { COLORS } from "static/constants/Colors";
import { SCREEN_SIZES } from "static/constants/ScreenSizes";

export default class ProfileSelection extends Lightning.Component {
  static override _template() {
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
      },
      Container: {
        x: 256,
        y: 462,
        w: 1407, // Full screen width for centering
        h: 333,
        flex: {
          direction: "row", // Horizontal layout
          wrap: false, // No wrapping
          justifyContent: "space-around", // Center items horizontally
          alignItems: "center", // Center items vertically
        },
        children: [], // Start with empty children, populated in _init
      },
    };
  }

  get Container() {
    return this.getByRef("Container");
  }

  override _init() {
    const profiles = [
      { name: "Jennifer", image: Utils.asset("images/profile1.png") },
      { name: "Jennifer", image: Utils.asset("images/profile1.png") },
      { name: "Michael", image: Utils.asset("images/profile1.png") },
      { name: "Michael", image: Utils.asset("images/profile1.png") },
      { name: "Add Profile", image: Utils.asset("images/addProfile.png") },
    ];

    // Set Container children dynamically
    this.Container.children = profiles.map((profile) => ({
      y: -130,
      x: -110,
      type: ProfileCard,
      profileImage: profile.image,
      profileName: profile.name,
    }));
  }
}
