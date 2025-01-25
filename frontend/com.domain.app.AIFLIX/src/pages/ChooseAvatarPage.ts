import { Lightning, Utils } from "@lightningjs/sdk";
import SearchInput from "../components/SearchInput";
import { COLORS } from "../../static/constants/Colors";
import Router from "@lightningjs/sdk/src/Router";
import eventBus from "../components/EventBus";
import Topbar from "src/components/Topbar";
import DefaultKeyboardForAvatar from "src/components/DefaultKeyboardForAvatar";
import { Microphone } from "src/components/Microphone";
import { generateImageFromPrompt } from "src/utils/pictureGenerator/pictureGenerator";
import NameInput from "src/components/NameInput";
import { LandscapeKeyboardForProfile } from "src/components/LandscapeKeyboardForProfile";
import {
  addDoc,
  arrayUnion,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "src/services/firebaseService";

interface ChooseAvatarPageTemplateSpec extends Lightning.Component.TemplateSpec {
  SearchInput: typeof SearchInput;
  DefaultKeyboardForAvatar: typeof DefaultKeyboardForAvatar;
  Microphone: typeof Microphone;
  Label: object;
  AvatarImage: object;
  Title: object;
  ProfileOverlay: {
    ProfileImage: object;
    NameInputContainer: typeof NameInput;
    LandscapeKeyboardForProfile: typeof LandscapeKeyboardForProfile;
  };
}

export default class ChooseAvatarPage
  extends Lightning.Component<ChooseAvatarPageTemplateSpec>
  implements Lightning.Component.ImplementTemplateSpec<ChooseAvatarPageTemplateSpec>
{
    // Keep track if an avatar was generated
    private _avatarGenerated: boolean = false;

    // For storing the userId passed from Router params (if needed)
    private _userId?: string;
  
    // For storing the name input text
    private _nameInputText: string = "";
    
    override set params(params: { userId: string }) {
      this._userId = params.userId;
      console.log("Received userId in ChooseAvatarPage:", this._userId);
    }
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
          fontFace: "NetflixSans-Medium",
          textAlign: "center",
        },
      },
      DefaultKeyboardForAvatar: {
        y:348,
        type: DefaultKeyboardForAvatar,
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
        type: Lightning.Component,
        x: 765,
        y: 369,
        src: "",
        w: 400,
        h: 400,
        visible: false,
      },
      ProfileOverlay: {
              zIndex:10,
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

  get Label() {
    return this.getByRef("Label");
  }
  get AvatarImage() {
    return this.getByRef("AvatarImage");
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
    eventBus.on("focusDefaultKeyboardForAvatar", () => {
      console.log("focusDefaultKeyboardForAvatar catched in SearchPage");
      this._setState("DefaultKeyboardForAvatar");
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

  override _enable() {
    this._setState("DefaultKeyboardForAvatar");
    Router.focusPage();
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
      // Instead of: this.AvatarImage.src = image;
      // do this:
      this.AvatarImage?.patch({
        texture: {
          type: Lightning.textures.ImageTexture,
          src: image, // your base64 string
        },
        visible: true,
      });
      
      if (this.Label) {
        this.Label.visible = false;
      }
      this._avatarGenerated = true;
      this._setState("AvatarImageFocus");
    }
  }

  public onKeyPress(key: string) {
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

  private updateNameInput() {
    // Reflect the changed text inside the NameInput component
    this.ProfileOverlay?.tag("NameInputContainer")?.setText(this._nameInputText);
  }

  /**
   * Example of saving profile info to Firebase
   */
  private async saveProfileToFirebase() {
    try {
      if (!this._userId) {
        console.error("User ID is undefined. Cannot save profile.");
        return;
      }
  
      // 1) Build unique ID
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
  
      // 2) The URL from the generated image
      const selectedProfileImagePath = this.AvatarImage?.src || "";
      if (!selectedProfileImagePath) {
        console.warn("No image found to save.");
        return;
      }
  
      // 3) Fetch the image
      const response = await fetch(selectedProfileImagePath);
      if (!response.ok) {
        console.error("Failed to fetch image from:", selectedProfileImagePath);
        return;
      }
      
      console.warn(response)

      // 5) Prepare doc to store in Firestore
      const userDocRef = doc(db, "users", this._userId);
      const userDoc = await getDoc(userDocRef);
  
      const profileData = {
        id: uniqueId,
        name: this._nameInputText,
        image: response.url, 
      };
  
      // 6) Update or set
      if (userDoc.exists()) {
        await updateDoc(userDocRef, {
          profiles: arrayUnion(profileData),
        });
      } else {
        await setDoc(userDocRef, {
          profiles: [profileData],
        });
      }
  
      console.log("Profile saved successfully:", profileData);
  
      // 7) Navigate away
      Router.navigate("profile");
    } catch (error) {
      console.error("Error saving profile to Firebase:", error);
    }
  }

  static override _states() {
    return [
      class DefaultKeyboardForAvatar extends this {
        override _getFocused() {
          return this.tag("DefaultKeyboardForAvatar");
        }
        override _handleUp() {
          console.log("Focus moved up to SearchInput");
          this._setState("SearchInputFocus");
        }
      },
      class AvatarImageFocus extends this {
        override _getFocused() {
          this.AvatarImage?.patch({
            // Example highlight stroke
            shader: {
              type: Lightning.shaders.RoundedRectangle,
              radius: 0,
              stroke: 6,
              strokeColor: COLORS.GREEN_FOCUS,
            },
          });
          // The avatar image is a simple object with a 'src'
          return this.AvatarImage as unknown as Lightning.Component;
        }
        override _handleEnter() {
          this.setBlur();
          console.log("Avatar image clicked, opening overlay...");
          // Copy the generated avatar image to the overlay
          if (this.ProfileImage && this.AvatarImage) {
            this.ProfileImage.patch({
              texture: {
                type: Lightning.textures.ImageTexture,
                src: (this.AvatarImage.texture as any).src,
              },
            });
          }
          // Show the overlay
          if (this.ProfileOverlay) {
            this.ProfileOverlay.visible = true;
          }
          this._setState("ProfileOverlayFocus");
        }
        // Provide a fallback for arrow movements if you want:
        override _handleBack() {
          // e.g., focus something else if needed
          this.removeBlur();
        }
      },
      class ProfileOverlayFocus extends this {
        override _getFocused(): Lightning.Component {
          // The overlay focuses the keyboard by default
          return this.ProfileOverlay?.tag(
            "LandscapeKeyboardForProfile"
          ) as Lightning.Component;
        }
        override _handleBack() {
          console.log("Closing overlay...");
          if (this.ProfileOverlay) {
            this.ProfileOverlay.visible = false;
          }
          this._setState("AvatarImageFocus");
        }
      },
      class SearchInputFocus extends this {
        override _getFocused() {
          return this.tag("SearchInput");
        }
      },
      // If you need a MicrophoneFocus state
      class MicrophoneFocus extends this {
        override _getFocused() {
          return this.tag("Microphone");
        }
      },
    ];
  }
}
