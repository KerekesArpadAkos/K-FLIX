import { Lightning, Router } from "@lightningjs/sdk";
import { Button } from "../components/Button";
import { COLORS } from "../../static/constants/Colors";
import { SCREEN_SIZES } from "../../static/constants/ScreenSizes";
import { doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { db } from "src/services/firebaseService";

interface DeleteProfilePageTemplateSpec extends Lightning.Component.TemplateSpec {
  LogoutMessage: object;
  ConfirmButton: typeof Button;
  CancelButton: typeof Button;
}

export class DeleteProfilePage
  extends Lightning.Component<DeleteProfilePageTemplateSpec>
  implements Lightning.Component.ImplementTemplateSpec<DeleteProfilePageTemplateSpec>
{
  private _userId!: string;
  private _profileId!: string;

  static override _template(): Lightning.Component.Template<DeleteProfilePageTemplateSpec> {
    return {
      color: COLORS.BACKGROUND,
      rect: true,
      w: SCREEN_SIZES.WIDTH,
      h: SCREEN_SIZES.HEIGHT,
      LogoutMessage: {
        x: 298,
        y: 288,
        w: 1323,
        h: 224,
        text: {
          text: "Are you sure you want to delete this profile?",
          fontSize: 80,
          fontFace: "NetflixSans-Medium",
          wordWrapWidth: 1323,
          textAlign: "center",
        },
      },
      ConfirmButton: {
        type: Button,
        x: 414,
        y: 712,
        w: 400,
        h: 105,
        buttonText: "Confirm",
        fontSize: 64,
        textColor: COLORS.WHITE,
        backgroundColor: COLORS.RED_BUTTON,
        shader: {
          type: Lightning.shaders.RoundedRectangle,
          radius: 6,
        },
      },
      CancelButton: {
        type: Button,
        x: 1106,
        y: 712,
        w: 400,
        h: 105,
        buttonText: "Cancel",
        fontSize: 64,
        textColor: COLORS.WHITE,
        backgroundColor: COLORS.RED_BUTTON,
        shader: {
          type: Lightning.shaders.RoundedRectangle,
          radius: 6,
        },
      },
    };
  }

  override set params(params: { userId: string; profileId: string; pageRoute: string }) {
    this._userId = params.userId;
    this._profileId = params.profileId;
  }

  get ConfirmButton() {
    return this.tag("ConfirmButton");
  }

  get CancelButton() {
    return this.tag("CancelButton");
  }

  override _active() {
    this._setState("ConfirmButton");
  }

  async deleteProfileFromFirebase() {
    try {
      if (!this._userId || !this._profileId) {
        console.error("User ID or Profile ID is undefined. Cannot delete profile.");
        return;
      }

      const userDocRef = doc(db, "users", this._userId);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        console.error("User document does not exist.");
        return;
      }

      const userData = userDoc.data();
      const profiles = userData.profiles || [];

      // Find the profile to delete
      const profileToDelete = profiles.find((profile: any) => profile.id === this._profileId);

      if (!profileToDelete) {
        console.error("Profile not found.");
        return;
      }

      // Remove the profile using arrayRemove
      await updateDoc(userDocRef, {
        profiles: arrayRemove(profileToDelete),
      });

      console.log("Profile deleted successfully:", this._profileId);
      localStorage.removeItem("profileId");
      localStorage.removeItem("profileName");
      localStorage.removeItem("profileImage");
      Router.back(); // Navigate back after deletion
    } catch (error) {
      console.error("Error deleting profile from Firebase:", error);
    }
  }
  static override _states() {
    return [
      class ConfirmButton extends this {
        override _getFocused() {
          return this.ConfirmButton;
        }
        override _handleRight() {
          this._setState("CancelButton");
        }
        override _handleEnter() {
            this.deleteProfileFromFirebase();
        }
      },
      class CancelButton extends this {
        override _getFocused() {
          return this.CancelButton;
        }
        override _handleLeft() {
          this._setState("ConfirmButton");
        }
        override _handleEnter() {
          Router.back();
        }
      },
    ];
  }
}
