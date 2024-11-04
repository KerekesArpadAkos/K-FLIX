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

  _focusIndex = 0;

  get Container() {
    return this.getByRef("Container");
  }

  override _init() {
    const profiles = [
      // { name: "Jennifer", image: Utils.asset("images/profile1.png") },
      { name: "Jennifer", image: Utils.asset("images/profile1.png") },
      { name: "Michael", image: Utils.asset("images/profile1.png") },
      { name: "Michael", image: Utils.asset("images/profile1.png") },
      { name: "Add Profile", image: Utils.asset("images/addProfile.png") },
    ];

    this.Container.children = profiles.map((profile) => ({
      y: -130,
      x: -110,
      type: ProfileCard,
      profileImage: profile.image,
      profileName: profile.name,
    }));

    this._applyFocus();
  }

  _applyFocus() {
    const focusedCard = this.Container.children[this._focusIndex];
    focusedCard.tag("ProfileImage").patch({
      shader: {
        type: Lightning.shaders.RoundedRectangle,
        radius: 10,
        stroke: 9,
        strokeColor: COLORS.GREEN_FOCUS,
      },
    });
  }

  _removeFocus() {
    const focusedCard = this.Container.children[this._focusIndex];
    focusedCard.tag("ProfileImage").patch({
      shader: null,
    });
  }

  override _handleRight() {
    if (this._focusIndex < this.Container.children.length - 1) {
      this._removeFocus();
      this._focusIndex++;
      this._applyFocus();
    }
  }

  override _handleLeft() {
    if (this._focusIndex > 0) {
      this._removeFocus();
      this._focusIndex--;
      this._applyFocus();
    }
  }

  override _getFocused() {
    return this.Container.children[this._focusIndex];
  }
}
