import { Lightning, Router, Utils } from "@lightningjs/sdk";
import { COLORS } from "static/constants/Colors";
import { SCREEN_SIZES } from "static/constants/ScreenSizes";

export default class CreateProfile extends Lightning.Component {
  static override _template() {
    const profiles = [];
    for (let i = 1; i <= 28; i++) {
      profiles.push({
        type: ProfileImage,
        imageSrc: Utils.asset(`images/profiles/profile${i}.png`),
        x: ((i - 1) % 7) * 180,
        y: Math.floor((i - 1) / 7) * 180,
      });
    }

    return {
      w: SCREEN_SIZES.WIDTH,
      h: SCREEN_SIZES.HEIGHT,
      rect: true,
      color: COLORS.BLACK,
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
      ChooseAvatar: {
        x: 80,
        y: 224,
        w: 1760,
        h: 50,
        text: {
          text: "Choose Avatar",
          fontSize: 40,
          textColor: COLORS.WHITE,
          fontFace: "Regular",
          textAlign: "left",
        },
      },
      Container: {
        x: 348,
        y: 309,
        w: 1224,
        h: 684,
        children: profiles,
      },
      GenerateAvatar: {
        x: 80,
        y: 1010,
        w: 1760,
        h: 50,
        text: {
          text: "Generate Avatar",
          fontSize: 40,
          textColor: COLORS.WHITE,
          fontFace: "Regular",
          textAlign: "left",
        },
      },
    };
  }

  _selectedIndex = 0;

  get Container() {
    return this.tag("Container");
  }

  override _init() {
    this._setState("ProfilesContainer");
  }

  _applyFocus() {
    this.Container.children.forEach((child: any, index: number) => {
      if (index === this._selectedIndex) {
        // Apply shader only to the selected image
        child.patch({
          shader: {
            type: Lightning.shaders.RoundedRectangle,
            radius: 0,
            stroke: 6,
            strokeColor: COLORS.GREEN_FOCUS,
          },
          //make the selected item  litter bigger
          scale: 1.1,
          transitions: {
            scale: { duration: 0.3, timingFunction: "ease-in" },
            alpha: { duration: 0.3, timingFunction: "ease-in" },
          },
        });
      } else {
        // Ensure other images are reset without the shader
        child.patch({
          shader: null,
          scale: 1,
          transitions: {
            scale: { duration: 0.3, timingFunction: "ease-in-out" },
            alpha: { duration: 0.3, timingFunction: "ease-in-out" },
          },
        });
      }
    });
  }

  static override _states() {
    return [
      class ProfilesContainer extends this {
        override _getFocused() {
          this._applyFocus();
          return this.Container.children[this._selectedIndex];
        }
        override _handleLeft() {
          if (this._selectedIndex % 7 > 0) {
            this._selectedIndex--;
            this._applyFocus();
          }
        }

        override _handleRight() {
          if (
            this._selectedIndex % 7 < 6 &&
            this._selectedIndex < this.Container.children.length - 1
          ) {
            this._selectedIndex++;
            this._applyFocus();
          }
        }

        override _handleUp() {
          if (this._selectedIndex >= 7) {
            this._selectedIndex -= 7;
            this._applyFocus();
          }
        }

        override _handleDown() {
          if (this._selectedIndex + 7 < this.Container.children.length) {
            this._selectedIndex += 7;
            this._applyFocus();
          }
        }
      },
    ];
  }
}

// ProfileImage Component
class ProfileImage extends Lightning.Component {
  static override _template() {
    return {
      w: 144,
      h: 144,
      rect: true,
      ProfileImage: {
        w: 144,
        h: 144,
        src: "",
      },
    };
  }

  set imageSrc(value: string) {
    this.tag("ProfileImage").src = value;
  }
}
