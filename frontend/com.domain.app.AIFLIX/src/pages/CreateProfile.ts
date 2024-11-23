import { Lightning, Router, Utils } from "@lightningjs/sdk";
import NameInput from "src/components/NameInput";
import { COLORS } from "static/constants/Colors";
import { SCREEN_SIZES } from "static/constants/ScreenSizes";
import { LandscapeKeyboardForProfile } from "src/components/LandscapeKeyboardForProfile";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "src/services/firebaseService";

export default class CreateProfile extends Lightning.Component {
  private _userId: any;
  _selectedIndex = 0;

  override set params(params: { userId: string }) {
    this._userId = params.userId;
    console.log("Received userId in CreateProfile:", this._userId);
  }
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
      color: COLORS.BACKGROUND,
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

          src: Utils.asset(`images/profiles/profile1.png`),
        },
        NameInputContainer: {
          type: NameInput,
          x: 210.5,
          y: 410,
        },
        LandscapeKeyboardForProfile: {
          type: LandscapeKeyboardForProfile,
          x: 15,
          y: 485,
          signals: {
            onKeyPress: "onKeyPress",
          },
        },
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

  get Container() {
    return this.tag("Container");
  }

  get ProfileOverlay() {
    return this.getByRef("ProfileOverlay");
  }
  get Title() {
    return this.getByRef("Title");
  }

  get ChooseAvatar() {
    return this.getByRef("ChooseAvatar");
  }
  get GenerateAvatar() {
    return this.getByRef("GenerateAvatar");
  }

  override _init() {
    this._setState("ProfilesContainer");
  }

  _applyFocus() {
    this.Container.children.forEach((child: any, index: number) => {
      if (index === this._selectedIndex) {
        child.patch({
          shader: {
            type: Lightning.shaders.RoundedRectangle,
            radius: 0,
            stroke: 6,
            strokeColor: COLORS.GREEN_FOCUS,
          },
          scale: 1.1,
          transitions: {
            scale: { duration: 0.3, timingFunction: "ease-in" },
            alpha: { duration: 0.3, timingFunction: "ease-in" },
          },
        });
      } else {
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

  setBlur() {
    this.Title.patch({ alpha: 0.5 });
    this.ChooseAvatar.patch({ alpha: 0.5 });
    this.Container.patch({ alpha: 0.5 });
    this.GenerateAvatar.patch({ alpha: 0.5 });
    this.color = COLORS.BLACK_OPACITY_70;
  }

  removeBlur() {
    this.Title.patch({ alpha: 1 });
    this.ChooseAvatar.patch({ alpha: 1 });
    this.Container.patch({ alpha: 1 });
    this.GenerateAvatar.patch({ alpha: 1 });
    this.color = COLORS.BACKGROUND;
  }

  setOverlayImage() {
    const selectedProfileImageSrc = Utils.asset(
      `images/profiles/profile${this._selectedIndex + 1}.png`
    );
    this.ProfileOverlay.tag("ProfileImage").src = selectedProfileImageSrc;
  }
  _nameInputText = "";

  onKeyPress(key: string) {
    if (key === "BS") {
      this._nameInputText = this._nameInputText.slice(0, -1);
    } else if (key === "OK") {
      console.log("Name confirmed:", this._nameInputText);
      this.saveProfileToFirebase();
    } else if (key === "SP") {
      this._nameInputText += " ";
    } else {
      this._nameInputText += key;
    }

    this.updateNameInput();
  }

  async saveProfileToFirebase() {
    try {
      if (!this._userId) {
        console.error("User ID is undefined. Cannot save profile.");
        return;
      }

      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, "0");

      const year = now.getFullYear();
      const month = pad(now.getMonth() + 1);
      const day = pad(now.getDate());
      const hours = pad(now.getHours());
      const minutes = pad(now.getMinutes());
      const seconds = pad(now.getSeconds());

      const uniqueId = `profile-${year}-${month}-${day}-${hours}-${minutes}-${seconds}-${Math.floor(
        Math.random() * 10000
      )}`;

      const selectedProfileImagePath = `images/profiles/profile${
        this._selectedIndex + 1
      }.png`;

      const userDocRef = doc(db, "users", this._userId);

      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        await updateDoc(userDocRef, {
          profiles: arrayUnion({
            id: uniqueId,
            name: this._nameInputText,
            image: selectedProfileImagePath,
          }),
        });
      } else {
        await setDoc(userDocRef, {
          profiles: [
            {
              id: uniqueId,
              name: this._nameInputText,
              image: selectedProfileImagePath,
            },
          ],
        });
      }

      console.log("Profile saved successfully:", {
        id: uniqueId,
        name: this._nameInputText,
        image: selectedProfileImagePath,
      });

      Router.navigate("profileselection");
    } catch (error) {
      console.error("Error saving profile to Firebase:", error);
    }
  }

  updateNameInput() {
    this.tag("NameInputContainer").setText(this._nameInputText);
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

        override _handleEnter() {
          this.setBlur();

          this._setState("ProfileOverlay");
        }
      },
      class ProfileOverlay extends this {
        override _getFocused() {
          this.ProfileOverlay.patch({
            alpha: 1,
          });
          this.setOverlayImage();

          if (this.ProfileOverlay) {
            this.ProfileOverlay.visible = true;
          }
          return this.tag("LandscapeKeyboardForProfile");
        }

        override _handleBack() {
          this.removeBlur();
          this.ProfileOverlay.visible = false;
          this._setState("ProfilesContainer");
        }
      },
    ];
  }
}

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